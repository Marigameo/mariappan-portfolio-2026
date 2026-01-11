import { motion } from "framer-motion"
import { articlesData } from "@/data/portfolio"
import { File, Folder, Tree } from "@/components/ui/file-tree"
import { ExternalLink } from "lucide-react"
import { BorderBeam } from "@/components/ui/border-beam"

export function ArticlesSection() {
  return (
    <motion.section
      id="articles"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <div className="space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Brain Dumps (Curated)</h2>
        <p className="text-muted-foreground">I meditate with words and untangle thoughts—
sometimes about code, sometimes about life, often about both.</p>
      </div>

      <div className="rounded-lg border border-border/50 p-5">
        <Tree className="w-full" initialExpandedItems={["tech", "life", "product"]}>
          <Folder element="Tech articles" value="tech">
            {articlesData.tech.map((article) => (
              <a
                key={article.title}
                href={article.link}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-primary transition-colors"
              >
                <File value={article.title}>
                  <span>{article.title}</span>
                </File>
              </a>
            ))}
          </Folder>

          <Folder element="Travel, life & more" value="life">
            {articlesData.life.map((article) => (
              <a
                key={article.title}
                href={article.link}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-primary transition-colors"
              >
                <File value={article.title}>
                  <span>{article.title}</span>
                </File>
              </a>
            ))}
          </Folder>

          <Folder element="Product thinking" value="product">
            {articlesData.product.map((article) => (
              <a
                key={article.title}
                href={article.link}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-primary transition-colors"
              >
                <File value={article.title}>
                  <span>{article.title}</span>
                </File>
              </a>
            ))}
          </Folder>
        </Tree>
      </div>

      <div className="flex justify-center pt-2">
        <a
          href="https://medium.com/@mariappan"
          target="_blank"
          rel="noopener noreferrer"
          className="relative inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-card border border-border text-sm font-medium transition-all duration-300 hover:border-primary overflow-hidden group"
        >
          <span>More words, this way</span>
          <ExternalLink className="w-4 h-4 transition-transform group-hover:scale-110" />
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
