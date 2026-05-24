"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight, Download, Github, Linkedin, Instagram, Dribbble, Facebook } from "lucide-react";
import { usePortfolio } from "@/lib/portfolio-context";
import Image from "next/image";

const socialIcons = {
  github: Github,
  linkedin: Linkedin,
  instagram: Instagram,
  dribbble: Dribbble,
  facebook: Facebook,
};

export function HeroSection() {
  const { data } = usePortfolio();
  const { personalInfo } = data;

  return (
    <section className="min-h-screen flex items-center justify-center pt-16">
      <div className="container">
        {/*
          Grid layout:
          - Mobile (< 768px):   Single column, image on top, text below
          - Tablet (768-1023px): Single column, but larger image
          - Desktop (≥ 1024px):  Two columns side-by-side
        */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 lg:gap-16 items-center py-8 md:py-12 lg:py-0">

          {/* TEXT CONTENT — on mobile appears after image */}
          <div className="space-y-5 md:space-y-6 order-2 lg:order-1">
            <div className="space-y-2 md:space-y-3">
              <h1 className="font-bold tracking-tight">
                Hi, I&apos;m{" "}
                <span className="text-primary">{personalInfo.name.split(" ")[0]}</span>
              </h1>
              <p className="text-muted-foreground font-medium leading-snug">
                {personalInfo.title}
              </p>
            </div>

            <p className="text-muted-foreground leading-relaxed max-w-lg">
              {personalInfo.bio}
            </p>

            {/* CTA Buttons — stacked on mobile, inline on sm+ */}
            <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Button
                size="lg"
                className="w-full sm:w-auto min-h-[48px] text-base"
                asChild
              >
                <a href="#contact" className="inline-flex items-center justify-center gap-2">
                  Get In Touch <ArrowRight className="h-4 w-4" />
                </a>
              </Button>

              {personalInfo.cvUrl && (
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full sm:w-auto min-h-[48px] text-base"
                  asChild
                >
                  <a href="/cv" className="inline-flex items-center justify-center gap-2">
                    <Download className="h-4 w-4" /> View CV
                  </a>
                </Button>
              )}
            </div>

            {/* Social Links */}
            <div className="flex flex-wrap gap-4 pt-2">
              {personalInfo.socialLinks.map((link) => {
                const Icon = socialIcons[link.icon as keyof typeof socialIcons];
                return (
                  <a
                    key={link.platform}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={link.platform}
                    className="text-muted-foreground hover:text-foreground transition-colors p-1 min-h-[44px] min-w-[44px] flex items-center justify-center"
                  >
                    {Icon && <Icon className="h-5 w-5 md:h-6 md:w-6" />}
                  </a>
                );
              })}
            </div>
          </div>

          {/* PROFILE IMAGE — on mobile appears first (order-1) */}
          <div className="order-1 lg:order-2 flex justify-center lg:justify-end">
            <div
              className="relative"
              style={{
                /*
                  Fluid image container:
                  Mobile:  220px
                  Tablet:  280px
                  Desktop: 360px
                  Uses clamp so it scales smoothly
                */
                width: "clamp(200px, 55vw, 360px)",
                aspectRatio: "1 / 1",
              }}
            >
              {/* Glow effect — contained within parent */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 blur-3xl" />
              {/* Image circle */}
              <div className="relative w-full h-full rounded-full overflow-hidden border-4 border-border shadow-xl">
                <Image
                  src={personalInfo.avatar || "/placeholder.svg"}
                  alt={personalInfo.name}
                  fill
                  className="object-cover object-[center_35%]"
                  priority
                  sizes="(max-width: 768px) 55vw, (max-width: 1024px) 280px, 360px"
                />
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
