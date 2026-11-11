// Cut, scale and re-encode a screen recording for the web, with no ffmpeg.
//
//   swift .claude/skills/ux-story/scripts/clip.swift <in.mov> <out.mp4> \
//     [--start 4] [--duration 8] [--width 1600] [--kbps 1800] [--fps 30] \
//     [--crop x,y,w,h] [--poster out.png]
//
// H.264 in an .mp4, no audio, fast-start. --crop is in source pixels and is
// applied before scaling. --poster writes the clip's first frame as a PNG,
// to run through shots.mjs. Screen recordings of UI look clean at about
// 1500-2500 kbps for 1600px wide; check the size it prints.
import AVFoundation
import AppKit

var opts: [String: String] = [:]
var pos: [String] = []
var i = 1
let a = CommandLine.arguments
while i < a.count {
  if a[i].hasPrefix("--") { opts[String(a[i].dropFirst(2))] = a[i + 1]; i += 2 } else { pos.append(a[i]); i += 1 }
}
guard pos.count == 2 else { print("usage: clip.swift <in> <out.mp4> [options]"); exit(1) }
let inURL = URL(fileURLWithPath: pos[0])
let outURL = URL(fileURLWithPath: pos[1])
try? FileManager.default.removeItem(at: outURL)

let sem = DispatchSemaphore(value: 0)
Task {
  do {
    let asset = AVURLAsset(url: inURL)
    let track = try await asset.loadTracks(withMediaType: .video).first!
    let natural = try await track.load(.naturalSize)
    let totalTime = try await asset.load(.duration)
    let total = totalTime.seconds
    let start = Double(opts["start"] ?? "0")!
    let dur = min(Double(opts["duration"] ?? "\(total)")!, total - start)
    let fps = Double(opts["fps"] ?? "30")!
    let kbps = Int(opts["kbps"] ?? "1800")!

    var crop = CGRect(origin: .zero, size: natural)
    if let c = opts["crop"] {
      let v = c.split(separator: ",").map { Double($0)! }
      crop = CGRect(x: v[0], y: v[1], width: v[2], height: v[3])
    }
    var outW = Double(opts["width"] ?? "\(Int(crop.width))")!
    outW = min(outW, crop.width)
    var outH = (crop.height * outW / crop.width).rounded()
    outW = (outW / 2).rounded() * 2
    outH = (outH / 2).rounded() * 2

    // A composition does the trim, crop and scale in one pass.
    let comp = AVMutableVideoComposition()
    comp.renderSize = CGSize(width: outW, height: outH)
    comp.frameDuration = CMTime(value: 1, timescale: CMTimeScale(fps))
    let inst = AVMutableVideoCompositionInstruction()
    inst.timeRange = CMTimeRange(start: .zero, duration: totalTime)
    let layer = AVMutableVideoCompositionLayerInstruction(assetTrack: track)
    let s = outW / crop.width
    // Video coordinates have y down here; move the crop's origin to 0,0, then scale.
    let t = CGAffineTransform(translationX: -crop.minX, y: -crop.minY).concatenating(CGAffineTransform(scaleX: s, y: s))
    layer.setTransform(t, at: .zero)
    inst.layerInstructions = [layer]
    comp.instructions = [inst]

    let range = CMTimeRange(start: CMTime(seconds: start, preferredTimescale: 600), duration: CMTime(seconds: dur, preferredTimescale: 600))
    let reader = try AVAssetReader(asset: asset)
    reader.timeRange = range
    let rOut = AVAssetReaderVideoCompositionOutput(videoTracks: [track], videoSettings: [kCVPixelBufferPixelFormatTypeKey as String: kCVPixelFormatType_32BGRA])
    rOut.videoComposition = comp
    reader.add(rOut)

    let writer = try AVAssetWriter(outputURL: outURL, fileType: .mp4)
    writer.shouldOptimizeForNetworkUse = true
    let wIn = AVAssetWriterInput(mediaType: .video, outputSettings: [
      AVVideoCodecKey: AVVideoCodecType.h264,
      AVVideoWidthKey: outW,
      AVVideoHeightKey: outH,
      AVVideoCompressionPropertiesKey: [
        AVVideoAverageBitRateKey: kbps * 1000,
        AVVideoProfileLevelKey: AVVideoProfileLevelH264HighAutoLevel,
        AVVideoExpectedSourceFrameRateKey: fps,
        AVVideoMaxKeyFrameIntervalKey: Int(fps * 2),
      ],
    ])
    wIn.expectsMediaDataInRealTime = false
    writer.add(wIn)
    reader.startReading()
    writer.startWriting()
    writer.startSession(atSourceTime: range.start)

    var posterDone = opts["poster"] == nil
    while let sample = rOut.copyNextSampleBuffer() {
      while !wIn.isReadyForMoreMediaData { usleep(2000) }
      if !posterDone, let pb = CMSampleBufferGetImageBuffer(sample) {
        let ci = CIImage(cvPixelBuffer: pb)
        let rep = NSBitmapImageRep(ciImage: ci)
        try rep.representation(using: .png, properties: [:])!.write(to: URL(fileURLWithPath: opts["poster"]!))
        posterDone = true
      }
      wIn.append(sample)
    }
    wIn.markAsFinished()
    await writer.finishWriting()
    if writer.status != .completed { print("failed:", writer.error ?? "unknown"); exit(1) }
    let bytes = (try FileManager.default.attributesOfItem(atPath: outURL.path)[.size] as! Int)
    print(String(format: "%@  %.0fx%.0f  %.1fs  %.2f MB", outURL.lastPathComponent, outW, outH, dur, Double(bytes) / 1_048_576))
  } catch {
    print("error:", error); exit(1)
  }
  sem.signal()
}
sem.wait()
