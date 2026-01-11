import React, { ComponentPropsWithoutRef, CSSProperties } from "react"

import { cn } from "@/lib/utils"

export interface ShimmerButtonProps extends ComponentPropsWithoutRef<"button"> {
  shimmerColor?: string
  shimmerSize?: string
  borderRadius?: string
  shimmerDuration?: string
  background?: string
  className?: string
  children?: React.ReactNode
}

export const ShimmerButton = React.forwardRef<
  HTMLButtonElement,
  ShimmerButtonProps
>(
  (
    {
      shimmerColor = "#ffffff",
      shimmerSize = "0.05em",
      shimmerDuration = "3s",
      borderRadius = "8px",
      background,
      className,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <button
        style={
          {
            "--spread": "20deg",
            "--shimmer-color": shimmerColor,
            "--radius": borderRadius,
            "--speed": shimmerDuration,
            "--cut": shimmerSize,
            "--bg": background,
          } as CSSProperties
        }
        className={cn(
          "group relative z-0 flex cursor-pointer items-center justify-center overflow-hidden [border-radius:var(--radius)] border border-border px-4 py-2 text-sm whitespace-nowrap",
          // Light theme: dark bg, light text
          "bg-foreground text-background",
          // Dark theme: dark bg, light text
          "dark:bg-card dark:text-foreground",
          "transform-gpu transition-transform duration-300 ease-in-out active:translate-y-px",
          className
        )}
        ref={ref}
        {...props}
      >
        {/* spark container */}
        <div
          className={cn(
            "-z-30 blur-[1px] dark:blur-[0.5px]",
            "[container-type:size] absolute inset-0 overflow-visible"
          )}
        >
          {/* spark */}
          <div className="animate-shimmer-slide absolute inset-0 [aspect-ratio:1] h-[100cqh] [border-radius:0] [mask:none]">
            {/* spark before - thin line with gradient for light mode, subtle gray for dark mode */}
            <div className="animate-spin-around absolute -inset-full w-auto [translate:0_0] rotate-0
              [background:conic-gradient(from_calc(270deg-(var(--spread)*0.5)),transparent_0,transparent_calc(var(--spread)*0.2),rgba(59,130,246,0.8)_calc(var(--spread)*0.5),rgba(168,85,247,0.8)_calc(var(--spread)*0.5),transparent_calc(var(--spread)*0.8),transparent_var(--spread))]
              dark:[background:conic-gradient(from_calc(270deg-(var(--spread)*0.5)),transparent_0,transparent_calc(var(--spread)*0.3),rgba(156,163,175,0.4)_calc(var(--spread)*0.5),transparent_calc(var(--spread)*0.7),transparent_var(--spread))]" />
          </div>
        </div>
        {children}

        {/* Highlight */}
        <div
          className={cn(
            "absolute inset-0 size-full",

            "rounded-lg px-4 py-2 text-sm font-medium shadow-[inset_0_-4px_6px_rgba(255,255,255,0.1)]",

            // transition
            "transform-gpu transition-all duration-300 ease-in-out",

            // on hover
            "group-hover:shadow-[inset_0_-3px_6px_rgba(255,255,255,0.2)]",

            // on click
            "group-active:shadow-[inset_0_-5px_6px_rgba(255,255,255,0.2)]"
          )}
        />

        {/* backdrop */}
        <div
          className={cn(
            "absolute [inset:var(--cut)] -z-20 [border-radius:var(--radius)]",
            "bg-foreground dark:bg-card"
          )}
        />
      </button>
    )
  }
)

ShimmerButton.displayName = "ShimmerButton"
