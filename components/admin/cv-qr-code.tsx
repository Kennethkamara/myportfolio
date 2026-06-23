"use client"

import { useEffect, useRef, useState } from "react"
import QRCode from "qrcode"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Download, QrCode } from "lucide-react"

interface CVQRCodeProps {
  /** The path on the site the QR code should point to, e.g. "/cv" */
  targetPath?: string
}

export function CVQRCode({ targetPath = "/cv" }: CVQRCodeProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [origin, setOrigin] = useState("")
  const [customUrl, setCustomUrl] = useState("")

  useEffect(() => {
    if (typeof window !== "undefined") {
      setOrigin(window.location.origin)
    }
  }, [])

  const targetUrl = customUrl.trim() || `${origin}${targetPath}`

  useEffect(() => {
    if (canvasRef.current && targetUrl) {
      QRCode.toCanvas(
        canvasRef.current,
        targetUrl,
        {
          width: 240,
          margin: 2,
          color: { dark: "#000000", light: "#ffffff" },
        },
        (error) => {
          if (error) console.error("QR code generation error:", error)
        },
      )
    }
  }, [targetUrl])

  const handleDownload = async () => {
    try {
      const dataUrl = await QRCode.toDataURL(targetUrl, {
        width: 1024,
        margin: 2,
        color: { dark: "#000000", light: "#ffffff" },
      })
      const link = document.createElement("a")
      link.href = dataUrl
      link.download = "cv-qr-code.png"
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    } catch (error) {
      console.error("QR download error:", error)
    }
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="qr-url">QR Code Destination</Label>
        <Input
          id="qr-url"
          value={customUrl}
          onChange={(e) => setCustomUrl(e.target.value)}
          placeholder={`${origin}${targetPath}`}
        />
        <p className="text-xs text-muted-foreground">
          Leave empty to use your live CV page. When scanned, this QR code takes visitors straight to your CV.
        </p>
      </div>

      <div className="flex flex-col items-center gap-4 rounded-lg border bg-muted/30 p-6">
        <div className="rounded-lg bg-white p-4">
          <canvas ref={canvasRef} aria-label="CV QR code" />
        </div>
        <p className="break-all text-center text-xs text-muted-foreground">{targetUrl}</p>
        <Button onClick={handleDownload} className="w-full sm:w-auto">
          <Download className="mr-2 h-4 w-4" />
          Download QR Code (PNG)
        </Button>
      </div>

      <div className="flex items-start gap-3 rounded-lg border border-dashed p-4">
        <QrCode className="mt-0.5 h-5 w-5 shrink-0 text-muted-foreground" />
        <p className="text-sm text-muted-foreground">
          Print this QR code on business cards, posters, or your physical CV. Anyone who scans it will
          be taken directly to your online CV.
        </p>
      </div>
    </div>
  )
}
