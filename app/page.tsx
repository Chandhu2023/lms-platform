import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { ModeToggle } from "@/components/mode-toggle"
import { GraduationCap, BookOpen, Users, BarChart3 } from "lucide-react"

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b">
        <div className="container mx-auto py-4 px-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">LMS Platform</h1>
          <div className="flex items-center gap-4">
            <ModeToggle />
            <Button asChild>
              <Link href="/login">Login</Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <section className="py-12 px-4">
          <div className="container mx-auto text-center">
            <h2 className="text-4xl font-bold mb-4">Welcome to our Learning Management System</h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              A comprehensive platform for admins, trainers, and students to manage courses, videos, and learning
              materials.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button asChild size="lg">
                <Link href="/login">Get Started</Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link href="/about">Learn More</Link>
              </Button>
            </div>
          </div>
        </section>

        <section className="py-12 px-4 bg-muted">
          <div className="container mx-auto">
            <h2 className="text-3xl font-bold mb-8 text-center">Key Features</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader>
                  <GraduationCap className="h-8 w-8 mb-2 text-primary" />
                  <CardTitle>Course Management</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>Create, edit, and manage courses with ease. Upload videos and learning materials.</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <BookOpen className="h-8 w-8 mb-2 text-primary" />
                  <CardTitle>Video Integration</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>Embed videos from Vimeo, Zoom recordings, and other platforms directly into courses.</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <Users className="h-8 w-8 mb-2 text-primary" />
                  <CardTitle>User Management</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>Manage admins, trainers, and students with role-based access control.</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <BarChart3 className="h-8 w-8 mb-2 text-primary" />
                  <CardTitle>Analytics Dashboard</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>Track course progress, student engagement, and financial metrics with visual reports.</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t py-6 px-4">
        <div className="container mx-auto text-center text-muted-foreground">
          <p>© {new Date().getFullYear()} LMS Platform. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}

