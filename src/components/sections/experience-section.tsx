import { motion } from "framer-motion"
import { experienceData } from "@/data/portfolio"
import { Marquee } from "@/components/magicui/marquee"

export function ExperienceSection() {
  return (
    <motion.section
      id="experience"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <div className="space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Been There. Built Things.</h2>
        <p className="text-muted-foreground">(Still proud.)</p>
      </div>

      <div className="relative overflow-hidden">
        {/* Left fade overlay with shadow effect */}
        <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-background via-background/80 to-transparent z-10 pointer-events-none" />
        {/* Right fade overlay with shadow effect */}
        <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-background via-background/80 to-transparent z-10 pointer-events-none" />

        <Marquee pauseOnHover className="[--duration:40s]">
          {experienceData.map((exp) => (
            <div
              key={exp.company}
              className="relative mx-4 flex flex-col items-center justify-center"
            >
              <a
                href={exp.link}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-24 h-24 rounded-2xl bg-card border border-border/50 flex items-center justify-center overflow-hidden hover:border-border hover:scale-110 transition-all duration-300 shadow-sm"
              >
                <img
                  src={exp.logo}
                  alt={exp.company}
                  className="w-16 h-16 object-contain"
                />
              </a>
            </div>
          ))}
        </Marquee>
      </div>
    </motion.section>
  )
}
