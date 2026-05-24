"use client";

import { useState, useEffect } from "react";
import { usePortfolio } from "@/lib/portfolio-context";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { Plus, Trash2, ExternalLink, Check } from "lucide-react";
import { FileUpload } from "@/components/admin/file-upload";
import type { Project } from "@/lib/types";

export function ProjectsEditor() {
  const { data, updateData } = usePortfolio();
  const [projects, setProjects] = useState<Project[]>(data.projects);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const { toast } = useToast();

  // Sync projects with context data whenever it changes
  useEffect(() => {
    setProjects(data.projects);
  }, [data.projects]);

  const handleAddProject = () => {
    const newProject: Project = {
      id: Date.now().toString(),
      title: "",
      description: "",
      image: "",
      technologies: [],
      category: "web",
      featured: false,
      createdAt: new Date().toISOString().split("T")[0],
    };
    setProjects([newProject, ...projects]);
    setEditingId(newProject.id);
  };

  const handleUpdateProject = (
    id: string,
    field: keyof Project,
    value: any,
  ) => {
    console.log("[v0] Updating project:", id, field, value?.substring?.(0, 50));
    setProjects(
      projects.map((project) =>
        project.id === id ? { ...project, [field]: value } : project,
      ),
    );
  };

  const handleDeleteProject = (id: string) => {
    setProjects(projects.filter((project) => project.id !== id));
    toast({
      title: "Project deleted",
      description: "The project has been removed.",
    });
  };

  const handleSave = async () => {
    const invalidProjects = projects.filter((p) => !p.title || !p.description);
    if (invalidProjects.length > 0) {
      toast({
        title: "Validation error",
        description: "Please fill in title and description for all projects.",
        variant: "destructive",
      });
      return;
    }

    setIsSaving(true);
    setSaveSuccess(false);

    // Simulate a brief save operation for visual feedback
    await new Promise((resolve) => setTimeout(resolve, 300));

    console.log("[v0] Saving projects:", projects.length);
    updateData({ projects });

    // Show success state
    setSaveSuccess(true);
    toast({
      title: "✓ Changes saved successfully",
      description: "Your projects have been updated.",
    });

    // Reset success state after 3 seconds
    setTimeout(() => setSaveSuccess(false), 3000);
    setIsSaving(false);
    setEditingId(null);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Projects</CardTitle>
            <CardDescription>
              Manage your portfolio projects and upload images
            </CardDescription>
          </div>
          <Button onClick={handleAddProject}>
            <Plus className="mr-2 h-4 w-4" /> Add Project
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {projects.map((project) => (
          <div
            key={project.id}
            className="p-6 border border-border rounded-lg space-y-4 bg-card"
          >
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor={`title-${project.id}`}>Project Title *</Label>
                <Input
                  id={`title-${project.id}`}
                  value={project.title}
                  onChange={(e) =>
                    handleUpdateProject(project.id, "title", e.target.value)
                  }
                  placeholder="Enter project name"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor={`category-${project.id}`}>Category</Label>
                <Select
                  value={project.category}
                  onValueChange={(value) =>
                    handleUpdateProject(project.id, "category", value)
                  }
                >
                  <SelectTrigger id={`category-${project.id}`}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="web">Web Development</SelectItem>
                    <SelectItem value="design">Graphic Design</SelectItem>
                    <SelectItem value="animation">Animation</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor={`description-${project.id}`}>Description *</Label>
              <Textarea
                id={`description-${project.id}`}
                value={project.description}
                onChange={(e) =>
                  handleUpdateProject(project.id, "description", e.target.value)
                }
                rows={3}
                placeholder="Describe your project..."
              />
            </div>

            <div className="space-y-2">
              <Label>Project Image *</Label>
              <FileUpload
                accept="image/*"
                maxSize={5}
                currentFile={project.image}
                onUpload={(url, fileName) => {
                  console.log("[v0] Project image uploaded:", fileName);
                  handleUpdateProject(project.id, "image", url);
                }}
                label="Upload project screenshot or mockup"
              />
              {project.image && (
                <div className="mt-3 p-3 bg-muted rounded-lg">
                  <p className="text-xs font-medium text-muted-foreground mb-2">
                    Preview:
                  </p>
                  <img
                    src={project.image || "/placeholder.svg"}
                    alt={project.title || "Project preview"}
                    className="w-full max-w-md rounded border border-border shadow-sm"
                  />
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor={`technologies-${project.id}`}>Technologies</Label>
              <Input
                id={`technologies-${project.id}`}
                value={project.technologies.join(", ")}
                onChange={(e) =>
                  handleUpdateProject(
                    project.id,
                    "technologies",
                    e.target.value
                      .split(",")
                      .map((t) => t.trim())
                      .filter(Boolean),
                  )
                }
                placeholder="React, Next.js, TypeScript, Tailwind CSS"
              />
              <p className="text-xs text-muted-foreground">
                Separate technologies with commas
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor={`live-${project.id}`}>Live URL</Label>
                <div className="flex gap-2">
                  <Input
                    id={`live-${project.id}`}
                    value={project.liveUrl || ""}
                    onChange={(e) =>
                      handleUpdateProject(project.id, "liveUrl", e.target.value)
                    }
                    placeholder="https://example.com"
                  />
                  {project.liveUrl && (
                    <Button variant="outline" size="icon" asChild>
                      <a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    </Button>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor={`github-${project.id}`}>GitHub URL</Label>
                <div className="flex gap-2">
                  <Input
                    id={`github-${project.id}`}
                    value={project.githubUrl || ""}
                    onChange={(e) =>
                      handleUpdateProject(
                        project.id,
                        "githubUrl",
                        e.target.value,
                      )
                    }
                    placeholder="https://github.com/username/repo"
                  />
                  {project.githubUrl && (
                    <Button variant="outline" size="icon" asChild>
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    </Button>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-border">
              <div className="flex items-center gap-2">
                <Checkbox
                  id={`featured-${project.id}`}
                  checked={project.featured}
                  onCheckedChange={(checked) =>
                    handleUpdateProject(project.id, "featured", checked)
                  }
                />
                <Label
                  htmlFor={`featured-${project.id}`}
                  className="cursor-pointer"
                >
                  Featured Project
                </Label>
              </div>

              <Button
                variant="destructive"
                size="sm"
                onClick={() => handleDeleteProject(project.id)}
              >
                <Trash2 className="mr-2 h-4 w-4" /> Delete
              </Button>
            </div>
          </div>
        ))}

        {projects.length === 0 && (
          <div className="text-center py-12 text-muted-foreground border border-dashed border-border rounded-lg">
            <p className="text-lg font-medium mb-2">No projects yet</p>
            <p className="text-sm">Click "Add Project" to showcase your work</p>
          </div>
        )}

        <Button
          onClick={handleSave}
          className="w-full"
          size="lg"
          disabled={isSaving}
          variant={saveSuccess ? "default" : "default"}
        >
          {isSaving ? (
            <>
              <span className="animate-spin mr-2">⟳</span>
              Saving...
            </>
          ) : saveSuccess ? (
            <>
              <Check className="mr-2 h-4 w-4" />
              Saved!
            </>
          ) : (
            "Save All Changes"
          )}
        </Button>
      </CardContent>
    </Card>
  );
}
