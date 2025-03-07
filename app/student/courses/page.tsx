"use client"

import { useAuth } from "@/components/auth-provider"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { Search } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

const enrolledCourses = [
  {
    id: 1,
    title: "Web Development Fundamentals",
    description: "Learn the basics of HTML, CSS, and JavaScript",
    instructor: "John Doe",
    progress: 75,
    totalLessons: 12,
    completedLessons: 9,
    thumbnail: "/placeholder.svg?height=180&width=320&text=Web%20Development",
  },
  {
    id: 2,
    title: "JavaScript Essentials",
    description: "Master the core concepts of JavaScript programming",
    instructor: "Jane Smith",
    progress: 45,
    totalLessons: 10,
    completedLessons: 4,
    thumbnail: "/placeholder.svg?height=180&width=320&text=JavaScript",
  },
  {
    id: 3,
    title: "React for Beginners",
    description: "Introduction to React.js framework",
    instructor: "Alex Johnson",
    progress: 20,
    totalLessons: 15,
    completedLessons: 3,
    thumbnail: "/placeholder.svg?height=180&width=320&text=React",
  },
]

const availableCourses = [
  {
    id: 4,
    title: "Advanced JavaScript",
    description: "Deep dive into advanced JavaScript concepts",
    instructor: "Jane Smith",
    price: "$49.99",
    rating: 4.8,
    students: 1245,
    thumbnail: "/placeholder.svg?height=180&width=320&text=Advanced%20JS",
  },
  {
    id: 5,
    title: "Node.js Fundamentals",
    description: "Learn server-side JavaScript with Node.js",
    instructor: "Alex Johnson",
    price: "$59.99",
    rating: 4.6,
    students: 982,
    thumbnail: "/placeholder.svg?height=180&width=320&text=Node.js",
  },
  {
    id: 6,
    title: "UI/UX Design Principles",
    description: "Learn the fundamentals of UI/UX design",
    instructor: "Sarah Williams",
    price: "$39.99",
    rating: 4.9,
    students: 1567,
    thumbnail: "/placeholder.svg?height=180&width=320&text=UI%2FUX%20Design",
  },
  {
    id: 7,
    title: "Mobile App Development",
    description: "Build cross-platform mobile apps",
    instructor: "Michael Brown",
    price: "$69.99",
    rating: 4.7,
    students: 1123,
    thumbnail: "/placeholder.svg?height=180&width=320&text=Mobile%20Apps",
  },
]

export default function StudentCoursesPage() {
  const { user, isLoading } = useAuth()
  const [searchQuery, setSearchQuery] = useState("")

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (!user || user.role !== "student") {
    return <div>Unauthorized</div>
  }

  const filteredEnrolled = enrolledCourses.filter(
    (course) =>
      course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.instructor.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const filteredAvailable = availableCourses.filter(
    (course) =>
      course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.instructor.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">My Courses</h1>
          <div className="relative w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search courses..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Enrolled Courses</h2>
          {filteredEnrolled.length === 0 ? (
            <p className="text-muted-foreground">No enrolled courses found</p>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredEnrolled.map((course) => (
                <Card key={course.id} className="overflow-hidden">
                  <div className="aspect-video bg-muted">
                    <img
                      src={course.thumbnail || "/placeholder.svg"}
                      alt={course.title}
                      className="object-cover w-full h-full"
                    />
                  </div>
                  <CardHeader>
                    <CardTitle>{course.title}</CardTitle>
                    <CardDescription>{course.instructor}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Progress</span>
                      <span>{course.progress}%</span>
                    </div>
                    <Progress value={course.progress} className="h-2" />
                    <p className="text-sm text-muted-foreground">
                      {course.completedLessons} of {course.totalLessons} lessons completed
                    </p>
                  </CardContent>
                  <CardFooter>
                    <Button className="w-full" asChild>
                      <Link href={`/student/courses/${course.id}`}>Continue Learning</Link>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Available Courses</h2>
          {filteredAvailable.length === 0 ? (
            <p className="text-muted-foreground">No available courses found</p>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredAvailable.map((course) => (
                <Card key={course.id} className="overflow-hidden">
                  <div className="aspect-video bg-muted">
                    <img
                      src={course.thumbnail || "/placeholder.svg"}
                      alt={course.title}
                      className="object-cover w-full h-full"
                    />
                  </div>
                  <CardHeader>
                    <CardTitle>{course.title}</CardTitle>
                    <CardDescription>{course.instructor}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex justify-between">
                      <span className="font-bold">{course.price}</span>
                      <span className="text-sm">
                        ⭐ {course.rating} ({course.students} students)
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">{course.description}</p>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" className="w-full" asChild>
                      <Link href={`/student/courses/details/${course.id}`}>View Details</Link>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}

