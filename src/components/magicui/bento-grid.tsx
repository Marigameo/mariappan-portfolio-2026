import { ComponentPropsWithoutRef, ReactNode } from "react"
import { ArrowRightIcon } from "@radix-ui/react-icons"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"

interface BentoGridProps extends ComponentPropsWithoutRef<"div"> {
  children: ReactNode
  className?: string
}

interface BentoCardProps extends ComponentPropsWithoutRef<"div"> {
  name: string
  className: string
  background?: ReactNode
  Icon?: React.ElementType
  image?: string
  description: string
  href: string
  cta: string
}

const BentoGrid = ({ children, className, ...props }: BentoGridProps) => {
  return (
    <div
      className={cn(
        "grid w-full auto-rows-[22rem] grid-cols-3 gap-4",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

const BentoCard = ({
  name,
  className,
  background,
  Icon,
  image,
  description,
  href,
  cta,
  ...props
}: BentoCardProps) => (
  <div
    key={name}
    className={cn(
      "group relative col-span-3 flex flex-col justify-between overflow-hidden rounded-xl",
      // Use theme card background with shadows
      "bg-card border border-border/50",
      "shadow-[0_1px_3px_rgba(0,0,0,0.05),0_4px_12px_rgba(0,0,0,0.08)]",
      "dark:shadow-[0_1px_3px_rgba(0,0,0,0.4),0_4px_16px_rgba(0,0,0,0.5)]",
      className
    )}
    {...props}
  >
    {/* Dot grid pattern background */}
    <div
      className="absolute inset-0 opacity-[0.15] dark:opacity-[0.08]"
      style={{
        backgroundImage: `radial-gradient(circle, currentColor 1px, transparent 1px)`,
        backgroundSize: '16px 16px',
      }}
    />

    {background && <div>{background}</div>}

    <div className="relative flex flex-col justify-end p-6 h-full min-h-[22rem]">
      <div className="flex flex-col gap-3 transition-all duration-300 group-hover:-translate-y-2">
        {image ? (
          <img
            src={image}
            alt={name}
            className="h-12 w-12 object-cover rounded-lg ring-1 ring-border/50 dark:ring-border transition-all duration-300 ease-in-out group-hover:scale-105 group-hover:ring-border"
          />
        ) : Icon ? (
          <Icon className="h-12 w-12 dark:text-purple-100 text-zinc-600 transition-all duration-300 ease-in-out group-hover:scale-110" />
        ) : null}
        <h3 className="text-xl font-semibold dark:text-purple-100 text-zinc-600">
          {name}
        </h3>
        <p className="max-w-lg text-muted-foreground">{description}</p>
      </div>

      <div className="mt-4 flex items-center opacity-0 translate-y-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0">
        <a
          href={href}
          className={cn(
            buttonVariants({ variant: "link", size: "sm" }),
            "p-0 inline-flex items-center whitespace-nowrap"
          )}
        >
          {cta}
          <ArrowRightIcon className="ms-2 h-4 w-4 rtl:rotate-180" />
        </a>
      </div>
    </div>

    <div className="pointer-events-none absolute inset-0 transform-gpu transition-all duration-300 group-hover:bg-foreground/[.02] dark:group-hover:bg-foreground/[.05]" />
  </div>
)

export { BentoCard, BentoGrid }
