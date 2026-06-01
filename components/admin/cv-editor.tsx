"use client";

import { useState } from "react";
import { usePortfolio } from "@/lib/portfolio-context";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Save, Upload, FileText, User, Briefcase, GraduationCap, Award } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function CVEditor() {
  const { data, updateData } = usePortfolio();
  const { toast } = useToast();
  const [personalInfo, setPersonalInfo] = useState(data.personalInfo);
  const [isSaving, setIsSaving] = useState(false);

  // Filter experiences by type
  const workExperience = data.experiences.filter((e) => e.type === "work");
  const education = data.experiences.filter((e) => e.type === "education");
  const certifications = data.experiences.filter((e) => e.type === "certification");

  const handleSave = () => {
    setIsSaving(true);
    updateData({ personalInfo });
    setTimeout(() => {
      setIsSaving(false);
      toast({
        title: "CV Updated",
        description: "Your CV information has been saved successfully.",
      });
    }, 500);
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
            Configure what appears on your CV page. Work experience, education, and certifications
            are managed in the Experience tab.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="overview">CV Overview</TabsTrigger>
              <TabsTrigger value="pdf">PDF Settings</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6 pt-4">
              {/* Summary Stats */}
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

              {/* Quick Info */}
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

            <TabsContent value="pdf" className="space-y-6 pt-4">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="cvUrl">CV PDF URL</Label>
                  <Input
                    id="cvUrl"
                    value={personalInfo.cvUrl || ""}
                    onChange={(e) =>
                      setPersonalInfo({ ...personalInfo, cvUrl: e.target.value })
                    }
                    placeholder="https://example.com/your-cv.pdf"
                  />
                  <p className="text-xs text-muted-foreground">
                    Link to a downloadable PDF version of your CV. This will show a download button on the CV page.
                  </p>
                </div>

                <div className="rounded-lg border border-dashed p-6 text-center">
                  <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground mb-2">
                    Upload your CV PDF to a file hosting service and paste the URL above
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Recommended: Google Drive, Dropbox, or your own hosting
                  </p>
                </div>
              </div>

              <div className="flex justify-end">
                <Button onClick={handleSave} disabled={isSaving}>
                  <Save className="mr-2 h-4 w-4" />
                  {isSaving ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
