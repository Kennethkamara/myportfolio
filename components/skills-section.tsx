"use client"

import { usePortfolio } from "@/lib/portfolio-context"

const colorMap: Record<string, string> = {
  cyan: "bg-cyan-500",
  green: "bg-green-500",
  purple: "bg-purple-500",
  pink: "bg-pink-500",
  orange: "bg-orange-500",
  teal: "bg-teal-500",
}

const categoryOrder = ["frontend", "backend", "database", "design", "tools", "other"]

export function SkillsSection() {
  const { data } = usePortfolio()
  const { skills, skillCategories } = data

  const groupedSkills = skills.reduce(
    (acc, skill) => {
      if (!acc[skill.category]) acc[skill.category] = []
      acc[skill.category].push(skill)
      return acc
    },
    {} as Record<string, typeof skills>,
  )

  // Sort categories by predefined order and filter to only those with skills
  const sortedCategories = skillCategories
    .filter((cat) => groupedSkills[cat.id]?.length > 0)
    .sort((a, b) => categoryOrder.indexOf(a.id) - categoryOrder.indexOf(b.id))

  return (
    <section id="skills" className="section-padding bg-muted/30">
      <div className="container">
        <div className="max-w-6xl mx-auto">
          <h2 className="font-bold mb-3 text-center">Skills &amp; Expertise</h2>
          <p className="text-muted-foreground text-center mb-8 md:mb-12 max-w-xl mx-auto text-sm sm:text-base">
            Technologies and tools I work with to bring ideas to life.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {sortedCategories.map((category) => (
              <div
                key={category.id}
                className="bg-card border border-border rounded-xl p-5 md:p-6 hover:border-foreground/20 transition-colors"
              >
                <div className="flex items-center gap-3 mb-2">
                  <span
                    className={`w-3 h-3 rounded-full ${colorMap[category.color] || "bg-foreground"}`}
                  />
                  <h3 className="font-semibold text-foreground">{category.title}</h3>
                </div>
                <p className="text-muted-foreground text-sm mb-4">
                  {category.description}
                </p>
                <div className="flex flex-wrap gap-2">
                  {groupedSkills[category.id].map((skill) => (
                    <span
                      key={skill.id}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm bg-muted/50 border border-border rounded-md text-muted-foreground hover:text-foreground hover:border-foreground/30 transition-colors"
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
