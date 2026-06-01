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
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Plus, Trash2, Check } from "lucide-react";
import type { Skill } from "@/lib/types";

export function SkillsEditor() {
  const { data, updateData } = usePortfolio();
  const [skills, setSkills] = useState<Skill[]>(data.skills);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const { toast } = useToast();

  // Sync skills with context data whenever it changes
  useEffect(() => {
    setSkills(data.skills);
  }, [data.skills]);

  const handleAddSkill = () => {
    const newSkill: Skill = {
      id: Date.now().toString(),
      name: "",
      category: "frontend",
    };
    setSkills([...skills, newSkill]);
  };

  const handleUpdateSkill = (
    id: string,
    field: keyof Skill,
    value: string,
  ) => {
    setSkills(
      skills.map((skill) =>
        skill.id === id ? { ...skill, [field]: value } : skill,
      ),
    );
  };

  const handleDeleteSkill = (id: string) => {
    setSkills(skills.filter((skill) => skill.id !== id));
  };

  const handleSave = async () => {
    setIsSaving(true);
    setSaveSuccess(false);

    // Simulate a brief save operation for visual feedback
    await new Promise((resolve) => setTimeout(resolve, 300));

    updateData({ skills });

    // Show success state
    setSaveSuccess(true);
    toast({
      title: "Changes saved successfully",
      description: "Your skills have been updated.",
    });

    // Reset success state after 3 seconds
    setTimeout(() => setSaveSuccess(false), 3000);
    setIsSaving(false);
  };

  // Group skills by category for better organization in the editor
  const categoryLabels: Record<string, string> = {
    frontend: "Frontend",
    backend: "Backend",
    database: "Database",
    design: "Design",
    tools: "Tools",
    other: "Other",
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Skills</CardTitle>
            <CardDescription>
              Manage your skills grouped by category
            </CardDescription>
          </div>
          <Button onClick={handleAddSkill}>
            <Plus className="mr-2 h-4 w-4" /> Add Skill
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {skills.map((skill) => (
          <div
            key={skill.id}
            className="flex gap-4 items-end p-4 border border-border rounded-lg"
          >
            <div className="flex-1 space-y-2">
              <Label>Skill Name</Label>
              <Input
                value={skill.name}
                onChange={(e) =>
                  handleUpdateSkill(skill.id, "name", e.target.value)
                }
                placeholder="e.g., React"
              />
            </div>

            <div className="w-40 space-y-2">
              <Label>Category</Label>
              <Select
                value={skill.category}
                onValueChange={(value) =>
                  handleUpdateSkill(skill.id, "category", value)
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(categoryLabels).map(([value, label]) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button
              variant="destructive"
              size="icon"
              onClick={() => handleDeleteSkill(skill.id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}

        {skills.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            No skills added yet. Click &quot;Add Skill&quot; to get started.
          </div>
        )}

        <Button
          onClick={handleSave}
          className="w-full"
          disabled={isSaving}
        >
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
  );
}
