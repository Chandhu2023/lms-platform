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
    const { title, description, url, source, duration, courseId } = body

    // Verify the course exists and the user has permission to add videos to it
    const course = await prisma.course.findUnique({
      where: {
        id: courseId,
      },
    })

    if (!course) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 })
    }

    if (session.user.role !== "ADMIN" && course.instructorId !== session.user.id) {
      return NextResponse.json({ error: "Unauthorized to add videos to this course" }, { status: 401 })
    }

    const video = await prisma.video.create({
      data: {
        title,
        description,
        url,
        source,
        duration: Number.parseInt(duration) || 0,
        courseId,
      },
    })

    return NextResponse.json(video)
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: "Error creating video" }, { status: 500 })
  }
}

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const courseId = searchParams.get("courseId")
    const source = searchParams.get("source")

    let videos

    if (session.user.role === "ADMIN") {
      // Admins can see all videos
      videos = await prisma.video.findMany({
        where: {
          ...(courseId ? { courseId } : {}),
          ...(source ? { source } : {}),
        },
        include: {
          course: {
            select: {
              id: true,
              title: true,
              instructor: {
                select: {
                  id: true,
                  name: true,
                },
              },
            },
          },
        },
        orderBy: { createdAt: "desc" },
      })
    } else if (session.user.role === "TRAINER") {
      // Trainers can only see videos for their courses
      videos = await prisma.video.findMany({
        where: {
          ...(courseId ? { courseId } : {}),
          ...(source ? { source } : {}),
          course: {
            instructorId: session.user.id,
          },
        },
        include: {
          course: {
            select: {
              id: true,
              title: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
      })
    } else {
      // Students can only see videos for courses they're enrolled in
      const enrollments = await prisma.enrollment.findMany({
        where: {
          userId: session.user.id,
        },
        select: {
          courseId: true,
        },
      })

      const enrolledCourseIds = enrollments.map((e) => e.courseId)

      videos = await prisma.video.findMany({
        where: {
          courseId: {
            in: enrolledCourseIds,
          },
          ...(courseId ? { courseId } : {}),
          ...(source ? { source } : {}),
        },
        include: {
          course: {
            select: {
              id: true,
              title: true,
              instructor: {
                select: {
                  id: true,
                  name: true,
                },
              },
            },
          },
        },
        orderBy: { createdAt: "desc" },
      })
    }

    return NextResponse.json(videos)
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: "Error fetching videos" }, { status: 500 })
  }
}

