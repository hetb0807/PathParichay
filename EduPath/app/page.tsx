"use client"
import { SidebarNav } from "@/components/sidebar-nav"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import {
  Brain,
  GraduationCap,
  MessageSquare,
  DollarSign,
  Users,
  BarChart3,
  ArrowRight,
  Star,
  TrendingUp,
  Clock,
} from "lucide-react"

const quickActions = [
  {
    title: "Take Aptitude Quiz",
    description: "Discover your strengths and interests",
    icon: Brain,
    href: "/quiz",
    color: "bg-blue-500",
    time: "10 min",
  },
  {
    title: "Explore Careers",
    description: "AI-powered career roadmaps",
    icon: BarChart3,
    href: "/roadmap",
    color: "bg-green-500",
    time: "5 min",
  },
  {
    title: "Find Colleges",
    description: "Government colleges near you",
    icon: GraduationCap,
    href: "/colleges",
    color: "bg-purple-500",
    time: "3 min",
  },
  {
    title: "Chat with AI Mentor",
    description: "Get personalized guidance",
    icon: MessageSquare,
    href: "/mentor",
    color: "bg-orange-500",
    time: "Live",
  },
]

const stats = [
  { label: "Students Guided", value: "25,000+", icon: Users },
  { label: "Career Paths", value: "150+", icon: BarChart3 },
  { label: "Government Colleges", value: "500+", icon: GraduationCap },
  { label: "Success Rate", value: "94%", icon: TrendingUp },
]

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <SidebarNav />

      <main className="md:ml-64 p-6">
        {/* Header */}
        <div className="mb-8 mt-12 md:mt-0">
          <h1 className="font-playfair text-4xl font-bold text-foreground mb-2">Welcome to Career Compass</h1>
          <p className="text-muted-foreground text-lg">Your personalized journey to the perfect career starts here</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, index) => (
            <Card key={index} className="animate-fade-in-up" style={{ animationDelay: `${index * 100}ms` }}>
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <stat.icon className="h-4 w-4 text-primary" />
                  <span className="text-sm text-muted-foreground">{stat.label}</span>
                </div>
                <p className="text-2xl font-bold text-foreground">{stat.value}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="font-playfair text-2xl font-semibold mb-4 text-foreground">Quick Actions</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickActions.map((action, index) => (
              <Link key={index} href={action.href}>
                <Card
                  className="group hover:shadow-lg transition-all duration-300 cursor-pointer animate-fade-in-up border-border hover:border-primary/50"
                  style={{ animationDelay: `${index * 150}ms` }}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between mb-2">
                      <div className={`w-10 h-10 rounded-lg ${action.color} flex items-center justify-center`}>
                        <action.icon className="h-5 w-5 text-white" />
                      </div>
                      <Badge variant="secondary" className="text-xs">
                        <Clock className="h-3 w-3 mr-1" />
                        {action.time}
                      </Badge>
                    </div>
                    <CardTitle className="text-lg group-hover:text-primary transition-colors">{action.title}</CardTitle>
                    <CardDescription>{action.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <Button
                      variant="ghost"
                      className="w-full justify-between group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
                    >
                      Get Started
                      <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>

        {/* Featured Section */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <Card className="animate-fade-in-left">
            <CardHeader>
              <div className="flex items-center gap-2 mb-2">
                <Star className="h-5 w-5 text-yellow-500" />
                <CardTitle className="text-xl">Featured: Engineering Careers</CardTitle>
              </div>
              <CardDescription>Explore the most in-demand engineering fields in J&K</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
                  <span className="font-medium">Computer Science</span>
                  <Badge>High Demand</Badge>
                </div>
                <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
                  <span className="font-medium">Civil Engineering</span>
                  <Badge variant="secondary">Growing</Badge>
                </div>
                <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
                  <span className="font-medium">Electrical Engineering</span>
                  <Badge>Stable</Badge>
                </div>
              </div>
              <Link href="/roadmap">
                <Button
                  className="w-full mt-4 hover:bg-primary hover:text-primary-foreground transition-all duration-200 group bg-transparent"
                  variant="outline"
                >
                  Explore All Fields
                  <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="animate-fade-in-right">
            <CardHeader>
              <div className="flex items-center gap-2 mb-2">
                <DollarSign className="h-5 w-5 text-green-500" />
                <CardTitle className="text-xl">Scholarship Alerts</CardTitle>
              </div>
              <CardDescription>Don't miss out on financial aid opportunities</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="p-3 border border-green-200 bg-green-50 dark:bg-green-950 dark:border-green-800 rounded-lg">
                  <div className="flex justify-between items-start mb-1">
                    <span className="font-medium text-sm text-green-800 dark:text-green-200">
                      Merit Scholarship 2024
                    </span>
                    <Badge variant="destructive" className="text-xs">
                      3 days left
                    </Badge>
                  </div>
                  <p className="text-xs text-green-800 dark:text-green-200">Up to ₹50,000 for top performers</p>
                </div>
                <div className="p-3 border border-blue-200 bg-blue-50 dark:bg-blue-950 dark:border-blue-800 rounded-lg">
                  <div className="flex justify-between items-start mb-1">
                    <span className="font-medium text-sm text-blue-800 dark:text-blue-200">Minority Scholarship</span>
                    <Badge className="text-xs">Open</Badge>
                  </div>
                  <p className="text-xs text-blue-800 dark:text-blue-200">Financial aid for minority students</p>
                </div>
              </div>
              <Link href="/scholarships">
                <Button
                  className="w-full mt-4 hover:bg-primary hover:text-primary-foreground transition-all duration-200 group bg-transparent"
                  variant="outline"
                >
                  View All Scholarships
                  <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Take Action Now Section */}
        <div className="mb-8">
          <h2 className="font-playfair text-2xl font-semibold mb-4 text-foreground">Take Action Now</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <Link href="/colleges">
              <Card className="group hover:shadow-xl transition-all duration-500 cursor-pointer animate-fade-in-up hover:scale-105 transform">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center group-hover:rotate-12 transition-transform duration-300">
                      <GraduationCap className="h-6 w-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">
                        Find Relevant Courses
                      </h3>
                      <p className="text-sm text-muted-foreground">Discover courses that match your interests</p>
                    </div>
                    <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-2 transition-all duration-300" />
                  </div>
                </CardContent>
              </Card>
            </Link>

            <Link href="/mentor">
              <Card
                className="group hover:shadow-xl transition-all duration-500 cursor-pointer animate-fade-in-up hover:scale-105 transform"
                style={{ animationDelay: "150ms" }}
              >
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-r from-orange-500 to-red-500 flex items-center justify-center group-hover:rotate-12 transition-transform duration-300">
                      <MessageSquare className="h-6 w-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">
                        Connect with Mentor
                      </h3>
                      <p className="text-sm text-muted-foreground">Get personalized career guidance</p>
                    </div>
                    <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-2 transition-all duration-300" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}
