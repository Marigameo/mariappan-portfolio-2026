import { motion } from "framer-motion"
import { projectsData } from "@/data/portfolio"
import { Code, GraduationCap, BookOpenText, Github } from "lucide-react"
import { BentoCard, BentoGrid } from "@/components/magicui/bento-grid"
import { BorderBeam } from "@/components/ui/border-beam"

const iconMap = {
  Code: Code,
  GraduationCap: GraduationCap,
  BookOpenText: BookOpenText,
}

export function ProjectsSection() {
  return (
    <motion.section
      id="projects"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <div className="space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Indie Builds</h2>
        <p className="text-muted-foreground">Failures were part of the plan 😜</p>
      </div>

      <BentoGrid className="lg:grid-cols-3">
        {projectsData.map((project, index) => {
          const Icon = iconMap[project.icon as keyof typeof iconMap]

          return (
            <BentoCard
              key={project.title}
              name={project.title}
              className={
                index === 0 ? "lg:col-span-2" : "lg:col-span-1"
              }
              Icon={Icon}
              description={project.description}
              href={project.link}
              cta="View Project"
            />
          )
        })}
      </BentoGrid>

      <div className="flex justify-center mt-8">
        <a
          href="https://github.com/Marigameo"
          target="_blank"
          rel="noopener noreferrer"
          className="relative inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-card border border-border text-sm font-medium transition-all duration-300 hover:border-primary overflow-hidden group"
        >
          <Github className="w-4 h-4 transition-transform group-hover:scale-110" />
          <span>More projects, this way</span>
          <BorderBeam
            size={100}
            duration={8}
            delay={0}
            colorFrom="#3b82f6"
            colorTo="#a855f7"
          />
        </a>
      </div>
    </motion.section>
  )
}
