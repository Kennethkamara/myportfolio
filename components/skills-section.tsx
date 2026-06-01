"use client"

import { usePortfolio } from "@/lib/portfolio-context"

const categoryLabels: Record<string, string> = {
  frontend: "Frontend",
  backend: "Backend",
  database: "Database",
  design: "Design",
  tools: "Tools",
  other: "Other",
}

const categoryOrder = ["frontend", "backend", "database", "design", "tools", "other"]

export function SkillsSection() {
  const { data } = usePortfolio()
  const { skills } = data

  const groupedSkills = skills.reduce(
    (acc, skill) => {
      if (!acc[skill.category]) acc[skill.category] = []
      acc[skill.category].push(skill)
      return acc
    },
    {} as Record<string, typeof skills>,
  )

  // Sort categories by predefined order
  const sortedCategories = Object.keys(groupedSkills).sort(
    (a, b) => categoryOrder.indexOf(a) - categoryOrder.indexOf(b)
  )

  return (
    <section id="skills" className="section-padding bg-muted/30">
      <div className="container">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-bold mb-3 text-center">What I Use</h2>
          <p className="text-muted-foreground text-center mb-8 md:mb-12 max-w-xl mx-auto text-sm sm:text-base">
            Technologies and tools I work with every day.
          </p>

          <div className="space-y-6">
            {sortedCategories.map((category) => (
              <div key={category} className="flex flex-col sm:flex-row sm:items-start gap-3 sm:gap-4">
                <span className="text-sm font-semibold text-foreground min-w-[80px] sm:text-right">
                  {categoryLabels[category] ?? category}
                </span>
                <div className="flex flex-wrap gap-2">
                  {groupedSkills[category].map((skill) => (
                    <span
                      key={skill.id}
                      className="px-3 py-1.5 text-sm bg-background border border-border rounded-full text-muted-foreground hover:text-foreground hover:border-foreground/30 transition-colors"
                    >
                      {skill.name}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
