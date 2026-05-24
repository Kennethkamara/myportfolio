"use client"

import type { ReactNode } from "react"
import { Analytics } from "@vercel/analytics/next"
import { PortfolioProvider } from "@/lib/portfolio-context"
import { ThemeProvider } from "@/components/theme-provider"

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      <PortfolioProvider>
        {children}
        <Analytics />
      </PortfolioProvider>
    </ThemeProvider>
  )
}
