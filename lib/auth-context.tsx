"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

interface AuthContextType {
  isAuthenticated: boolean
  login: (password: string) => boolean
  logout: () => void
  changePassword: (currentPassword: string, newPassword: string) => boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Default password
const DEFAULT_PASSWORD = "admin123"

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    // Check if user is already authenticated
    const auth = localStorage.getItem("adminAuth")
    if (auth === "true") {
      setIsAuthenticated(true)
    }
  }, [])

  const getCurrentPassword = (): string => {
    return localStorage.getItem("adminPassword") || DEFAULT_PASSWORD
  }

  const login = (password: string): boolean => {
    const currentPassword = getCurrentPassword()
    if (password === currentPassword) {
      localStorage.setItem("adminAuth", "true")
      setIsAuthenticated(true)
      return true
    }
    return false
  }

  const logout = () => {
    localStorage.removeItem("adminAuth")
    setIsAuthenticated(false)
  }

  const changePassword = (currentPassword: string, newPassword: string): boolean => {
    const storedPassword = getCurrentPassword()
    if (currentPassword === storedPassword) {
      localStorage.setItem("adminPassword", newPassword)
      return true
    }
    return false
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout, changePassword }}>{children}</AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
