import { put } from "@vercel/blob"
import { type NextRequest, NextResponse } from "next/server"

const ALLOWED_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
]

const ALLOWED_EXTENSIONS = [".pdf", ".doc", ".docx"]

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File | null

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    const lowerName = file.name.toLowerCase()
    const hasValidExtension = ALLOWED_EXTENSIONS.some((ext) => lowerName.endsWith(ext))
    const hasValidType = ALLOWED_TYPES.includes(file.type)

    if (!hasValidExtension && !hasValidType) {
      return NextResponse.json(
        { error: "Invalid file type. Only PDF and DOC/DOCX files are allowed." },
        { status: 400 },
      )
    }

    // Limit to 10MB
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json({ error: "File too large. Maximum size is 10MB." }, { status: 400 })
    }

    const blob = await put(`cv/${file.name}`, file, {
      access: "public",
      addRandomSuffix: true,
    })

    return NextResponse.json({ url: blob.url, name: file.name })
  } catch (error) {
    console.error("CV upload error:", error)
    return NextResponse.json({ error: "Upload failed" }, { status: 500 })
  }
}
