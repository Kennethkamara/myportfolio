"use client"

import { usePortfolio } from "@/lib/portfolio-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

const categoryLabels: Record<string, string> = {
  frontend: "Frontend Development",
  backend: "Backend Development",
  design: "Design & Creative",
  tools: "Tools & Technologies",
  other: "Other Skills",
}

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

  return (
    <section id="skills" className="section-padding bg-muted/30">
      <div className="container">
        <div className="max-w-6xl mx-auto">
          <h2 className="font-bold mb-3 text-center">Skills & Expertise</h2>
          <p className="text-muted-foreground text-center mb-8 md:mb-12 max-w-xl mx-auto text-sm sm:text-base">
            Technologies and tools I work with every day.
          </p>

          {/*
            Skills grid:
            - Mobile:  1 column
            - Tablet:  2 columns
            - Desktop: 3 columns
          */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6">
            {Object.entries(groupedSkills).map(([category, categorySkills]) => (
              <Card key={category} className="h-full">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base md:text-lg">
                    {categoryLabels[category] ?? category}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 md:space-y-4">
                  {categorySkills.map((skill) => (
                    <div key={skill.id} className="space-y-1.5">
                      <div className="flex justify-between items-center gap-2">
                        <span className="text-sm font-medium truncate">{skill.name}</span>
                        <span className="text-xs text-muted-foreground shrink-0">{skill.level}%</span>
                      </div>
                      <Progress value={skill.level} className="h-1.5" />
                    </div>
                  ))}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
