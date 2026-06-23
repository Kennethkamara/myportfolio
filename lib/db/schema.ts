import { pgTable, text, jsonb, timestamp } from "drizzle-orm/pg-core"
import type { PortfolioData } from "@/lib/types"

export const portfolio = pgTable("portfolio", {
  id: text("id").primaryKey().default("default"),
  data: jsonb("data").$type<PortfolioData>().notNull(),
  adminPassword: text("admin_password").notNull(),
  sessionToken: text("session_token"),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
})
