import { Card } from "@/components/ui/card"
import { BorderBeam } from "@/components/ui/border-beam"
import { Github, Linkedin, Twitter, Mail } from "lucide-react"
import { motion } from "framer-motion"
import { profileData } from "@/data/portfolio"

const iconMap = {
  Github,
  Linkedin,
  Twitter,
  Mail,
}

export function ProfileCard() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="relative p-8 border-border/60 backdrop-blur-sm flex flex-col overflow-hidden shadow-md dark:shadow-sm">
        <BorderBeam size={200} duration={8} delay={0} />
        <div className="flex flex-col items-center text-center space-y-8 flex-1">
          {/* Profile Photo */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="relative w-60 h-60 rounded-2xl overflow-hidden ring-2 ring-black/5 dark:ring-border/70 ring-offset-4 ring-offset-background shadow-sm"
          >
            <img
              src="/images/profile.svg"
              alt={profileData.name}
              className="absolute inset-0 w-full h-full object-cover"
            />
          </motion.div>

          {/* Name and Tagline */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="space-y-3"
          >
            <h1 className="text-3xl font-bold tracking-tight">
              {profileData.name}
            </h1>
            <p className="text-muted-foreground text-base leading-relaxed max-w-sm">
              {profileData.tagline}
            </p>
          </motion.div>

          {/* Social Links */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex gap-3 pt-4"
          >
            {profileData.social.map((social, index) => {
              const Icon = iconMap[social.icon as keyof typeof iconMap]
              return (
                <motion.a
                  key={social.name}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 rounded-xl border border-border/70 flex items-center justify-center hover:border-foreground/30 hover:bg-accent hover:shadow-sm transition-all duration-300 bg-card/50 dark:bg-transparent dark:border-border/50"
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                >
                  <Icon className="w-5 h-5" />
                </motion.a>
              )
            })}
          </motion.div>

          {/* Spacer to push content to top */}
          <div className="flex-1" />
        </div>
      </Card>
    </motion.div>
  )
}
