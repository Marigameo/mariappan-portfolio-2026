import { Card } from "@/components/ui/card"
import { BorderBeam } from "@/components/ui/border-beam"
import { motion } from "framer-motion"
import { profileData } from "@/data/portfolio"
import { Pen, Camera } from "lucide-react"

const InstagramIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="w-5 h-5"
  >
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
)

const iconMap = {
  Pen,
  Camera,
}

export function InstagramCard() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <Card className="relative p-6 border-border/50 backdrop-blur-sm overflow-hidden">
        <BorderBeam size={150} duration={10} delay={2} />

        <div className="space-y-4">
          <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
            <InstagramIcon />
            <span>Parallel Lives</span>
          </div>

          <div className="space-y-3">
            {profileData.instagramHandles.map((handle, index) => {
              const Icon = iconMap[handle.icon as keyof typeof iconMap]

              return (
                <motion.a
                  key={handle.name}
                  href={handle.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3 rounded-lg border border-border/50 hover:border-foreground/50 hover:bg-accent/50 transition-all duration-300 group"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  whileHover={{ scale: 1.02, x: 4 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                    <InstagramIcon />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-sm">@{handle.name}</span>
                      {Icon && <Icon className="w-3.5 h-3.5 text-muted-foreground" />}
                    </div>
                    <p className="text-xs text-muted-foreground truncate">
                      {handle.description}
                    </p>
                  </div>

                  <svg
                    className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </motion.a>
              )
            })}
          </div>
        </div>
      </Card>
    </motion.div>
  )
}
