"use client";

import type React from "react";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Upload, X, FileIcon, ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface FileUploadProps {
  accept?: string;
  maxSize?: number; // in MB
  onUpload: (url: string, fileName?: string) => void;
  currentFile?: string;
  label?: string;
  multiple?: boolean;
}

const compressImage = (file: File, maxWidth = 1200): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        let width = img.width;
        let height = img.height;

        // Calculate new dimensions
        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d");
        if (!ctx) {
          reject(new Error("Failed to get canvas context"));
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);

        // Convert to base64 with compression
        const compressedDataUrl = canvas.toDataURL("image/jpeg", 0.8);
        console.log(
          "[v0] Image compressed from",
          file.size,
          "to",
          compressedDataUrl.length,
          "bytes",
        );
        resolve(compressedDataUrl);
      };
      img.onerror = () => reject(new Error("Failed to load image"));
      img.src = e.target?.result as string;
    };
    reader.onerror = () => reject(new Error("Failed to read file"));
    reader.readAsDataURL(file);
  });
};

export function FileUpload({
  accept = "image/*",
  maxSize = 5,
  onUpload,
  currentFile,
  label = "Upload File",
  multiple = false,
}: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [preview, setPreview] = useState<string | null>(currentFile || null);
  const [fileName, setFileName] = useState<string>("");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    setPreview(currentFile || null);
    if (!currentFile) {
      setFileName("");
    }
  }, [currentFile]);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFile(files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFile(files[0]);
    }
  };

  const handleFile = async (file: File) => {
    console.log(
      "[v0] Starting file upload:",
      file.name,
      "Size:",
      file.size,
      "Type:",
      file.type,
    );

    // Validate file size
    if (file.size > maxSize * 1024 * 1024) {
      console.log(
        "[v0] File too large:",
        file.size,
        "Max:",
        maxSize * 1024 * 1024,
      );
      toast({
        title: "File too large",
        description: `File size must be less than ${maxSize}MB. Your file is ${(file.size / 1024 / 1024).toFixed(2)}MB`,
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);
    setFileName(file.name);

    try {
      let result: string;

      if (file.type.startsWith("image/")) {
        console.log("[v0] Compressing image...");
        setUploadProgress(30);
        result = await compressImage(file);
        setUploadProgress(70);
      } else {
        // For non-images (PDFs, docs), read as base64
        console.log("[v0] Reading file as base64...");
        result = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = (e) => {
            setUploadProgress(70);
            resolve(e.target?.result as string);
          };
          reader.onerror = () => reject(new Error("Failed to read file"));
          reader.readAsDataURL(file);
        });
      }

      setUploadProgress(90);
      console.log("[v0] File processed, size:", result.length, "bytes");

      try {
        const testKey = "__storage_test__";
        localStorage.setItem(testKey, result);
        localStorage.removeItem(testKey);
        console.log("[v0] localStorage quota check passed");
      } catch (quotaError) {
        console.error("[v0] localStorage quota exceeded:", quotaError);
        throw new Error(
          "Storage quota exceeded. Try a smaller file or clear some space.",
        );
      }

      setPreview(result);
      onUpload(result, file.name);
      setUploadProgress(100);

      console.log("[v0] Upload successful");
      toast({
        title: "File uploaded",
        description: `${file.name} has been uploaded successfully.`,
      });
    } catch (error) {
      console.error("[v0] Upload error:", error);
      toast({
        title: "Upload failed",
        description:
          error instanceof Error
            ? error.message
            : "There was an error uploading your file.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
      setTimeout(() => setUploadProgress(0), 1000);
    }
  };

  const handleRemove = () => {
    console.log("[v0] Removing file");
    setPreview(null);
    setFileName("");
    onUpload("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const isImage = accept.includes("image");

  return (
    <div className="space-y-2">
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        onChange={handleFileSelect}
        multiple={multiple}
        className="hidden"
        id="file-upload"
      />

      {preview ? (
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              {isImage ? (
                <div className="relative h-20 w-20 rounded overflow-hidden bg-muted flex-shrink-0">
                  <img
                    src={preview || "/placeholder.svg"}
                    alt="Preview"
                    className="h-full w-full object-cover"
                  />
                </div>
              ) : (
                <div className="h-20 w-20 bg-muted rounded flex items-center justify-center flex-shrink-0">
                  <FileIcon className="h-8 w-8 text-muted-foreground" />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">
                  {fileName || "File uploaded"}
                </p>
                <p className="text-xs text-muted-foreground">
                  Click remove to change
                </p>
              </div>
              <Button
                variant="destructive"
                size="icon"
                onClick={handleRemove}
                className="flex-shrink-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={cn(
            "border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors",
            isDragging
              ? "border-primary bg-primary/5"
              : "border-border hover:border-primary/50",
            isUploading && "opacity-50 pointer-events-none",
          )}
          onClick={() => fileInputRef.current?.click()}
        >
          {isImage ? (
            <ImageIcon className="h-8 w-8 mx-auto mb-4 text-muted-foreground" />
          ) : (
            <Upload className="h-8 w-8 mx-auto mb-4 text-muted-foreground" />
          )}
          <p className="text-sm font-medium mb-1">{label}</p>
          <p className="text-xs text-muted-foreground">
            Drag and drop or click to browse (max {maxSize}MB)
            {isImage && " - Images will be optimized"}
          </p>
          {isUploading && (
            <div className="mt-4">
              <div className="h-1 w-full bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
              <p className="text-xs text-primary mt-2">
                {uploadProgress < 30 && "Reading file..."}
                {uploadProgress >= 30 && uploadProgress < 70 && "Processing..."}
                {uploadProgress >= 70 && uploadProgress < 100 && "Saving..."}
                {uploadProgress === 100 && "Complete!"}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
