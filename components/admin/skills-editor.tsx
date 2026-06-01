"use client"

import { useState, useEffect } from "react"
import { usePortfolio } from "@/lib/portfolio-context"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { useToast } from "@/hooks/use-toast"
import { Plus, Trash2, Check } from "lucide-react"
import type { Skill, SkillCategory } from "@/lib/types"

const colorOptions = [
  { value: "cyan", label: "Cyan" },
  { value: "green", label: "Green" },
  { value: "purple", label: "Purple" },
  { value: "pink", label: "Pink" },
  { value: "orange", label: "Orange" },
  { value: "teal", label: "Teal" },
]

const colorMap: Record<string, string> = {
  cyan: "bg-cyan-500",
  green: "bg-green-500",
  purple: "bg-purple-500",
  pink: "bg-pink-500",
  orange: "bg-orange-500",
  teal: "bg-teal-500",
}

export function SkillsEditor() {
  const { data, updateData } = usePortfolio()
  const [skills, setSkills] = useState<Skill[]>(data.skills)
  const [skillCategories, setSkillCategories] = useState<SkillCategory[]>(data.skillCategories)
  const [isSaving, setIsSaving] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)
  const { toast } = useToast()

  // Sync skills with context data whenever it changes
  useEffect(() => {
    setSkills(data.skills)
    setSkillCategories(data.skillCategories)
  }, [data.skills, data.skillCategories])

  const handleAddSkill = (categoryId: string) => {
    const newSkill: Skill = {
      id: Date.now().toString(),
      name: "",
      category: categoryId as Skill["category"],
    }
    setSkills([...skills, newSkill])
  }

  const handleUpdateSkill = (id: string, field: keyof Skill, value: string) => {
    setSkills(
      skills.map((skill) =>
        skill.id === id ? { ...skill, [field]: value } : skill
      )
    )
  }

  const handleDeleteSkill = (id: string) => {
    setSkills(skills.filter((skill) => skill.id !== id))
  }

  const handleUpdateCategory = (
    id: string,
    field: keyof SkillCategory,
    value: string
  ) => {
    setSkillCategories(
      skillCategories.map((cat) =>
        cat.id === id ? { ...cat, [field]: value } : cat
      )
    )
  }

  const handleSave = async () => {
    setIsSaving(true)
    setSaveSuccess(false)

    // Simulate a brief save operation for visual feedback
    await new Promise((resolve) => setTimeout(resolve, 300))

    updateData({ skills, skillCategories })

    // Show success state
    setSaveSuccess(true)
    toast({
      title: "Changes saved successfully",
      description: "Your skills have been updated.",
    })

    // Reset success state after 3 seconds
    setTimeout(() => setSaveSuccess(false), 3000)
    setIsSaving(false)
  }

  // Group skills by category
  const getSkillsByCategory = (categoryId: string) =>
    skills.filter((skill) => skill.category === categoryId)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Skills &amp; Expertise</CardTitle>
        <CardDescription>
          Manage your skills grouped by category. Edit category titles, descriptions, and colors.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Accordion type="multiple" defaultValue={skillCategories.map((c) => c.id)}>
          {skillCategories.map((category) => (
            <AccordionItem key={category.id} value={category.id}>
              <AccordionTrigger className="hover:no-underline">
                <div className="flex items-center gap-3">
                  <span
                    className={`w-3 h-3 rounded-full ${colorMap[category.color] || "bg-foreground"}`}
                  />
                  <span className="font-medium">{category.title}</span>
                  <span className="text-muted-foreground text-sm">
                    ({getSkillsByCategory(category.id).length} skills)
                  </span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pt-4 space-y-4">
                {/* Category Settings */}
                <div className="grid gap-4 p-4 border border-border rounded-lg bg-muted/30">
                  <h4 className="font-medium text-sm text-muted-foreground">Category Settings</h4>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label>Title</Label>
                      <Input
                        value={category.title}
                        onChange={(e) =>
                          handleUpdateCategory(category.id, "title", e.target.value)
                        }
                        placeholder="Category title"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Color</Label>
                      <Select
                        value={category.color}
                        onValueChange={(value) =>
                          handleUpdateCategory(category.id, "color", value)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {colorOptions.map((color) => (
                            <SelectItem key={color.value} value={color.value}>
                              <div className="flex items-center gap-2">
                                <span
                                  className={`w-3 h-3 rounded-full ${colorMap[color.value]}`}
                                />
                                {color.label}
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Description</Label>
                    <Textarea
                      value={category.description}
                      onChange={(e) =>
                        handleUpdateCategory(category.id, "description", e.target.value)
                      }
                      placeholder="Brief description of this category"
                      rows={2}
                    />
                  </div>
                </div>

                {/* Skills List */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium text-sm text-muted-foreground">Skills</h4>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleAddSkill(category.id)}
                    >
                      <Plus className="mr-1 h-3 w-3" /> Add Skill
                    </Button>
                  </div>
                  
                  {getSkillsByCategory(category.id).length === 0 ? (
                    <p className="text-sm text-muted-foreground py-4 text-center">
                      No skills in this category. Click &quot;Add Skill&quot; to add one.
                    </p>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {getSkillsByCategory(category.id).map((skill) => (
                        <div
                          key={skill.id}
                          className="flex items-center gap-1 pl-3 pr-1 py-1 bg-muted border border-border rounded-md group"
                        >
                          <Input
                            value={skill.name}
                            onChange={(e) =>
                              handleUpdateSkill(skill.id, "name", e.target.value)
                            }
                            placeholder="Skill name"
                            className="h-7 w-28 border-0 bg-transparent p-0 focus-visible:ring-0 text-sm"
                          />
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 opacity-50 hover:opacity-100 hover:bg-destructive hover:text-destructive-foreground"
                            onClick={() => handleDeleteSkill(skill.id)}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        <Button onClick={handleSave} className="w-full" disabled={isSaving}>
          {isSaving ? (
            <>
              <span className="animate-spin mr-2">&#x27F3;</span>
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
  )
}
