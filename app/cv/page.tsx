"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  Award,
  Briefcase,
  Download,
  GraduationCap,
  Mail,
  MapPin,
  Phone,
  Sparkles,
} from "lucide-react";
import { usePortfolio } from "@/lib/portfolio-context";
import { Button } from "@/components/ui/button";

export default function CVPage() {
  const { data } = usePortfolio();
  const { personalInfo, experiences, skills, projects } = data;
  const workExperience = experiences.filter((item) => item.type === "work");
  const educationExperience = experiences.filter((item) => item.type === "education");
  const certifications = experiences.filter((item) => item.type === "certification");
  const skillTags = skills.slice(0, 12);

  return (
    <main className="min-h-screen bg-background text-foreground px-4 sm:px-6 lg:px-8 py-8">
      <div className="mx-auto max-w-6xl space-y-10">
        <header className="relative overflow-hidden rounded-[2rem] border border-border/70 bg-card/95 p-8 shadow-[0_35px_120px_-40px_rgba(0,0,0,0.2)]">
          <div className="pointer-events-none absolute -top-12 left-1/2 h-52 w-52 -translate-x-1/2 rounded-full bg-accent/15 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-12 right-10 h-40 w-40 rounded-full bg-secondary/15 blur-3xl" />
          <div className="relative flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
            <div className="space-y-5 max-w-3xl">
                <p className="text-xs uppercase tracking-[0.5em] text-muted-foreground dark:text-accent/80">Curriculum Vitae</p>
              <div className="space-y-3">
                <h1 className="text-5xl font-semibold tracking-tight sm:text-6xl">
                  {personalInfo.name}
                </h1>
                <p className="text-base leading-7 text-muted-foreground sm:text-lg">
                  {personalInfo.title}
                </p>
              </div>
              {personalInfo.bio && (
                <p className="max-w-2xl text-sm leading-7 text-muted-foreground sm:text-base">
                  {personalInfo.bio}
                </p>
              )}
            </div>
            <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-end">
              <Link
                href="/"
                className="inline-flex items-center gap-2 rounded-full border border-border/30 bg-background/90 px-5 py-3 text-sm text-foreground transition hover:bg-background/95"
              >
                <ArrowLeft className="h-4 w-4" /> Back home
              </Link>
              {personalInfo.cvUrl && (
                <Button
                  size="sm"
                  asChild
                  className="inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/15 px-5 py-3 text-sm text-foreground hover:bg-accent/20"
                >
                  <a href={personalInfo.cvUrl} target="_blank" rel="noreferrer">
                    <Download className="h-4 w-4" /> Download PDF
                  </a>
                </Button>
              )}
            </div>
          </div>
        </header>

        <div className="grid gap-6 lg:grid-cols-[minmax(280px,340px)_1fr]">
          <aside className="space-y-6 rounded-[2rem] border border-border/60 bg-card/95 p-6 md:p-8 shadow-2xl">
            <div className="flex flex-col items-center gap-5 text-center">
              <div className="relative h-36 w-36 sm:h-40 sm:w-40 md:h-44 md:w-44 overflow-hidden rounded-full border-4 border-border/70 bg-background shadow-xl">
                <Image
                  src={personalInfo.avatar || "/placeholder.svg"}
                  alt={personalInfo.name}
                  fill
                  className="object-cover object-[center_40%]"
                />
              </div>
              <div>
                <p className="text-xl font-semibold text-foreground">{personalInfo.name}</p>
                <p className="mt-2 text-sm uppercase tracking-[0.3em] text-muted-foreground">
                  {personalInfo.title}
                </p>
              </div>
            </div>

            <section className="space-y-6">
              <div className="space-y-3 rounded-[1.75rem] border border-border/60 bg-card/85 p-5 sm:p-6">
                <p className="text-lg font-semibold text-foreground">Contact</p>
                <div className="space-y-3 text-sm text-muted-foreground">
                  <div className="flex items-center gap-3">
                    <MapPin className="h-4 w-4 text-accent" />
                    <span>{personalInfo.location}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Mail className="h-4 w-4 text-accent" />
                    <span>{personalInfo.email}</span>
                  </div>
                  {personalInfo.phone && (
                    <div className="flex items-center gap-3">
                      <Phone className="h-4 w-4 text-accent" />
                      <span>{personalInfo.phone}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-3 rounded-[1.75rem] border border-border/60 bg-card/85 p-5 sm:p-6">
                <p className="text-lg font-semibold text-foreground">Profile</p>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {personalInfo.bio}
                </p>
              </div>

              <div className="rounded-[1.75rem] border border-border/60 bg-card/85 p-6">
                <p className="text-lg font-semibold text-foreground">Skills</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {skillTags.map((skill) => (
                    <span
                      key={skill.id}
                      className="rounded-full border border-border/50 bg-background/10 px-3 py-2 text-xs font-medium text-foreground"
                    >
                      {skill.name}
                    </span>
                  ))}
                </div>
              </div>
            </section>
          </aside>

          <section className="space-y-6">
            <div className="rounded-[2rem] border border-border/60 bg-card/95 p-8 shadow-xl">
              <div className="flex items-center justify-between gap-4">
                <p className="text-xl font-semibold text-foreground">Work Experience</p>
                <span className="text-sm text-muted-foreground">
                  {workExperience.length} entries
                </span>
              </div>
              <div className="mt-6 space-y-5">
                {workExperience.length === 0 ? (
                  <div className="rounded-[1.75rem] bg-card/90 p-6">
                    <p className="text-sm text-muted-foreground">
                      No work experience added yet.
                    </p>
                  </div>
                ) : (
                  workExperience.map((experience) => (
                    <article
                      key={experience.id}
                      className="group relative overflow-hidden rounded-[1.75rem] border border-border/60 bg-card/80 p-6 shadow-sm transition hover:-translate-y-0.5"
                    >
                      <div className="absolute inset-x-6 top-6 h-0.5 rounded-full bg-accent/20 opacity-60 group-hover:bg-accent/40" />
                      <div className="relative space-y-4">
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                          <div>
                            <h2 className="text-xl font-semibold text-foreground">
                              {experience.title}
                            </h2>
                            <p className="text-sm text-muted-foreground">
                              {experience.company} · {experience.location}
                            </p>
                          </div>
                          <span className="rounded-full bg-background/10 px-4 py-2 text-sm text-muted-foreground">
                            {experience.startDate} — {experience.current ? "Present" : experience.endDate}
                          </span>
                        </div>
                        {experience.description.length > 0 && (
                          <ul className="list-disc space-y-2 pl-5 text-sm text-muted-foreground">
                            {experience.description.map((item, index) => (
                              <li key={index}>{item}</li>
                            ))}
                          </ul>
                        )}
                      </div>
                    </article>
                  ))
                )}
              </div>
            </div>

            <div className="rounded-[2rem] border border-border/60 bg-card/95 p-8 shadow-xl">
              <div className="flex items-center justify-between gap-4">
                <div className="space-y-2">
                  <div className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.35em] text-accent">
                    <GraduationCap className="h-4 w-4" />
                    Education
                  </div>
                  <p className="text-sm text-muted-foreground">Academic credentials and coursework.</p>
                </div>
                <span className="rounded-full bg-background/10 px-4 py-2 text-sm text-muted-foreground">
                  {educationExperience.length} entries
                </span>
              </div>
              <div className="mt-6 space-y-5">
                {educationExperience.length === 0 ? (
                  <div className="rounded-[1.75rem] bg-card/90 p-6">
                    <p className="text-sm text-muted-foreground">
                      No education entries added yet.
                    </p>
                  </div>
                ) : (
                  educationExperience.map((education) => (
                    <article
                      key={education.id}
                      className="space-y-4 rounded-[1.75rem] border border-border/60 bg-card/80 p-6"
                    >
                      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                        <div className="space-y-3">
                          <h2 className="text-xl font-semibold text-foreground">
                            {education.title}
                          </h2>
                          <p className="text-sm text-muted-foreground">
                            {education.company} · {education.location}
                          </p>
                          {education.description.length > 0 && (
                            <ul className="list-disc space-y-2 pl-5 text-sm text-muted-foreground">
                              {education.description.map((item, index) => (
                                <li key={index}>{item}</li>
                              ))}
                            </ul>
                          )}
                        </div>
                        <span className="whitespace-nowrap rounded-full bg-background/10 px-4 py-2 text-sm text-muted-foreground">
                          {education.startDate} — {education.endDate}
                        </span>
                      </div>
                    </article>
                  ))
                )}
              </div>
            </div>

            <div className="rounded-[2rem] border border-border/60 bg-card/95 p-8 shadow-xl">
              <div className="flex items-center justify-between gap-4">
                <p className="text-xl font-semibold text-foreground">Featured Projects</p>
                <span className="text-sm text-muted-foreground">
                  {projects.slice(0, 3).length} entries
                </span>
              </div>
              <div className="mt-6 space-y-5">
                {projects.slice(0, 3).length === 0 ? (
                  <div className="rounded-[1.75rem] bg-card/90 p-6">
                    <p className="text-sm text-muted-foreground">
                      No projects added yet.
                    </p>
                  </div>
                ) : (
                  projects.slice(0, 3).map((project) => (
                    <article
                      key={project.id}
                      className="space-y-4 rounded-[1.75rem] border border-border/60 bg-card/80 p-6"
                    >
                      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                        <h2 className="text-xl font-semibold text-foreground">
                          {project.title}
                        </h2>
                        <span className="rounded-full bg-background/10 px-4 py-2 text-sm text-muted-foreground">
                          {project.category}
                        </span>
                      </div>
                      <p className="mt-3 text-sm text-muted-foreground">{project.description}</p>
                      <div className="mt-4 flex flex-wrap gap-2 text-xs text-muted-foreground">
                        {project.technologies.map((technology) => (
                          <span key={technology} className="rounded-full bg-background/10 px-3 py-1 text-foreground">
                            {technology}
                          </span>
                        ))}
                      </div>
                    </article>
                  ))
                )}
              </div>
            </div>

            <div className="rounded-[2rem] border border-border/60 bg-card/95 p-8 shadow-xl">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="space-y-2">
                  <div className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.35em] text-muted-foreground dark:text-accent">
                    <Award className="h-4 w-4" />
                    Certifications
                  </div>
                  <p className="text-sm text-muted-foreground">Professional certificates and courses.</p>
                </div>
                <span className="rounded-full bg-background/10 px-4 py-2 text-sm text-muted-foreground">
                  {certifications.length} items
                </span>
              </div>
              <div className="mt-6 space-y-5">
                {certifications.length === 0 ? (
                  <div className="rounded-[1.75rem] bg-card/90 p-6 text-muted-foreground">
                    No certifications added yet.
                  </div>
                ) : (
                  certifications.map((cert) => {
                    return (
                      <article
                        key={cert.id}
                        className="space-y-4 rounded-[1.75rem] border border-border/60 bg-card/80 p-6"
                      >
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                          <div>
                            <h2 className="text-xl font-semibold text-foreground">{cert.title}</h2>
                            <p className="text-sm text-muted-foreground">
                              {cert.company} · {cert.location}
                            </p>
                          </div>
                          <span className="rounded-full bg-background/10 px-4 py-2 text-sm text-muted-foreground">
                            {cert.startDate} - {cert.endDate}
                          </span>
                        </div>
                      </article>
                    )
                  })
                )}
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
