"use client"

import { useState } from "react"
import { usePortfolio } from "@/lib/portfolio-context"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ExternalLink, Github } from "lucide-react"
import Image from "next/image"

const categories = ["all", "web", "design", "animation", "other"] as const

export function ProjectsSection() {
  const { data } = usePortfolio()
  const { projects } = data
  const [selectedCategory, setSelectedCategory] = useState<(typeof categories)[number]>("all")

  const filteredProjects =
    selectedCategory === "all"
      ? projects
      : projects.filter((p) => p.category === selectedCategory)

  return (
    <section id="projects" className="section-padding">
      <div className="container">
        <div className="max-w-6xl mx-auto">
          <h2 className="font-bold mb-3 text-center">Featured Projects</h2>
          <p className="text-muted-foreground text-center mb-8 md:mb-10 max-w-2xl mx-auto text-sm sm:text-base">
            A selection of my recent work across web development, design, and creative projects.
          </p>

          {/* Filter buttons — scroll horizontally on very small screens */}
          <div className="flex flex-wrap justify-center gap-2 mb-8 md:mb-10">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category)}
                className="capitalize min-h-[40px] px-4"
              >
                {category}
              </Button>
            ))}
          </div>

          {/*
            Projects grid:
            - Mobile:  1 column (full-width cards)
            - Tablet:  2 columns
            - Desktop: 3 columns
          */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6">
            {filteredProjects.map((project) => (
              <Card key={project.id} className="overflow-hidden group flex flex-col">
                {/* Project image */}
                <div className="relative aspect-video overflow-hidden shrink-0">
                  <Image
                    src={project.image || "/placeholder.svg"}
                    alt={project.title}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                    sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw"
                  />
                  {project.featured && (
                    <Badge className="absolute top-3 right-3" variant="secondary">
                      Featured
                    </Badge>
                  )}
                </div>

                <CardHeader className="pb-2">
                  <CardTitle className="text-base md:text-lg leading-snug">{project.title}</CardTitle>
                  <CardDescription className="text-sm leading-relaxed line-clamp-2">
                    {project.description}
                  </CardDescription>
                </CardHeader>

                <CardContent className="flex-1">
                  <div className="flex flex-wrap gap-1.5">
                    {project.technologies.map((tech) => (
                      <Badge key={tech} variant="outline" className="text-xs">
                        {tech}
                      </Badge>
                    ))}
                  </div>
                </CardContent>

                <CardFooter className="flex flex-wrap gap-2 pt-3">
                  {project.liveUrl && (
                    <Button size="sm" variant="outline" asChild className="min-h-[40px]">
                      <a href={project.liveUrl} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="mr-1.5 h-3.5 w-3.5" /> Live Demo
                      </a>
                    </Button>
                  )}
                  {project.githubUrl && (
                    <Button size="sm" variant="outline" asChild className="min-h-[40px]">
                      <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                        <Github className="mr-1.5 h-3.5 w-3.5" /> Code
                      </a>
                    </Button>
                  )}
                </CardFooter>
              </Card>
            ))}
          </div>

          {filteredProjects.length === 0 && (
            <p className="text-center text-muted-foreground py-12">
              No projects found in this category.
            </p>
          )}
        </div>
      </div>
    </section>
  )
}
