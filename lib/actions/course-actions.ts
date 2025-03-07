"use server"

import { prisma } from "@/lib/db"
import { revalidatePath } from "next/cache"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"

export async function createCourse(formData: FormData) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || (session.user.role !== "ADMIN" && session.user.role !== "TRAINER")) {
      return { error: "Unauthorized" }
    }

    const title = formData.get("title") as string
    const description = formData.get("description") as string
    const price = Number.parseFloat(formData.get("price") as string) || 0
    const status = (formData.get("status") as string) || "draft"

    if (!title || !description) {
      return { error: "Missing required fields" }
    }

    const course = await prisma.course.create({
      data: {
        title,
        description,
        price,
        status,
        instructorId: session.user.id,
      },
    })

    revalidatePath("/admin/courses")
    revalidatePath("/trainer/courses")

    return { success: true, courseId: course.id }
  } catch (error) {
    console.error("Error creating course:", error)
    return { error: "Failed to create course" }
  }
}

export async function getMyCourses() {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return []
    }

    let courses

    if (session.user.role === "ADMIN") {
      courses = await prisma.course.findMany({
        include: {
          instructor: {
            select: {
              id: true,
              name: true,
            },
          },
          _count: {
            select: { enrollments: true, videos: true },
          },
        },
        orderBy: { createdAt: "desc" },
      })
    } else if (session.user.role === "TRAINER") {
      courses = await prisma.course.findMany({
        where: {
          instructorId: session.user.id,
        },
        include: {
          _count: {
            select: { enrollments: true, videos: true },
          },
        },
        orderBy: { createdAt: "desc" },
      })
    } else {
      // Get enrolled courses for students
      const enrollments = await prisma.enrollment.findMany({
        where: {
          userId: session.user.id,
        },
        include: {
          course: {
            include: {
              instructor: {
                select: {
                  id: true,
                  name: true,
                },
              },
              _count: {
                select: { lessons: true },
              },
            },
          },
        },
        orderBy: { createdAt: "desc" },
      })

      courses = enrollments.map((enrollment) => ({
        ...enrollment.course,
        progress: enrollment.progress,
        enrollmentId: enrollment.id,
      }))
    }

    return courses
  } catch (error) {
    console.error("Error fetching courses:", error)
    return []
  }
}

