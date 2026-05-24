"use client"

import { usePortfolio } from "@/lib/portfolio-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Briefcase, GraduationCap } from "lucide-react"

export function ExperienceSection() {
  const { data } = usePortfolio()
  const { experiences } = data

  const workExperiences = experiences.filter((exp) => exp.type === "work")
  const education = experiences.filter((exp) => exp.type === "education")

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString("en-US", { year: "numeric", month: "short" })

  const ExperienceCard = ({
    exp,
    icon: Icon,
  }: {
    exp: (typeof experiences)[0]
    icon: typeof Briefcase
  }) => (
    <Card>
      <CardHeader className="pb-3">
        {/*
          Card header:
          - Mobile: icon + text stacked, badge below
          - Tablet+: icon + text inline, badge on the right
        */}
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className="h-10 w-10 md:h-12 md:w-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
              <Icon className="h-5 w-5 md:h-6 md:w-6 text-primary" />
            </div>
            <div className="min-w-0">
              <CardTitle className="text-base md:text-lg leading-snug">{exp.title}</CardTitle>
              <CardDescription className="text-sm mt-0.5">
                {exp.company} • {exp.location}
              </CardDescription>
            </div>
          </div>
          <Badge
            variant={exp.current ? "default" : "secondary"}
            className="self-start sm:self-auto shrink-0 text-xs"
          >
            {exp.current
              ? "Current"
              : `${formatDate(exp.startDate)} – ${exp.endDate ? formatDate(exp.endDate) : "Present"}`}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2">
          {exp.description.map((item, index) => (
            <li key={index} className="text-muted-foreground flex gap-2 text-sm">
              <span className="text-primary mt-1 shrink-0">•</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )

  return (
    <section id="experience" className="section-padding bg-muted/30">
      <div className="container">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-bold mb-8 md:mb-12 text-center">Experience & Education</h2>

          <Tabs defaultValue="work" className="w-full">
            {/* Tab list — full width on mobile */}
            <TabsList className="grid w-full grid-cols-2 mb-6 md:mb-8">
              <TabsTrigger value="work" className="text-sm">Work Experience</TabsTrigger>
              <TabsTrigger value="education" className="text-sm">Education</TabsTrigger>
            </TabsList>

            <TabsContent value="work" className="space-y-4 md:space-y-6">
              {workExperiences.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">No work experience added yet.</p>
              ) : (
                workExperiences.map((exp) => (
                  <ExperienceCard key={exp.id} exp={exp} icon={Briefcase} />
                ))
              )}
            </TabsContent>

            <TabsContent value="education" className="space-y-4 md:space-y-6">
              {education.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">No education added yet.</p>
              ) : (
                education.map((exp) => (
                  <ExperienceCard key={exp.id} exp={exp} icon={GraduationCap} />
                ))
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </section>
  )
}
