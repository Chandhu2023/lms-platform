import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { prisma } from "@/lib/db"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const course = await prisma.course.findUnique({
      where: {
        id: params.id,
      },
      include: {
        instructor: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        videos: true,
        lessons: {
          orderBy: {
            order: "asc",
          },
        },
        _count: {
          select: { enrollments: true },
        },
      },
    })

    if (!course) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 })
    }

    // Check if the user is authorized to view this course
    if (session.user.role !== "ADMIN" && course.instructorId !== session.user.id && course.status !== "published") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    return NextResponse.json(course)
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: "Error fetching course" }, { status: 500 })
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || (session.user.role !== "ADMIN" && session.user.role !== "TRAINER")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { title, description, price, status } = body

    // Check if the course exists and if the user is authorized to update it
    const existingCourse = await prisma.course.findUnique({
      where: {
        id: params.id,
      },
    })

    if (!existingCourse) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 })
    }

    if (session.user.role !== "ADMIN" && existingCourse.instructorId !== session.user.id) {
      return NextResponse.json({ error: "Unauthorized to update this course" }, { status: 401 })
    }

    const updatedCourse = await prisma.course.update({
      where: {
        id: params.id,
      },
      data: {
        title,
        description,
        price: price !== undefined ? Number.parseFloat(price) : undefined,
        status,
      },
    })

    return NextResponse.json(updatedCourse)
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: "Error updating course" }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || (session.user.role !== "ADMIN" && session.user.role !== "TRAINER")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Check if the course exists and if the user is authorized to delete it
    const existingCourse = await prisma.course.findUnique({
      where: {
        id: params.id,
      },
    })

    if (!existingCourse) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 })
    }

    if (session.user.role !== "ADMIN" && existingCourse.instructorId !== session.user.id) {
      return NextResponse.json({ error: "Unauthorized to delete this course" }, { status: 401 })
    }

    // Delete related lessons first (to avoid FK constraints)
    await prisma.lesson.deleteMany({
      where: {
        courseId: params.id,
      },
    })

    // Delete related videos
    await prisma.video.deleteMany({
      where: {
        courseId: params.id,
      },
    })

    // Delete enrollments
    await prisma.enrollment.deleteMany({
      where: {
        courseId: params.id,
      },
    })

    // Finally delete the course
    await prisma.course.delete({
      where: {
        id: params.id,
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: "Error deleting course" }, { status: 500 })
  }
}

