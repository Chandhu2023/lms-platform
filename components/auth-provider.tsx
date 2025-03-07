"use client"

import type React from "react"

import { createContext, useContext, useState, useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import { SessionProvider, useSession, signIn, signOut } from "next-auth/react"

type AuthContextType = {
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProviderContent({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const pathname = usePathname()
  const { data: session, status } = useSession()

  useEffect(() => {
    if (status !== "loading") {
      setIsLoading(false)
    }
  }, [status])

  // Protect routes
  useEffect(() => {
    if (status !== "loading") {
      // Public routes that don't require authentication
      const publicRoutes = ["/", "/login", "/register"]
      const isPublicRoute = publicRoutes.some((route) => pathname === route)

      if (!session && !isPublicRoute) {
        router.push("/login")
      } else if (session?.user) {
        // Redirect based on role if on login page
        if (pathname === "/login" || pathname === "/register") {
          switch (session.user.role) {
            case "ADMIN":
              router.push("/admin/dashboard")
              break
            case "TRAINER":
              router.push("/trainer/dashboard")
              break
            case "STUDENT":
              router.push("/student/dashboard")
              break
          }
        }

        // Protect role-specific routes
        if (pathname.startsWith("/admin") && session.user.role !== "ADMIN") {
          router.push(`/${session.user.role.toLowerCase()}/dashboard`)
        } else if (pathname.startsWith("/trainer") && session.user.role !== "TRAINER") {
          router.push(`/${session.user.role.toLowerCase()}/dashboard`)
        } else if (pathname.startsWith("/student") && session.user.role !== "STUDENT") {
          router.push(`/${session.user.role.toLowerCase()}/dashboard`)
        }
      }
    }
  }, [session, status, pathname, router])

  const login = async (email: string, password: string) => {
    setIsLoading(true)
    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      })

      if (result?.error) {
        throw new Error(result.error)
      }
    } catch (error) {
      console.error("Login failed:", error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    signOut({ callbackUrl: "/" })
  }

  return <AuthContext.Provider value={{ login, logout, isLoading }}>{children}</AuthContext.Provider>
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <AuthProviderContent>{children}</AuthProviderContent>
    </SessionProvider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

