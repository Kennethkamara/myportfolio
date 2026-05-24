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
import { Plus, Trash2, Check } from "lucide-react";
import type { Experience } from "@/lib/types";

export function ExperienceEditor() {
  const { data, updateData } = usePortfolio();
  const [experiences, setExperiences] = useState<Experience[]>(
    data.experiences,
  );
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const { toast } = useToast();

  // Sync experiences with context data whenever it changes
  useEffect(() => {
    setExperiences(data.experiences);
  }, [data.experiences]);

  const handleAddExperience = () => {
    const newExperience: Experience = {
      id: Date.now().toString(),
      title: "",
      company: "",
      location: "",
      startDate: "",
      current: false,
      description: [],
      type: "work",
    };
    setExperiences([newExperience, ...experiences]);
  };

  const handleUpdateExperience = (
    id: string,
    field: keyof Experience,
    value: any,
  ) => {
    setExperiences(
      experiences.map((exp) =>
        exp.id === id ? { ...exp, [field]: value } : exp,
      ),
    );
  };

  const handleDeleteExperience = (id: string) => {
    setExperiences(experiences.filter((exp) => exp.id !== id));
  };

  const handleSave = async () => {
    setIsSaving(true);
    setSaveSuccess(false);

    // Simulate a brief save operation for visual feedback
    await new Promise((resolve) => setTimeout(resolve, 300));

    updateData({ experiences });

    // Show success state
    setSaveSuccess(true);
    toast({
      title: "✓ Changes saved successfully",
      description: "Your experience history has been updated.",
    });

    // Reset success state after 3 seconds
    setTimeout(() => setSaveSuccess(false), 3000);
    setIsSaving(false);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Experience & Education</CardTitle>
            <CardDescription>
              Manage your work experience and education history
            </CardDescription>
          </div>
          <Button onClick={handleAddExperience}>
            <Plus className="mr-2 h-4 w-4" /> Add Entry
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {experiences.map((exp) => (
          <div
            key={exp.id}
            className="p-6 border border-border rounded-lg space-y-4"
          >
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Title / Degree</Label>
                <Input
                  value={exp.title}
                  onChange={(e) =>
                    handleUpdateExperience(exp.id, "title", e.target.value)
                  }
                  placeholder="e.g., Senior Software Engineer"
                />
              </div>

              <div className="space-y-2">
                <Label>Type</Label>
                <Select
                  value={exp.type}
                  onValueChange={(value) =>
                    handleUpdateExperience(exp.id, "type", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="work">Work Experience</SelectItem>
                    <SelectItem value="education">Education</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Company / Institution</Label>
                <Input
                  value={exp.company}
                  onChange={(e) =>
                    handleUpdateExperience(exp.id, "company", e.target.value)
                  }
                  placeholder="e.g., Tech Company Inc."
                />
              </div>

              <div className="space-y-2">
                <Label>Location</Label>
                <Input
                  value={exp.location}
                  onChange={(e) =>
                    handleUpdateExperience(exp.id, "location", e.target.value)
                  }
                  placeholder="e.g., San Francisco, CA"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Start Date</Label>
                <Input
                  type="month"
                  value={exp.startDate}
                  onChange={(e) =>
                    handleUpdateExperience(exp.id, "startDate", e.target.value)
                  }
                />
              </div>

              <div className="space-y-2">
                <Label>End Date</Label>
                <Input
                  type="month"
                  value={exp.endDate || ""}
                  onChange={(e) =>
                    handleUpdateExperience(exp.id, "endDate", e.target.value)
                  }
                  disabled={exp.current}
                />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Checkbox
                id={`current-${exp.id}`}
                checked={exp.current}
                onCheckedChange={(checked) =>
                  handleUpdateExperience(exp.id, "current", checked)
                }
              />
              <Label htmlFor={`current-${exp.id}`} className="cursor-pointer">
                Currently working here
              </Label>
            </div>

            <div className="space-y-2">
              <Label>Description (one point per line)</Label>
              <Textarea
                value={exp.description.join("\n")}
                onChange={(e) =>
                  handleUpdateExperience(
                    exp.id,
                    "description",
                    e.target.value.split("\n").filter((line) => line.trim()),
                  )
                }
                rows={5}
                placeholder="• Led development of customer-facing applications&#10;• Mentored junior developers&#10;• Improved performance by 40%"
              />
            </div>

            <Button
              variant="destructive"
              size="sm"
              onClick={() => handleDeleteExperience(exp.id)}
            >
              <Trash2 className="mr-2 h-4 w-4" /> Delete Entry
            </Button>
          </div>
        ))}

        {experiences.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            No experience added yet. Click "Add Entry" to get started.
          </div>
        )}

        <Button
          onClick={handleSave}
          className="w-full"
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
