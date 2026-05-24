"use client";

import { usePortfolio } from "@/lib/portfolio-context";
import { Github, Linkedin, Instagram, Dribbble, Facebook } from "lucide-react";

const socialIcons = {
  github: Github,
  linkedin: Linkedin,
  instagram: Instagram,
  dribbble: Dribbble,
  facebook: Facebook,
};

export function Footer() {
  const { data } = usePortfolio();
  const { personalInfo } = data;

  return (
    <footer className="border-t border-border py-6 md:py-8">
      <div className="container">
        {/*
          Footer layout:
          - Mobile:  Centered, stacked (copyright above, social links below)
          - Tablet+: Side-by-side (copyright left, social links right)
        */}
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
          <p className="text-sm text-muted-foreground text-center sm:text-left">
            © {new Date().getFullYear()} {personalInfo.name}. All rights reserved.
          </p>

          <div className="flex flex-wrap justify-center sm:justify-end gap-4">
            {personalInfo.socialLinks.map((link) => {
              const Icon = socialIcons[link.icon as keyof typeof socialIcons];
              return (
                <a
                  key={link.platform}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={link.platform}
                  className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors min-h-[44px] px-1"
                >
                  {Icon && <Icon className="h-4 w-4" />}
                  <span className="hidden sm:inline">{link.platform}</span>
                </a>
              );
            })}
          </div>
        </div>
      </div>
    </footer>
  );
}
