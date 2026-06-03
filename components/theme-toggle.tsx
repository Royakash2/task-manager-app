"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"

export function ThemeToggle() {
  const { setTheme, resolvedTheme } = useTheme()

  return (
    <Button
      variant="ghost"
      size="icon"
      className="w-9 h-9 rounded-full relative overflow-hidden group hover:bg-muted/50"
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
      aria-label="Toggle theme"
    >
      <div className="relative w-full h-full flex items-center justify-center transition-transform duration-500 ease-[cubic-bezier(0.175,0.885,0.32,1.275)] group-hover:scale-110">
        <Sun 
          className="absolute h-[1.2rem] w-[1.2rem] transition-all duration-500 translate-y-0 rotate-0 opacity-100 text-black dark:-translate-y-10 dark:rotate-90 dark:opacity-0" 
        />
        <Moon 
          className="absolute h-[1.2rem] w-[1.2rem] transition-all duration-500 translate-y-10 -rotate-90 opacity-0 text-blue-400 dark:translate-y-0 dark:rotate-0 dark:opacity-100 dark:text-foreground" 
        />
      </div>
      <span className="sr-only">Toggle theme</span>
    </Button>
  )
}

