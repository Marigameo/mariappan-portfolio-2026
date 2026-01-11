import { motion } from "framer-motion"
import { techTalksData } from "@/data/portfolio"
import { Calendar, MicVocal, ExternalLink, Presentation } from "lucide-react"
import { HeroVideoDialog } from "@/components/magicui/hero-video-dialog"

const TalksSection = () => {
  return (
    <motion.section
      id="talks"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="space-y-4"
    >
      <h2 className="text-3xl font-bold tracking-tight flex items-center gap-2"><span>On Stage, Sometimes</span><MicVocal></MicVocal></h2>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {techTalksData.map((talk, index) => (
          <motion.div
            key={talk.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            className="space-y-3"
          >
            {talk.videoSrc ? (
              <HeroVideoDialog
                animationStyle="from-center"
                videoSrc={talk.videoSrc}
                thumbnailSrc={talk.thumbnailSrc}
                thumbnailAlt={talk.title}
              />
            ) : (
              <a
                href={talk.slides}
                target="_blank"
                rel="noopener noreferrer"
                className="block group relative overflow-hidden rounded-lg border bg-card hover:border-primary transition-colors"
              >
                {talk.thumbnailSrc ? (
                  <img
                    src={talk.thumbnailSrc}
                    alt={talk.title}
                    loading="lazy"
                    className="w-full aspect-video object-cover"
                  />
                ) : (
                  <div className="w-full aspect-video bg-muted flex items-center justify-center">
                    <Presentation className="w-12 h-12 text-muted-foreground" />
                  </div>
                )}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <div className="flex items-center gap-2 text-white">
                    <Presentation className="w-5 h-5" />
                    <span className="font-medium">View Slides</span>
                    <ExternalLink className="w-4 h-4" />
                  </div>
                </div>
              </a>
            )}
            <div className="space-y-1">
              <h3 className="font-semibold leading-tight">{talk.title}</h3>
              <p className="text-sm text-muted-foreground">{talk.event}</p>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Calendar className="w-3 h-3" />
                <span>{talk.date}</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.section>
  )
}

export default TalksSection
