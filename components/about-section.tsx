"use client"

import { usePortfolio } from "@/lib/portfolio-context"
import { Card, CardContent } from "@/components/ui/card"
import { Mail, MapPin, Phone } from "lucide-react"

export function AboutSection() {
  const { data } = usePortfolio()
  const { personalInfo } = data

  return (
    <section id="about" className="section-padding">
      <div className="container">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-bold mb-8 md:mb-10 text-center">About Me</h2>

          <Card>
            <CardContent className="p-5 sm:p-6 md:p-8 space-y-6">
              <p className="text-muted-foreground leading-relaxed">
                {personalInfo.bio}
              </p>

              {/*
                Contact info grid:
                - Mobile: 1 column (stacked)
                - Tablet: 2 columns
                - Desktop: 3 columns
              */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 pt-2">

                {/* Email */}
                <div className="flex items-start gap-3">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <Mail className="h-5 w-5 text-primary" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs text-muted-foreground mb-0.5 uppercase tracking-wide">Email</p>
                    <p className="font-medium text-sm break-all leading-tight">
                      {personalInfo.email}
                    </p>
                  </div>
                </div>

                {/* Phone */}
                {personalInfo.phone && (
                  <div className="flex items-start gap-3">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <Phone className="h-5 w-5 text-primary" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs text-muted-foreground mb-0.5 uppercase tracking-wide">Phone</p>
                      <p className="font-medium text-sm break-all leading-tight">
                        {personalInfo.phone}
                      </p>
                    </div>
                  </div>
                )}

                {/* Location */}
                <div className="flex items-start gap-3">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <MapPin className="h-5 w-5 text-primary" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs text-muted-foreground mb-0.5 uppercase tracking-wide">Location</p>
                    <p className="font-medium text-sm leading-tight">
                      {personalInfo.location}
                    </p>
                  </div>
                </div>

              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
