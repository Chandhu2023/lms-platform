import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { prisma } from "@/lib/db"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || (session.user.role !== "ADMIN" && session.user.role !== "TRAINER")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { title, description, price, status } = body

    const course = await prisma.course.create({
      data: {
        title,
        description,
        price: Number.parseFloat(price) || 0,
        status: status || "draft",
        instructorId: session.user.id,
      },
    })

    return NextResponse.json(course)
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: "Error creating course" }, { status: 500 })
  }
}

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const status = searchParams.get("status")

    let courses

    if (session.user.role === "ADMIN") {
      // Admins can see all courses
      courses = await prisma.course.findMany({
        where: status ? { status } : undefined,
        include: {
          instructor: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          _count: {
            select: { enrollments: true, videos: true },
          },
        },
        orderBy: { createdAt: "desc" },
      })
    } else if (session.user.role === "TRAINER") {
      // Trainers can only see their own courses
      courses = await prisma.course.findMany({
        where: {
          instructorId: session.user.id,
          ...(status ? { status } : {}),
        },
        include: {
          _count: {
            select: { enrollments: true, videos: true },
          },
        },
        orderBy: { createdAt: "desc" },
      })
    } else {
      // Students can only see published courses
      courses = await prisma.course.findMany({
        where: {
          status: "published",
        },
        include: {
          instructor: {
            select: {
              id: true,
              name: true,
            },
          },
          _count: {
            select: { enrollments: true },
          },
        },
        orderBy: { createdAt: "desc" },
      })
    }

    return NextResponse.json(courses)
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: "Error fetching courses" }, { status: 500 })
  }
}

