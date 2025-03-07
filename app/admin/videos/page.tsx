"use client"

import { useAuth } from "@/components/auth-provider"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Edit, Plus, Search, Trash2, Video } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

const videos = [
  {
    id: 1,
    title: "Introduction to HTML",
    description: "Learn the basics of HTML markup language",
    source: "Vimeo",
    duration: "12:45",
    course: "Web Development Fundamentals",
    uploadedAt: "2023-10-18",
  },
  {
    id: 2,
    title: "CSS Flexbox Layout",
    description: "Master CSS Flexbox for responsive layouts",
    source: "Zoom Recording",
    duration: "24:30",
    course: "Web Development Fundamentals",
    uploadedAt: "2023-10-25",
  },
  {
    id: 3,
    title: "JavaScript DOM Manipulation",
    description: "Learn to manipulate the DOM with JavaScript",
    source: "Vimeo",
    duration: "18:15",
    course: "JavaScript Advanced Concepts",
    uploadedAt: "2023-11-05",
  },
  {
    id: 4,
    title: "React Hooks Tutorial",
    description: "Understanding React Hooks in depth",
    source: "Zoom Recording",
    duration: "32:10",
    course: "React for Beginners",
    uploadedAt: "2023-12-12",
  },
  {
    id: 5,
    title: "Building RESTful APIs",
    description: "Create RESTful APIs with Node.js and Express",
    source: "Vimeo",
    duration: "28:45",
    course: "Node.js API Development",
    uploadedAt: "2024-01-08",
  },
]

export default function AdminVideosPage() {
  const { user, isLoading } = useAuth()
  const [searchQuery, setSearchQuery] = useState("")

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (!user || user.role !== "admin") {
    return <div>Unauthorized</div>
  }

  const filteredVideos = videos.filter(
    (video) =>
      video.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      video.course.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const vimeoVideos = filteredVideos.filter((video) => video.source === "Vimeo")
  const zoomVideos = filteredVideos.filter((video) => video.source === "Zoom Recording")

  return (
    <DashboardLayout>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Video Management</h1>
          <Button asChild>
            <Link href="/admin/videos/new">
              <Plus className="mr-2 h-4 w-4" /> Upload Video
            </Link>
          </Button>
        </div>

        <div className="flex items-center space-x-2">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search videos..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <Tabs defaultValue="all">
          <TabsList>
            <TabsTrigger value="all">All Videos ({filteredVideos.length})</TabsTrigger>
            <TabsTrigger value="vimeo">Vimeo ({vimeoVideos.length})</TabsTrigger>
            <TabsTrigger value="zoom">Zoom Recordings ({zoomVideos.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4">
            {filteredVideos.length === 0 ? (
              <Card>
                <CardContent className="py-10 text-center">
                  <Video className="mx-auto h-10 w-10 text-muted-foreground" />
                  <p className="mt-2 text-muted-foreground">No videos found</p>
                </CardContent>
              </Card>
            ) : (
              filteredVideos.map((video) => <VideoCard key={video.id} video={video} />)
            )}
          </TabsContent>

          <TabsContent value="vimeo" className="space-y-4">
            {vimeoVideos.length === 0 ? (
              <Card>
                <CardContent className="py-10 text-center">
                  <Video className="mx-auto h-10 w-10 text-muted-foreground" />
                  <p className="mt-2 text-muted-foreground">No Vimeo videos found</p>
                </CardContent>
              </Card>
            ) : (
              vimeoVideos.map((video) => <VideoCard key={video.id} video={video} />)
            )}
          </TabsContent>

          <TabsContent value="zoom" className="space-y-4">
            {zoomVideos.length === 0 ? (
              <Card>
                <CardContent className="py-10 text-center">
                  <Video className="mx-auto h-10 w-10 text-muted-foreground" />
                  <p className="mt-2 text-muted-foreground">No Zoom recordings found</p>
                </CardContent>
              </Card>
            ) : (
              zoomVideos.map((video) => <VideoCard key={video.id} video={video} />)
            )}
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}

function VideoCard({ video }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>{video.title}</span>
          <span
            className={`text-xs px-2 py-1 rounded-full ${
              video.source === "Vimeo"
                ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100"
                : "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-100"
            }`}
          >
            {video.source}
          </span>
        </CardTitle>
        <CardDescription>{video.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <Label className="text-xs text-muted-foreground">Duration</Label>
            <p className="text-sm font-medium">{video.duration}</p>
          </div>
          <div>
            <Label className="text-xs text-muted-foreground">Course</Label>
            <p className="text-sm font-medium">{video.course}</p>
          </div>
          <div>
            <Label className="text-xs text-muted-foreground">Uploaded</Label>
            <p className="text-sm font-medium">{video.uploadedAt}</p>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" size="sm">
          <Video className="mr-2 h-4 w-4" /> Preview
        </Button>
        <div className="space-x-2">
          <Button variant="outline" size="sm" asChild>
            <Link href={`/admin/videos/${video.id}`}>
              <Edit className="mr-2 h-4 w-4" /> Edit
            </Link>
          </Button>
          <Button variant="destructive" size="sm">
            <Trash2 className="mr-2 h-4 w-4" /> Delete
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}

