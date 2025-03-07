"use client"

import { useAuth } from "@/components/auth-provider"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BookOpen, Edit, Plus, Search, Trash2 } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

const courses = [
  {
    id: 1,
    title: "Web Development Fundamentals",
    description: "Learn the basics of HTML, CSS, and JavaScript",
    instructor: "John Doe",
    students: 120,
    status: "published",
    createdAt: "2023-10-15",
  },
  {
    id: 2,
    title: "JavaScript Advanced Concepts",
    description: "Deep dive into advanced JavaScript concepts",
    instructor: "Jane Smith",
    students: 85,
    status: "published",
    createdAt: "2023-11-02",
  },
  {
    id: 3,
    title: "React for Beginners",
    description: "Introduction to React.js framework",
    instructor: "Alex Johnson",
    students: 64,
    status: "published",
    createdAt: "2023-12-10",
  },
  {
    id: 4,
    title: "Node.js API Development",
    description: "Build RESTful APIs with Node.js and Express",
    instructor: "Sarah Williams",
    students: 42,
    status: "draft",
    createdAt: "2024-01-05",
  },
  {
    id: 5,
    title: "UI/UX Design Principles",
    description: "Learn the fundamentals of UI/UX design",
    instructor: "Michael Brown",
    students: 0,
    status: "draft",
    createdAt: "2024-02-20",
  },
]

export default function AdminCoursesPage() {
  const { user, isLoading } = useAuth()
  const [searchQuery, setSearchQuery] = useState("")

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (!user || user.role !== "admin") {
    return <div>Unauthorized</div>
  }

  const filteredCourses = courses.filter(
    (course) =>
      course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.instructor.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const publishedCourses = filteredCourses.filter((course) => course.status === "published")
  const draftCourses = filteredCourses.filter((course) => course.status === "draft")

  return (
    <DashboardLayout>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Course Management</h1>
          <Button asChild>
            <Link href="/admin/courses/new">
              <Plus className="mr-2 h-4 w-4" /> Add Course
            </Link>
          </Button>
        </div>

        <div className="flex items-center space-x-2">
          <div className="relative flex-1">
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

        <Tabs defaultValue="all">
          <TabsList>
            <TabsTrigger value="all">All Courses ({filteredCourses.length})</TabsTrigger>
            <TabsTrigger value="published">Published ({publishedCourses.length})</TabsTrigger>
            <TabsTrigger value="drafts">Drafts ({draftCourses.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4">
            {filteredCourses.length === 0 ? (
              <Card>
                <CardContent className="py-10 text-center">
                  <BookOpen className="mx-auto h-10 w-10 text-muted-foreground" />
                  <p className="mt-2 text-muted-foreground">No courses found</p>
                </CardContent>
              </Card>
            ) : (
              filteredCourses.map((course) => <CourseCard key={course.id} course={course} />)
            )}
          </TabsContent>

          <TabsContent value="published" className="space-y-4">
            {publishedCourses.length === 0 ? (
              <Card>
                <CardContent className="py-10 text-center">
                  <BookOpen className="mx-auto h-10 w-10 text-muted-foreground" />
                  <p className="mt-2 text-muted-foreground">No published courses found</p>
                </CardContent>
              </Card>
            ) : (
              publishedCourses.map((course) => <CourseCard key={course.id} course={course} />)
            )}
          </TabsContent>

          <TabsContent value="drafts" className="space-y-4">
            {draftCourses.length === 0 ? (
              <Card>
                <CardContent className="py-10 text-center">
                  <BookOpen className="mx-auto h-10 w-10 text-muted-foreground" />
                  <p className="mt-2 text-muted-foreground">No draft courses found</p>
                </CardContent>
              </Card>
            ) : (
              draftCourses.map((course) => <CourseCard key={course.id} course={course} />)
            )}
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}

function CourseCard({ course }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>{course.title}</span>
          <span
            className={`text-xs px-2 py-1 rounded-full ${
              course.status === "published"
                ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
                : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100"
            }`}
          >
            {course.status === "published" ? "Published" : "Draft"}
          </span>
        </CardTitle>
        <CardDescription>{course.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label className="text-xs text-muted-foreground">Instructor</Label>
            <p className="text-sm font-medium">{course.instructor}</p>
          </div>
          <div>
            <Label className="text-xs text-muted-foreground">Students</Label>
            <p className="text-sm font-medium">{course.students}</p>
          </div>
          <div>
            <Label className="text-xs text-muted-foreground">Created</Label>
            <p className="text-sm font-medium">{course.createdAt}</p>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-end space-x-2">
        <Button variant="outline" size="sm" asChild>
          <Link href={`/admin/courses/${course.id}`}>
            <Edit className="mr-2 h-4 w-4" /> Edit
          </Link>
        </Button>
        <Button variant="destructive" size="sm">
          <Trash2 className="mr-2 h-4 w-4" /> Delete
        </Button>
      </CardFooter>
    </Card>
  )
}

