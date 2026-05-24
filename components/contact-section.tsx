"use client";

import type React from "react";
import { useState } from "react";
import { usePortfolio } from "@/lib/portfolio-context";
import {
  Card, CardContent, CardDescription, CardHeader, CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import {
  Mail, MapPin, Phone, MessageCircle,
  Github, Linkedin, Instagram, Dribbble, Facebook,
} from "lucide-react";

const socialIcons = {
  github: Github,
  linkedin: Linkedin,
  instagram: Instagram,
  dribbble: Dribbble,
  facebook: Facebook,
};

export function ContactSection() {
  const { data } = usePortfolio();
  const { personalInfo } = data;
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const formData = new FormData(e.currentTarget);
      const name = formData.get("name");
      const email = formData.get("email");
      const message = formData.get("message");
      const web3formsKey = process.env.NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY;

      const payload = web3formsKey
        ? { access_key: web3formsKey, name, email, message, subject: `New Contact from ${name}` }
        : { name, email, message };

      const response = await fetch(
        web3formsKey ? "https://api.web3forms.com/submit" : "/api/contact",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        },
      );

      const result = await response.json();

      if (response.ok) {
        toast({
          title: "Message sent!",
          description: result.message || "Thank you! I'll get back to you soon.",
        });
        (e.target as HTMLFormElement).reset();
      } else {
        throw new Error(result.error || "Failed to send");
      }
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "Failed to send. Please try email or WhatsApp directly.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const whatsappNumber = personalInfo.phone?.replace(/\D/g, "");
  const whatsappUrl = whatsappNumber ? `https://wa.me/${whatsappNumber}` : null;

  return (
    <section id="contact" className="section-padding">
      <div className="container">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-bold mb-3 text-center">Get In Touch</h2>
          <p className="text-muted-foreground text-center mb-8 md:mb-12 max-w-xl mx-auto text-sm sm:text-base">
            Have a project in mind or want to collaborate? Feel free to reach out!
          </p>

          {/*
            Contact layout:
            - Mobile:  Single column (info card on top, form below)
            - Tablet:  Single column
            - Desktop: Two columns side-by-side
          */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">

            {/* LEFT — Contact info */}
            <div className="space-y-4 md:space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base md:text-lg">Contact Information</CardTitle>
                  <CardDescription className="text-sm">
                    Reach me through any of these channels
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Email */}
                  <div className="flex items-start gap-3">
                    <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <Mail className="h-4 w-4 text-primary" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs text-muted-foreground mb-0.5">Email</p>
                      <a
                        href={`mailto:${personalInfo.email}`}
                        className="font-medium text-sm hover:text-primary break-all leading-tight"
                      >
                        {personalInfo.email}
                      </a>
                    </div>
                  </div>

                  {/* Phone */}
                  {personalInfo.phone && (
                    <div className="flex items-start gap-3">
                      <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                        <Phone className="h-4 w-4 text-primary" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs text-muted-foreground mb-0.5">Phone</p>
                        <a
                          href={`tel:${personalInfo.phone}`}
                          className="font-medium text-sm hover:text-primary"
                        >
                          {personalInfo.phone}
                        </a>
                      </div>
                    </div>
                  )}

                  {/* Location */}
                  <div className="flex items-start gap-3">
                    <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <MapPin className="h-4 w-4 text-primary" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs text-muted-foreground mb-0.5">Location</p>
                      <p className="font-medium text-sm">{personalInfo.location}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* WhatsApp CTA */}
              {whatsappUrl && (
                <Button
                  asChild
                  className="w-full min-h-[48px] text-base"
                  size="lg"
                  variant="outline"
                >
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2"
                  >
                    <MessageCircle className="h-5 w-5" />
                    Chat on WhatsApp
                  </a>
                </Button>
              )}

              {/* Social Links */}
              <div className="flex flex-wrap gap-3">
                {personalInfo.socialLinks.map((link) => {
                  const Icon = socialIcons[link.icon as keyof typeof socialIcons];
                  return (
                    <a
                      key={link.platform}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={link.platform}
                      className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center hover:bg-primary/20 transition-colors"
                    >
                      {Icon && <Icon className="h-4 w-4" />}
                    </a>
                  );
                })}
              </div>
            </div>

            {/* RIGHT — Contact form */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base md:text-lg">Send a Message</CardTitle>
                <CardDescription className="text-sm">
                  Fill out the form and I&apos;ll respond promptly
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="contact-name" className="text-sm">Name</Label>
                    <Input
                      id="contact-name"
                      name="name"
                      placeholder="Your full name"
                      required
                      className="h-11"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="contact-email" className="text-sm">Email</Label>
                    <Input
                      id="contact-email"
                      name="email"
                      type="email"
                      placeholder="your@email.com"
                      required
                      className="h-11"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="contact-message" className="text-sm">Message</Label>
                    <Textarea
                      id="contact-message"
                      name="message"
                      placeholder="Tell me about your project..."
                      rows={5}
                      required
                      className="resize-none"
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full min-h-[48px] text-base"
                    size="lg"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Sending..." : "Send Message"}
                  </Button>
                </form>
              </CardContent>
            </Card>

          </div>
        </div>
      </div>
    </section>
  );
}
