"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"
import { BookOpen, Video, Users, Plus } from "lucide-react"
import Link from "next/link"

const courseEngagementData = [
  { name: "Web Dev Basics", views: 120, completions: 80 },
  { name: "Advanced JS", views: 98, completions: 65 },
  { name: "React Mastery", views: 86, completions: 42 },
  { name: "Node.js API", views: 72, completions: 38 },
]

export function TrainerDashboard() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Trainer Dashboard</h1>
        <Button asChild>
          <Link href="/trainer/courses/new">
            <Plus className="mr-2 h-4 w-4" /> Create Course
          </Link>
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">My Courses</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">2 published this month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">My Videos</CardTitle>
            <Video className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">48</div>
            <p className="text-xs text-muted-foreground">6 uploaded this week</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">284</div>
            <p className="text-xs text-muted-foreground">+24 new enrollments</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Course Engagement</CardTitle>
          <CardDescription>Views and completions for your top courses</CardDescription>
        </CardHeader>
        <CardContent className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={courseEngagementData}
              margin={{
                top: 20,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="views" fill="#3b82f6" name="Views" />
              <Bar dataKey="completions" fill="#10b981" name="Completions" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Courses</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {[
                "Web Development Fundamentals",
                "JavaScript Advanced Concepts",
                "React for Beginners",
                "Node.js API Development",
              ].map((course, i) => (
                <li key={i} className="flex items-center justify-between rounded-md border p-3">
                  <span>{course}</span>
                  <Button variant="ghost" size="sm" asChild>
                    <Link href={`/trainer/courses/${i}`}>View</Link>
                  </Button>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Videos</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {[
                "Introduction to HTML",
                "CSS Flexbox Layout",
                "JavaScript DOM Manipulation",
                "React Hooks Tutorial",
              ].map((video, i) => (
                <li key={i} className="flex items-center justify-between rounded-md border p-3">
                  <span>{video}</span>
                  <Button variant="ghost" size="sm" asChild>
                    <Link href={`/trainer/videos/${i}`}>View</Link>
                  </Button>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

