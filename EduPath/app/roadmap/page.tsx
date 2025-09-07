"use client"

import { useState } from "react"
import { SidebarNav } from "@/components/sidebar-nav"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  BarChart3,
  BookOpen,
  Briefcase,
  CheckCircle,
  Clock,
  GraduationCap,
  MapPin,
  Star,
  Target,
  TrendingUp,
  Users,
  Zap,
} from "lucide-react"

interface RoadmapStep {
  id: number
  title: string
  description: string
  duration: string
  type: "education" | "skill" | "experience" | "certification"
  status: "completed" | "current" | "upcoming"
  requirements?: string[]
  outcomes?: string[]
}

interface CareerPath {
  id: string
  title: string
  description: string
  averageSalary: string
  demandLevel: "high" | "medium" | "low"
  growthRate: string
  steps: RoadmapStep[]
  skills: string[]
  colleges: string[]
}

const careerPaths: Record<string, CareerPath> = {
  "software-engineer": {
    id: "software-engineer",
    title: "Software Engineer",
    description: "Design and develop software applications and systems",
    averageSalary: "₹6-15 LPA",
    demandLevel: "high",
    growthRate: "+22%",
    skills: ["Programming", "Problem Solving", "System Design", "Database Management"],
    colleges: ["NIT Srinagar", "IIIT Jammu", "Government College of Engineering"],
    steps: [
      {
        id: 1,
        title: "Complete Class 12 (PCM)",
        description: "Focus on Mathematics, Physics, and Computer Science",
        duration: "2 years",
        type: "education",
        status: "completed",
        requirements: ["Strong math foundation", "Basic programming knowledge"],
        outcomes: ["JEE eligibility", "Engineering entrance readiness"],
      },
      {
        id: 2,
        title: "Engineering Entrance Exams",
        description: "Prepare for JEE Main, JEE Advanced, and state-level exams",
        duration: "6 months",
        type: "certification",
        status: "current",
        requirements: ["Class 12 completion", "Strong PCM concepts"],
        outcomes: ["Engineering college admission", "Scholarship opportunities"],
      },
      {
        id: 3,
        title: "B.Tech in Computer Science",
        description: "Complete undergraduate degree in Computer Science Engineering",
        duration: "4 years",
        type: "education",
        status: "upcoming",
        requirements: ["Engineering entrance exam clearance"],
        outcomes: ["Technical expertise", "Industry connections", "Placement opportunities"],
      },
      {
        id: 4,
        title: "Internships & Projects",
        description: "Gain practical experience through internships and personal projects",
        duration: "Ongoing",
        type: "experience",
        status: "upcoming",
        requirements: ["Programming skills", "Academic progress"],
        outcomes: ["Real-world experience", "Portfolio development", "Industry exposure"],
      },
      {
        id: 5,
        title: "Professional Certifications",
        description: "Obtain industry-recognized certifications in specialized technologies",
        duration: "6-12 months",
        type: "certification",
        status: "upcoming",
        requirements: ["Basic programming knowledge", "Domain interest"],
        outcomes: ["Specialized skills", "Career advancement", "Higher salary potential"],
      },
    ],
  },
  "civil-engineer": {
    id: "civil-engineer",
    title: "Civil Engineer",
    description: "Design and oversee construction of infrastructure projects",
    averageSalary: "₹4-10 LPA",
    demandLevel: "medium",
    growthRate: "+8%",
    skills: ["Structural Design", "Project Management", "AutoCAD", "Construction Planning"],
    colleges: ["NIT Srinagar", "Government College of Engineering", "SSM College of Engineering"],
    steps: [
      {
        id: 1,
        title: "Complete Class 12 (PCM)",
        description: "Strong foundation in Physics, Chemistry, and Mathematics",
        duration: "2 years",
        type: "education",
        status: "completed",
        requirements: ["Good mathematical skills", "Understanding of physics concepts"],
        outcomes: ["Engineering entrance eligibility", "Strong analytical foundation"],
      },
      {
        id: 2,
        title: "Engineering Entrance Preparation",
        description: "Prepare for JEE and state engineering entrance exams",
        duration: "6 months",
        type: "certification",
        status: "current",
        requirements: ["Class 12 completion", "PCM proficiency"],
        outcomes: ["Engineering college admission", "Merit-based scholarships"],
      },
      {
        id: 3,
        title: "B.Tech in Civil Engineering",
        description: "Complete undergraduate degree in Civil Engineering",
        duration: "4 years",
        type: "education",
        status: "upcoming",
        requirements: ["Engineering entrance exam success"],
        outcomes: ["Technical knowledge", "Design skills", "Industry readiness"],
      },
      {
        id: 4,
        title: "Site Experience & Training",
        description: "Gain hands-on experience at construction sites and projects",
        duration: "1-2 years",
        type: "experience",
        status: "upcoming",
        requirements: ["Engineering degree", "Safety training"],
        outcomes: ["Practical skills", "Project management experience", "Industry connections"],
      },
      {
        id: 5,
        title: "Professional License",
        description: "Obtain professional engineering license and certifications",
        duration: "6 months",
        type: "certification",
        status: "upcoming",
        requirements: ["Work experience", "Professional exam"],
        outcomes: ["Legal practice authority", "Career advancement", "Higher responsibilities"],
      },
    ],
  },
  doctor: {
    id: "doctor",
    title: "Medical Doctor",
    description: "Diagnose and treat patients, promote health and wellness",
    averageSalary: "₹8-25 LPA",
    demandLevel: "high",
    growthRate: "+15%",
    skills: ["Medical Knowledge", "Patient Care", "Diagnosis", "Communication"],
    colleges: ["Government Medical College Srinagar", "Government Medical College Jammu"],
    steps: [
      {
        id: 1,
        title: "Complete Class 12 (PCB)",
        description: "Excel in Physics, Chemistry, and Biology",
        duration: "2 years",
        type: "education",
        status: "completed",
        requirements: ["Strong science foundation", "High academic performance"],
        outcomes: ["NEET eligibility", "Medical entrance readiness"],
      },
      {
        id: 2,
        title: "NEET Preparation & Exam",
        description: "Prepare for and clear the National Eligibility Entrance Test",
        duration: "1 year",
        type: "certification",
        status: "current",
        requirements: ["Class 12 PCB completion", "Dedicated study"],
        outcomes: ["Medical college admission", "Government seat allocation"],
      },
      {
        id: 3,
        title: "MBBS Degree",
        description: "Complete Bachelor of Medicine and Bachelor of Surgery",
        duration: "5.5 years",
        type: "education",
        status: "upcoming",
        requirements: ["NEET qualification", "Medical college admission"],
        outcomes: ["Medical degree", "Clinical knowledge", "Patient care skills"],
      },
      {
        id: 4,
        title: "Internship",
        description: "Complete mandatory rotating internship in various departments",
        duration: "1 year",
        type: "experience",
        status: "upcoming",
        requirements: ["MBBS completion", "Medical council registration"],
        outcomes: ["Practical experience", "Specialization exposure", "Professional network"],
      },
      {
        id: 5,
        title: "Specialization (Optional)",
        description: "Pursue MD/MS in chosen medical specialty",
        duration: "3 years",
        type: "education",
        status: "upcoming",
        requirements: ["MBBS degree", "NEET PG qualification"],
        outcomes: ["Specialist expertise", "Higher earning potential", "Advanced career opportunities"],
      },
    ],
  },
}

const typeIcons = {
  education: GraduationCap,
  skill: Zap,
  experience: Briefcase,
  certification: Star,
}

const statusColors = {
  completed: "bg-green-500",
  current: "bg-blue-500",
  upcoming: "bg-gray-400",
}

export default function RoadmapPage() {
  const [selectedCareer, setSelectedCareer] = useState<string>("software-engineer")
  const [selectedStep, setSelectedStep] = useState<number | null>(null)

  const currentPath = careerPaths[selectedCareer]

  const getDemandColor = (level: string) => {
    switch (level) {
      case "high":
        return "bg-green-500"
      case "medium":
        return "bg-yellow-500"
      case "low":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <SidebarNav />
      <main className="md:ml-64 p-6">
        <div className="max-w-6xl mx-auto mt-12 md:mt-0">
          {/* Header */}
          <div className="mb-8">
            <h1 className="font-playfair text-4xl font-bold text-foreground mb-2">AI Career Roadmap</h1>
            <p className="text-muted-foreground text-lg">
              Personalized step-by-step guidance to achieve your career goals
            </p>
          </div>

          {/* Career Selection */}
          <div className="mb-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-primary" />
                  Select Your Career Path
                </CardTitle>
                <CardDescription>Choose a career to see your personalized roadmap</CardDescription>
              </CardHeader>
              <CardContent>
                <Select value={selectedCareer} onValueChange={setSelectedCareer}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Choose a career path" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.values(careerPaths).map((path) => (
                      <SelectItem key={path.id} value={path.id}>
                        {path.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>
          </div>

          {/* Career Overview */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <Card className="animate-fade-in-up">
              <CardHeader className="pb-3">
                <CardTitle className="text-xl">{currentPath.title}</CardTitle>
                <CardDescription>{currentPath.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Average Salary</span>
                    <Badge variant="secondary" className="font-semibold">
                      {currentPath.averageSalary}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Demand Level</span>
                    <Badge className={`${getDemandColor(currentPath.demandLevel)} text-white capitalize`}>
                      {currentPath.demandLevel}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Growth Rate</span>
                    <Badge variant="outline" className="text-green-600 border-green-600">
                      <TrendingUp className="h-3 w-3 mr-1" />
                      {currentPath.growthRate}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="animate-fade-in-up" style={{ animationDelay: "100ms" }}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-primary" />
                  Key Skills
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {currentPath.skills.map((skill, index) => (
                    <Badge key={index} variant="secondary">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="animate-fade-in-up" style={{ animationDelay: "200ms" }}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-primary" />
                  Top Colleges in J&K
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {currentPath.colleges.map((college, index) => (
                    <div key={index} className="text-sm p-2 bg-muted rounded">
                      {college}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Roadmap Timeline */}
          <Card className="animate-fade-in-up">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-primary" />
                Your Career Roadmap
              </CardTitle>
              <CardDescription>Follow these steps to achieve your career goals</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {currentPath.steps.map((step, index) => {
                  const Icon = typeIcons[step.type]
                  const isSelected = selectedStep === step.id

                  return (
                    <div key={step.id} className="relative">
                      {/* Timeline line */}
                      {index < currentPath.steps.length - 1 && (
                        <div className="absolute left-6 top-12 w-0.5 h-16 bg-border" />
                      )}

                      <div
                        className={`flex gap-4 p-4 rounded-lg border transition-all cursor-pointer ${
                          isSelected ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
                        }`}
                        onClick={() => setSelectedStep(isSelected ? null : step.id)}
                      >
                        {/* Step indicator */}
                        <div
                          className={`w-12 h-12 rounded-full flex items-center justify-center ${statusColors[step.status]}`}
                        >
                          <Icon className="h-6 w-6 text-white" />
                        </div>

                        {/* Step content */}
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="font-semibold text-lg">{step.title}</h3>
                            <div className="flex items-center gap-2">
                              <Badge variant="outline" className="text-xs">
                                <Clock className="h-3 w-3 mr-1" />
                                {step.duration}
                              </Badge>
                              <Badge
                                className={`text-xs capitalize ${
                                  step.status === "completed"
                                    ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                                    : step.status === "current"
                                      ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                                      : "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200"
                                }`}
                              >
                                {step.status}
                              </Badge>
                            </div>
                          </div>
                          <p className="text-muted-foreground mb-3">{step.description}</p>

                          {/* Expanded details */}
                          {isSelected && (
                            <div className="mt-4 space-y-4 animate-fade-in-up">
                              {step.requirements && (
                                <div>
                                  <h4 className="font-medium mb-2 text-sm">Requirements:</h4>
                                  <ul className="space-y-1">
                                    {step.requirements.map((req, idx) => (
                                      <li key={idx} className="text-sm text-muted-foreground flex items-center gap-2">
                                        <CheckCircle className="h-3 w-3 text-green-500" />
                                        {req}
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                              {step.outcomes && (
                                <div>
                                  <h4 className="font-medium mb-2 text-sm">Expected Outcomes:</h4>
                                  <ul className="space-y-1">
                                    {step.outcomes.map((outcome, idx) => (
                                      <li key={idx} className="text-sm text-muted-foreground flex items-center gap-2">
                                        <Star className="h-3 w-3 text-yellow-500" />
                                        {outcome}
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>

              <div className="mt-8 flex gap-4">
                <Button className="flex-1">
                  <BookOpen className="h-4 w-4 mr-2" />
                  Find Relevant Courses
                </Button>
                <Button variant="outline" className="flex-1 bg-transparent">
                  <Users className="h-4 w-4 mr-2" />
                  Connect with Mentors
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
