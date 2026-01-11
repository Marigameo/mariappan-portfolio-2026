import { motion } from "framer-motion"
import { aboutData } from "@/data/portfolio"
import { Terminal, TypingAnimation, AnimatedSpan } from "@/components/magicui/terminal"
import * as LucideIcons from "lucide-react"

export function AboutSection() {
  return (
    <motion.section
      id="about"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <div className="space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">{aboutData.title}</h2>
        <p className="text-muted-foreground inline-flex items-center gap-1"><span>{aboutData.description}</span><LucideIcons.Coffee className="w-4 h-4 text-amber-600" /></p>
      </div>

      <Terminal className="max-w-full">
        <TypingAnimation duration={30} className="dark:text-zinc-400 text-zinc-600">$ whoami</TypingAnimation>
        <AnimatedSpan className="text-primary font-semibold">{aboutData.name}</AnimatedSpan>

        <AnimatedSpan className="h-4">&nbsp;</AnimatedSpan>
        <TypingAnimation duration={30} className="dark:text-zinc-400 text-zinc-600">$ cat about.txt</TypingAnimation>
        <AnimatedSpan className="inline-flex items-center gap-1"><span className="text-cyan-400">{aboutData.summary.highlight} </span><span className="text-muted-foreground">- {aboutData.summary.description}</span></AnimatedSpan>

        <AnimatedSpan className="h-4">&nbsp;</AnimatedSpan>
        <TypingAnimation duration={30} className="dark:text-zinc-400 text-zinc-600">$ cat life.txt</TypingAnimation>
        {aboutData.interests.map((interest) => {
          const Icon = LucideIcons[interest.icon as keyof typeof LucideIcons] as React.ElementType
          return (
            <AnimatedSpan key={interest.text} className="text-muted-foreground flex items-center gap-2">
              <Icon className={`w-4 h-4 ${interest.color}`} />
              <span>{interest.text}</span>
            </AnimatedSpan>
          )
        })}

        <AnimatedSpan className="h-4">&nbsp;</AnimatedSpan>
        <TypingAnimation duration={30} className="dark:text-zinc-400 text-zinc-600">$ echo $STATUS</TypingAnimation>
        <AnimatedSpan className="text-green-500">{aboutData.status}</AnimatedSpan>
      </Terminal>
    </motion.section>
  )
}
