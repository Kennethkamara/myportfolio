"use client";

import Link from "next/link";
import { usePortfolio } from "@/lib/portfolio-context";
import {
  Github,
  Linkedin,
  Instagram,
  Dribbble,
  Facebook,
  Twitter,
  Youtube,
  Globe,
  Settings,
} from "lucide-react";

// Auto-detect social icon based on URL
function getSocialIcon(url: string) {
  const lowerUrl = url.toLowerCase();
  
  if (lowerUrl.includes("github.com")) return Github;
  if (lowerUrl.includes("linkedin.com")) return Linkedin;
  if (lowerUrl.includes("instagram.com")) return Instagram;
  if (lowerUrl.includes("dribbble.com")) return Dribbble;
  if (lowerUrl.includes("facebook.com")) return Facebook;
  if (lowerUrl.includes("twitter.com") || lowerUrl.includes("x.com")) return Twitter;
  if (lowerUrl.includes("youtube.com")) return Youtube;
  
  return Globe; // Default icon for unknown platforms
}

// Auto-detect platform name from URL
function getPlatformName(url: string): string {
  const lowerUrl = url.toLowerCase();
  
  if (lowerUrl.includes("github.com")) return "GitHub";
  if (lowerUrl.includes("linkedin.com")) return "LinkedIn";
  if (lowerUrl.includes("instagram.com")) return "Instagram";
  if (lowerUrl.includes("dribbble.com")) return "Dribbble";
  if (lowerUrl.includes("facebook.com")) return "Facebook";
  if (lowerUrl.includes("twitter.com") || lowerUrl.includes("x.com")) return "Twitter";
  if (lowerUrl.includes("youtube.com")) return "YouTube";
  
  // Try to extract domain name as fallback
  try {
    const domain = new URL(url).hostname.replace("www.", "");
    return domain.split(".")[0].charAt(0).toUpperCase() + domain.split(".")[0].slice(1);
  } catch {
    return "Website";
  }
}

export function Footer() {
  const { data } = usePortfolio();
  const { personalInfo } = data;

  return (
    <footer className="border-t border-border py-6 md:py-8">
      <div className="container">
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
          <div className="flex flex-col items-center gap-2 sm:flex-row sm:items-center sm:gap-4">
            <p className="text-sm text-muted-foreground text-center sm:text-left">
              © {new Date().getFullYear()} {personalInfo.name}. All rights reserved.
            </p>
            <Link
              href="/admin"
              className="flex items-center gap-1.5 text-xs text-muted-foreground/60 hover:text-muted-foreground transition-colors"
            >
              <Settings className="h-3 w-3" />
              <span>Admin</span>
            </Link>
          </div>

          <div className="flex flex-wrap justify-center sm:justify-end gap-4">
            {personalInfo.socialLinks.map((link, index) => {
              const Icon = getSocialIcon(link.url);
              const platformName = link.platform || getPlatformName(link.url);
              
              return (
                <a
                  key={`${link.platform}-${index}`}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={platformName}
                  className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors min-h-[44px] px-1"
                >
                  <Icon className="h-4 w-4" />
                  <span className="hidden sm:inline">{platformName}</span>
                </a>
              );
            })}
          </div>
        </div>
      </div>
    </footer>
  );
}
