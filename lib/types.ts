export interface Project {
  id: string
  title: string
  description: string
  image: string
  technologies: string[]
  liveUrl?: string
  githubUrl?: string
  category: "web" | "design" | "animation" | "other"
  featured: boolean
  createdAt: string
}

export interface Skill {
  id: string
  name: string
  category: "frontend" | "backend" | "design" | "tools" | "other"
  level: number // 1-100
  icon?: string
}

export interface Experience {
  id: string
  title: string
  company: string
  location: string
  startDate: string
  endDate?: string
  current: boolean
  description: string[]
  type: "work" | "education" | "certification"
}

export interface SocialLink {
  platform: string
  url: string
  icon: string
}

export interface PersonalInfo {
  name: string
  title: string
  bio: string
  email: string
  phone?: string
  location: string
  avatar: string
  cvUrl?: string
  socialLinks: SocialLink[]
}

export interface PortfolioData {
  personalInfo: PersonalInfo
  skills: Skill[]
  projects: Project[]
  experiences: Experience[]
}
