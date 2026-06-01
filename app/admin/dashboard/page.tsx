"use client"

import { Button } from "@/components/ui/button"
import { LogOut } from "lucide-react"
import { PersonalInfoEditor } from "@/components/admin/personal-info-editor"
import { SkillsEditor } from "@/components/admin/skills-editor"
import { ProjectsEditor } from "@/components/admin/projects-editor"
import { ExperienceEditor } from "@/components/admin/experience-editor"
import { CVEditor } from "@/components/admin/cv-editor"
import { PasswordEditor } from "@/components/admin/password-editor"
import { ProtectedRoute } from "@/components/admin/protected-route"
import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function AdminDashboardPage() {
  const { logout } = useAuth()
  const router = useRouter()

  const handleLogout = () => {
    logout()
    router.push("/admin")
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-muted/30">
        <header className="border-b border-border bg-background">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Admin Dashboard</h1>
              <p className="text-sm text-muted-foreground">Manage your portfolio content</p>
            </div>
            <div className="flex items-center gap-4">
              <Button variant="outline" asChild>
                <a href="/" target="_blank" rel="noreferrer">
                  View Portfolio
                </a>
              </Button>
              <Button variant="outline" onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" /> Logout
              </Button>
            </div>
          </div>
        </header>

        <main className="container mx-auto px-4 py-8">
          <Tabs defaultValue="personal" className="w-full">
            <TabsList className="grid w-full grid-cols-6 mb-8">
              <TabsTrigger value="personal">Personal Info</TabsTrigger>
              <TabsTrigger value="skills">Skills</TabsTrigger>
              <TabsTrigger value="projects">Projects</TabsTrigger>
              <TabsTrigger value="experience">Experience</TabsTrigger>
              <TabsTrigger value="cv">CV</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>

            <TabsContent value="personal">
              <PersonalInfoEditor />
            </TabsContent>

            <TabsContent value="skills">
              <SkillsEditor />
            </TabsContent>

            <TabsContent value="projects">
              <ProjectsEditor />
            </TabsContent>

            <TabsContent value="experience">
              <ExperienceEditor />
            </TabsContent>

            <TabsContent value="cv">
              <CVEditor />
            </TabsContent>

            <TabsContent value="settings">
              <PasswordEditor />
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </ProtectedRoute>
  )
}
