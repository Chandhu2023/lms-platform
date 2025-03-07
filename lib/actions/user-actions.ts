"use server"

import { prisma } from "@/lib/db"
import { hash } from "bcrypt"
import { revalidatePath } from "next/cache"

export async function registerUser(formData: FormData) {
  try {
    const name = formData.get("name") as string
    const email = formData.get("email") as string
    const password = formData.get("password") as string
    const role = (formData.get("role") as "ADMIN" | "TRAINER" | "STUDENT") || "STUDENT"

    if (!name || !email || !password) {
      return { error: "Missing required fields" }
    }

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      return { error: "User already exists" }
    }

    // Hash password
    const hashedPassword = await hash(password, 10)

    // Create user
    await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role,
      },
    })

    revalidatePath("/admin/users")
    return { success: true }
  } catch (error) {
    console.error("Error registering user:", error)
    return { error: "Failed to register user" }
  }
}

export async function getAllUsers() {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        _count: {
          select: {
            courses: true,
            enrollments: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    })

    return users
  } catch (error) {
    console.error("Error fetching users:", error)
    return []
  }
}

export async function deleteUser(userId: string) {
  try {
    await prisma.user.delete({
      where: { id: userId },
    })

    revalidatePath("/admin/users")
    return { success: true }
  } catch (error) {
    console.error("Error deleting user:", error)
    return { error: "Failed to delete user" }
  }
}

