"use client";

import { useRef, useState } from "react";
import { usePortfolio } from "@/lib/portfolio-context";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import {
  Upload,
  FileText,
  User,
  Briefcase,
  GraduationCap,
  Award,
  Loader2,
  CheckCircle2,
  Trash2,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CVQRCode } from "@/components/admin/cv-qr-code";

export function CVEditor() {
  const { data, updateData } = usePortfolio();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);

  const { personalInfo } = data;

  // Filter experiences by type
  const workExperience = data.experiences.filter((e) => e.type === "work");
  const education = data.experiences.filter((e) => e.type === "education");
  const certifications = data.experiences.filter((e) => e.type === "certification");

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/upload-cv", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Upload failed");
      }

      updateData({
        personalInfo: {
          ...personalInfo,
          cvUrl: result.url,
          cvFileName: result.name,
        },
      });

      toast({
        title: "CV Uploaded",
        description: `${result.name} is now available for download on your CV page.`,
      });
    } catch (error) {
      toast({
        title: "Upload Failed",
        description: error instanceof Error ? error.message : "Something went wrong.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleRemove = () => {
    updateData({
      personalInfo: { ...personalInfo, cvUrl: undefined, cvFileName: undefined },
    });
    toast({
      title: "CV Removed",
      description: "The downloadable CV file has been removed.",
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            CV Page Settings
          </CardTitle>
          <CardDescription>
            Upload your CV file, generate a shareable QR code, and review what appears on your CV page.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="upload" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="upload">CV File</TabsTrigger>
              <TabsTrigger value="qr">QR Code</TabsTrigger>
              <TabsTrigger value="overview">Overview</TabsTrigger>
            </TabsList>

            {/* CV FILE UPLOAD */}
            <TabsContent value="upload" className="space-y-6 pt-4">
              <div className="space-y-2">
                <Label>CV File (PDF or DOC/DOCX)</Label>
                <p className="text-xs text-muted-foreground">
                  Upload your CV. Once uploaded, a &quot;Download PDF&quot; button appears on your CV page.
                </p>
              </div>

              {personalInfo.cvUrl ? (
                <div className="flex flex-col gap-4 rounded-lg border p-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-3">
                    <div className="rounded-full bg-green-500/10 p-2">
                      <CheckCircle2 className="h-5 w-5 text-green-500" />
                    </div>
                    <div>
                      <p className="font-medium">{personalInfo.cvFileName || "CV file"}</p>
                      <a
                        href={personalInfo.cvUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs text-muted-foreground underline hover:text-foreground"
                      >
                        View current file
                      </a>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={isUploading}
                    >
                      {isUploading ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        <Upload className="mr-2 h-4 w-4" />
                      )}
                      Replace
                    </Button>
                    <Button variant="ghost" size="sm" onClick={handleRemove} disabled={isUploading}>
                      <Trash2 className="mr-2 h-4 w-4" />
                      Remove
                    </Button>
                  </div>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploading}
                  className="flex w-full flex-col items-center gap-2 rounded-lg border border-dashed p-8 text-center transition hover:border-foreground/40 hover:bg-muted/30 disabled:opacity-60"
                >
                  {isUploading ? (
                    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                  ) : (
                    <Upload className="h-8 w-8 text-muted-foreground" />
                  )}
                  <p className="text-sm font-medium">
                    {isUploading ? "Uploading..." : "Click to upload your CV"}
                  </p>
                  <p className="text-xs text-muted-foreground">PDF, DOC, or DOCX up to 10MB</p>
                </button>
              )}

              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                className="hidden"
                onChange={handleFileChange}
              />
            </TabsContent>

            {/* QR CODE */}
            <TabsContent value="qr" className="pt-4">
              <CVQRCode targetPath="/cv" />
            </TabsContent>

            {/* OVERVIEW */}
            <TabsContent value="overview" className="space-y-6 pt-4">
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-3">
                      <div className="rounded-full bg-blue-500/10 p-2">
                        <Briefcase className="h-4 w-4 text-blue-500" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold">{workExperience.length}</p>
                        <p className="text-xs text-muted-foreground">Work Experience</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-3">
                      <div className="rounded-full bg-green-500/10 p-2">
                        <GraduationCap className="h-4 w-4 text-green-500" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold">{education.length}</p>
                        <p className="text-xs text-muted-foreground">Education</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-3">
                      <div className="rounded-full bg-purple-500/10 p-2">
                        <Award className="h-4 w-4 text-purple-500" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold">{certifications.length}</p>
                        <p className="text-xs text-muted-foreground">Certifications</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-3">
                      <div className="rounded-full bg-orange-500/10 p-2">
                        <User className="h-4 w-4 text-orange-500" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold">{data.skills.length}</p>
                        <p className="text-xs text-muted-foreground">Skills</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="rounded-lg border p-4 bg-muted/30">
                <h3 className="font-medium mb-2">CV Page Content Sources</h3>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• <strong>Personal Info</strong> - Edit in the Personal Info tab</li>
                  <li>• <strong>Work Experience</strong> - Edit in the Experience tab</li>
                  <li>• <strong>Education</strong> - Edit in the Experience tab</li>
                  <li>• <strong>Certifications</strong> - Edit in the Experience tab</li>
                  <li>• <strong>Skills</strong> - Edit in the Skills tab</li>
                  <li>• <strong>Projects</strong> - Edit in the Projects tab (shows top 3)</li>
                </ul>
              </div>

              <div className="flex justify-end">
                <Button asChild>
                  <a href="/cv" target="_blank" rel="noreferrer">
                    View CV Page
                  </a>
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
