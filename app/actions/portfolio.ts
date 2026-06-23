"use server"

import { randomBytes } from "crypto"
import { cookies } from "next/headers"
import { revalidatePath } from "next/cache"
import { eq } from "drizzle-orm"
import { db } from "@/lib/db"
import { portfolio } from "@/lib/db/schema"
import { mockPortfolioData } from "@/lib/mock-data"
import type { PortfolioData } from "@/lib/types"

const ROW_ID = "default"
const DEFAULT_PASSWORD = "admin123"
const SESSION_COOKIE = "admin_session"

// Ensures the singleton portfolio row exists, seeding it with default data on first run.
async function ensureRow() {
  const existing = await db.select().from(portfolio).where(eq(portfolio.id, ROW_ID)).limit(1)
  if (existing.length === 0) {
    await db.insert(portfolio).values({
      id: ROW_ID,
      data: mockPortfolioData,
      adminPassword: DEFAULT_PASSWORD,
    })
    return
  }
}

export async function getPortfolio(): Promise<PortfolioData> {
  await ensureRow()
  const rows = await db.select().from(portfolio).where(eq(portfolio.id, ROW_ID)).limit(1)
  return rows[0].data
}

async function isAuthed(): Promise<boolean> {
  const cookieStore = await cookies()
  const token = cookieStore.get(SESSION_COOKIE)?.value
  if (!token) return false
  const rows = await db.select().from(portfolio).where(eq(portfolio.id, ROW_ID)).limit(1)
  const stored = rows[0]?.sessionToken
  return Boolean(stored && token === stored)
}

export async function checkAuth(): Promise<boolean> {
  return isAuthed()
}

export async function savePortfolio(data: PortfolioData): Promise<{ ok: boolean; error?: string }> {
  if (!(await isAuthed())) {
    return { ok: false, error: "Unauthorized" }
  }
  await db
    .update(portfolio)
    .set({ data, updatedAt: new Date() })
    .where(eq(portfolio.id, ROW_ID))
  revalidatePath("/")
  revalidatePath("/cv")
  return { ok: true }
}

export async function login(password: string): Promise<{ ok: boolean }> {
  await ensureRow()
  const rows = await db.select().from(portfolio).where(eq(portfolio.id, ROW_ID)).limit(1)
  if (rows[0]?.adminPassword !== password) {
    return { ok: false }
  }
  const token = randomBytes(32).toString("hex")
  await db.update(portfolio).set({ sessionToken: token }).where(eq(portfolio.id, ROW_ID))
  const cookieStore = await cookies()
  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30, // 30 days
  })
  return { ok: true }
}

export async function logout(): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.delete(SESSION_COOKIE)
  await db.update(portfolio).set({ sessionToken: null }).where(eq(portfolio.id, ROW_ID))
}

export async function changeAdminPassword(
  currentPassword: string,
  newPassword: string,
): Promise<{ ok: boolean; error?: string }> {
  if (!(await isAuthed())) {
    return { ok: false, error: "Unauthorized" }
  }
  const rows = await db.select().from(portfolio).where(eq(portfolio.id, ROW_ID)).limit(1)
  if (rows[0]?.adminPassword !== currentPassword) {
    return { ok: false, error: "Current password is incorrect" }
  }
  await db.update(portfolio).set({ adminPassword: newPassword }).where(eq(portfolio.id, ROW_ID))
  return { ok: true }
}
