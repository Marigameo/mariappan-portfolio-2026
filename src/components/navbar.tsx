import { motion } from "framer-motion"
import { Home, BookOpenText, Mic, FolderCode } from "lucide-react"
import { Dock, DockIcon } from "@/components/magicui/dock"
import { AnimatedThemeToggler } from "@/components/magicui/animated-theme-toggler"

export function Navbar() {
  const navItems = [
    { name: "Home", href: "#", icon: Home },
    { name: "Projects", href: "#projects", icon: FolderCode },
    { name: "Articles", href: "#articles", icon: BookOpenText },
    { name: "Talks", href: "#talks", icon: Mic },
  ]

  return (
    <>
      {/* Desktop/Tablet: Left-center dock */}
      <motion.nav
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="hidden md:flex fixed left-4 top-1/2 -translate-y-1/2 z-50"
      >
        <Dock className="flex-col shadow-lg">
          {navItems.map((item) => (
            <DockIcon key={item.name}>
              <a
                href={item.href}
                className="flex items-center justify-center w-full h-full text-muted-foreground hover:text-foreground transition-colors"
                aria-label={item.name}
              >
                <item.icon className="w-5 h-5" />
              </a>
            </DockIcon>
          ))}

          <DockIcon className="border-t border-border/50 mt-1 pt-1">
            <AnimatedThemeToggler className="flex items-center justify-center w-full h-full text-muted-foreground hover:text-foreground transition-colors" />
          </DockIcon>
        </Dock>
      </motion.nav>

      {/* Mobile: Bottom dock */}
      <motion.nav
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="md:hidden fixed bottom-0 left-0 right-0 z-50 px-6 py-4"
      >
        <Dock className="mx-auto shadow-lg">
          {navItems.map((item) => (
            <DockIcon key={item.name}>
              <a
                href={item.href}
                className="flex items-center justify-center w-full h-full text-muted-foreground hover:text-foreground transition-colors"
                aria-label={item.name}
              >
                <item.icon className="w-5 h-5" />
              </a>
            </DockIcon>
          ))}

          <DockIcon className="border-l border-border/50 ml-1 pl-1">
            <AnimatedThemeToggler className="flex items-center justify-center w-full h-full text-muted-foreground hover:text-foreground transition-colors" />
          </DockIcon>
        </Dock>
      </motion.nav>
    </>
  )
}
