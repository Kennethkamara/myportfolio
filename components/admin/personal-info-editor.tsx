"use client";

import type React from "react";

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
import { useToast } from "@/hooks/use-toast";
import { FileUpload } from "@/components/admin/file-upload";
import type { PersonalInfo, SocialLink } from "@/lib/types";
import { Plus, Trash2, Check } from "lucide-react";

export function PersonalInfoEditor() {
  const { data, updateData } = usePortfolio();
  const [formData, setFormData] = useState<PersonalInfo>(data.personalInfo);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const { toast } = useToast();

  // Sync formData with context data whenever it changes
  useEffect(() => {
    setFormData(data.personalInfo);
  }, [data.personalInfo]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveSuccess(false);

    // Simulate a brief save operation for visual feedback
    await new Promise((resolve) => setTimeout(resolve, 300));

    updateData({ personalInfo: formData });

    // Show success state
    setSaveSuccess(true);
    toast({
      title: "✓ Changes saved successfully",
      description: "Your personal information has been updated.",
    });

    // Reset success state after 3 seconds
    setTimeout(() => setSaveSuccess(false), 3000);
    setIsSaving(false);
  };

  const handleChange = (field: keyof PersonalInfo, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSocialLinkChange = (
    index: number,
    field: keyof SocialLink,
    value: string,
  ) => {
    const updatedLinks = [...formData.socialLinks];
    updatedLinks[index] = { ...updatedLinks[index], [field]: value };
    setFormData((prev) => ({ ...prev, socialLinks: updatedLinks }));
  };

  const addSocialLink = () => {
    setFormData((prev) => ({
      ...prev,
      socialLinks: [...prev.socialLinks, { platform: "", url: "", icon: "" }],
    }));
  };

  const removeSocialLink = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      socialLinks: prev.socialLinks.filter((_, i) => i !== index),
    }));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Personal Information</CardTitle>
        <CardDescription>
          Update your personal details and contact information
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label>Profile Picture</Label>
            <FileUpload
              accept="image/*"
              maxSize={5}
              currentFile={formData.avatar}
              onUpload={(url) => handleChange("avatar", url)}
              label="Upload profile picture"
            />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleChange("name", e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="title">Professional Title</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => handleChange("title", e.target.value)}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="bio">Bio</Label>
            <Textarea
              id="bio"
              value={formData.bio}
              onChange={(e) => handleChange("bio", e.target.value)}
              rows={4}
              required
            />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleChange("email", e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                value={formData.phone || ""}
                onChange={(e) => handleChange("phone", e.target.value)}
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => handleChange("location", e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="avatar">Avatar URL (or upload above)</Label>
              <Input
                id="avatar"
                value={formData.avatar}
                onChange={(e) => handleChange("avatar", e.target.value)}
                placeholder="/path/to/avatar.jpg"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>CV / Resume (PDF recommended)</Label>
            <FileUpload
              accept=".pdf,.doc,.docx"
              maxSize={10}
              currentFile={formData.cvUrl}
              onUpload={(url, fileName) => {
                console.log("[v0] CV uploaded:", fileName);
                handleChange("cvUrl", url);
              }}
              label="Upload CV/Resume - PDF, DOC, or DOCX (max 10MB)"
            />
            {formData.cvUrl && (
              <p className="text-xs text-muted-foreground mt-1">
                ✓ CV uploaded and ready to download
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="cvUrl">
              CV/Resume URL (optional - or upload above)
            </Label>
            <Input
              id="cvUrl"
              value={formData.cvUrl || ""}
              onChange={(e) => handleChange("cvUrl", e.target.value)}
              placeholder="https://example.com/cv.pdf"
            />
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Social Media Links</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addSocialLink}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Link
              </Button>
            </div>

            <div className="space-y-4">
              {formData.socialLinks.map((link, index) => (
                <div
                  key={index}
                  className="grid grid-cols-1 md:grid-cols-3 gap-3 p-4 border rounded-lg"
                >
                  <div className="space-y-2">
                    <Label htmlFor={`platform-${index}`}>Platform</Label>
                    <Input
                      id={`platform-${index}`}
                      value={link.platform}
                      onChange={(e) =>
                        handleSocialLinkChange(
                          index,
                          "platform",
                          e.target.value,
                        )
                      }
                      placeholder="e.g., GitHub"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor={`url-${index}`}>URL</Label>
                    <Input
                      id={`url-${index}`}
                      value={link.url}
                      onChange={(e) =>
                        handleSocialLinkChange(index, "url", e.target.value)
                      }
                      placeholder="https://github.com/username"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor={`icon-${index}`}>Icon</Label>
                    <div className="flex gap-2">
                      <Input
                        id={`icon-${index}`}
                        value={link.icon}
                        onChange={(e) =>
                          handleSocialLinkChange(index, "icon", e.target.value)
                        }
                        placeholder="github, linkedin, instagram, facebook"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        onClick={() => removeSocialLink(index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Available: github, linkedin, instagram, dribbble, facebook
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <Button
            type="submit"
            size="lg"
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
              "Save Changes"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
