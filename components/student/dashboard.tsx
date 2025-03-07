"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { BookOpen, Clock, Award } from "lucide-react"
import Link from "next/link"

const enrolledCourses = [
  {
    id: 1,
    title: "Web Development Fundamentals",
    instructor: "John Doe",
    progress: 75,
    nextLesson: "CSS Layouts and Positioning",
  },
  {
    id: 2,
    title: "JavaScript Essentials",
    instructor: "Jane Smith",
    progress: 45,
    nextLesson: "Working with Arrays and Objects",
  },
  {
    id: 3,
    title: "React for Beginners",
    instructor: "Alex Johnson",
    progress: 20,
    nextLesson: "Creating Your First Component",
  },
]

export function StudentDashboard() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Student Dashboard</h1>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Enrolled Courses</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{enrolledCourses.length}</div>
            <p className="text-xs text-muted-foreground">1 added this month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Learning Hours</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24.5</div>
            <p className="text-xs text-muted-foreground">+3.5 hours this week</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Certificates</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2</div>
            <p className="text-xs text-muted-foreground">1 pending completion</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>My Learning Progress</CardTitle>
          <CardDescription>Continue where you left off</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {enrolledCourses.map((course) => (
            <div key={course.id} className="space-y-2">
              <div className="flex justify-between">
                <div>
                  <h3 className="font-medium">{course.title}</h3>
                  <p className="text-sm text-muted-foreground">Instructor: {course.instructor}</p>
                </div>
                <span className="text-sm font-medium">{course.progress}%</span>
              </div>
              <Progress value={course.progress} className="h-2" />
              <div className="flex justify-between items-center pt-2">
                <p className="text-sm">Next: {course.nextLesson}</p>
                <Button size="sm" asChild>
                  <Link href={`/student/courses/${course.id}`}>Continue</Link>
                </Button>
              </div>
            </div>
          ))}
        </CardContent>
        <CardFooter>
          <Button variant="outline" className="w-full" asChild>
            <Link href="/student/courses">Browse More Courses</Link>
          </Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recommended Courses</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            {["Advanced JavaScript", "Node.js Fundamentals", "UI/UX Design Principles", "Mobile App Development"].map(
              (course, i) => (
                <Card key={i} className="overflow-hidden">
                  <div className="aspect-video bg-muted relative">
                    <img
                      src={`/placeholder.svg?height=180&width=320&text=${encodeURIComponent(course)}`}
                      alt={course}
                      className="object-cover w-full h-full"
                    />
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-medium">{course}</h3>
                    <p className="text-sm text-muted-foreground">
                      {["John Doe", "Jane Smith", "Alex Johnson", "Sarah Williams"][i]}
                    </p>
                  </CardContent>
                  <CardFooter className="p-4 pt-0">
                    <Button variant="outline" size="sm" className="w-full" asChild>
                      <Link href={`/student/courses/recommended/${i}`}>View Course</Link>
                    </Button>
                  </CardFooter>
                </Card>
              ),
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

