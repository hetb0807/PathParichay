"use client"

import { useState, useMemo } from "react"
import { SidebarNav } from "@/components/sidebar-nav"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  DollarSign,
  Calendar,
  Users,
  AlertCircle,
  CheckCircle,
  Clock,
  Filter,
  Bell,
  ExternalLink,
  Download,
  TrendingUp,
  Award,
} from "lucide-react"

interface Scholarship {
  id: string
  name: string
  provider: string
  amount: string
  type: "merit" | "need" | "minority" | "sports" | "arts" | "research"
  eligibility: {
    category?: string[]
    income?: number
    percentage?: number
    course?: string[]
    gender?: string
    state?: string[]
  }
  deadline: Date
  description: string
  benefits: string[]
  documents: string[]
  applicationLink: string
  isActive: boolean
  totalApplicants?: number
  successRate?: number
}

interface StudentProfile {
  category: string
  income: number
  percentage: number
  course: string
  gender: string
  state: string
  interests: string[]
}

const scholarships: Scholarship[] = [
  {
    id: "merit-2024",
    name: "J&K Merit Scholarship 2024",
    provider: "Government of Jammu & Kashmir",
    amount: "₹50,000 per year",
    type: "merit",
    eligibility: {
      percentage: 85,
      state: ["Jammu & Kashmir"],
    },
    deadline: new Date("2024-12-31"),
    description: "Merit-based scholarship for top performing students in J&K pursuing higher education",
    benefits: ["Tuition fee coverage", "Monthly stipend", "Book allowance"],
    documents: ["Mark sheets", "Income certificate", "Domicile certificate"],
    applicationLink: "https://jkscholarships.gov.in/merit2024",
    isActive: true,
    totalApplicants: 15000,
    successRate: 12,
  },
  {
    id: "minority-scholarship",
    name: "Minority Community Scholarship",
    provider: "Ministry of Minority Affairs",
    amount: "₹30,000 per year",
    type: "minority",
    eligibility: {
      category: ["Muslim", "Christian", "Sikh", "Buddhist", "Jain", "Parsi"],
      income: 200000,
      percentage: 50,
    },
    deadline: new Date("2024-11-30"),
    description: "Financial assistance for students from minority communities",
    benefits: ["Tuition support", "Maintenance allowance", "Book grant"],
    documents: ["Community certificate", "Income proof", "Academic records"],
    applicationLink: "https://scholarships.gov.in/minority",
    isActive: true,
    totalApplicants: 8500,
    successRate: 25,
  },
  {
    id: "girls-education",
    name: "Beti Bachao Beti Padhao Scholarship",
    provider: "Government of India",
    amount: "₹25,000 per year",
    type: "need",
    eligibility: {
      gender: "Female",
      income: 150000,
      percentage: 60,
    },
    deadline: new Date("2024-12-15"),
    description: "Encouraging girl child education through financial support",
    benefits: ["Educational expenses", "Skill development programs", "Career guidance"],
    documents: ["Birth certificate", "Income certificate", "Academic transcripts"],
    applicationLink: "https://wcd.nic.in/bbbp-scholarship",
    isActive: true,
    totalApplicants: 12000,
    successRate: 18,
  },
  {
    id: "sports-scholarship",
    name: "Sports Excellence Scholarship",
    provider: "Sports Authority of India",
    amount: "₹40,000 per year",
    type: "sports",
    eligibility: {
      percentage: 50,
    },
    deadline: new Date("2025-01-15"),
    description: "Supporting talented athletes in their educational journey",
    benefits: ["Training support", "Equipment allowance", "Competition expenses"],
    documents: ["Sports certificates", "Performance records", "Medical fitness"],
    applicationLink: "https://sai.gov.in/sports-scholarship",
    isActive: true,
    totalApplicants: 3500,
    successRate: 35,
  },
  {
    id: "research-fellowship",
    name: "Young Researcher Fellowship",
    provider: "Department of Science & Technology",
    amount: "₹75,000 per year",
    type: "research",
    eligibility: {
      percentage: 75,
      course: ["Engineering", "Science", "Technology"],
    },
    deadline: new Date("2024-11-20"),
    description: "Promoting research and innovation among young minds",
    benefits: ["Research grant", "Mentorship program", "Publication support"],
    documents: ["Research proposal", "Academic records", "Recommendation letters"],
    applicationLink: "https://dst.gov.in/young-researcher",
    isActive: true,
    totalApplicants: 2800,
    successRate: 15,
  },
  {
    id: "arts-scholarship",
    name: "Cultural Heritage Scholarship",
    provider: "Ministry of Culture",
    amount: "₹35,000 per year",
    type: "arts",
    eligibility: {
      percentage: 55,
      course: ["Arts", "Fine Arts", "Music", "Dance"],
    },
    deadline: new Date("2024-12-10"),
    description: "Preserving and promoting Indian cultural heritage through education",
    benefits: ["Training programs", "Performance opportunities", "Cultural exchange"],
    documents: ["Portfolio", "Performance videos", "Academic certificates"],
    applicationLink: "https://indiaculture.nic.in/scholarship",
    isActive: true,
    totalApplicants: 4200,
    successRate: 22,
  },
]

export default function ScholarshipsPage() {
  const [studentProfile, setStudentProfile] = useState<StudentProfile>({
    category: "",
    income: 0,
    percentage: 0,
    course: "",
    gender: "",
    state: "Jammu & Kashmir",
    interests: [],
  })
  const [selectedTypes, setSelectedTypes] = useState<string[]>([])
  const [showMatched, setShowMatched] = useState(false)
  const [notifications, setNotifications] = useState<string[]>([])

  // Calculate scholarship match percentage
  const calculateMatch = (scholarship: Scholarship): number => {
    let score = 0
    let maxScore = 0

    // Category match
    if (scholarship.eligibility.category) {
      maxScore += 20
      if (scholarship.eligibility.category.includes(studentProfile.category)) {
        score += 20
      }
    }

    // Income eligibility
    if (scholarship.eligibility.income) {
      maxScore += 25
      if (studentProfile.income <= scholarship.eligibility.income) {
        score += 25
      }
    }

    // Academic performance
    if (scholarship.eligibility.percentage) {
      maxScore += 25
      if (studentProfile.percentage >= scholarship.eligibility.percentage) {
        score += 25
      } else if (studentProfile.percentage >= scholarship.eligibility.percentage - 5) {
        score += 15 // Partial match for close scores
      }
    }

    // Course match
    if (scholarship.eligibility.course) {
      maxScore += 15
      if (scholarship.eligibility.course.includes(studentProfile.course)) {
        score += 15
      }
    }

    // Gender match
    if (scholarship.eligibility.gender) {
      maxScore += 10
      if (scholarship.eligibility.gender === studentProfile.gender) {
        score += 10
      }
    }

    // State match
    if (scholarship.eligibility.state) {
      maxScore += 5
      if (scholarship.eligibility.state.includes(studentProfile.state)) {
        score += 5
      }
    }

    return maxScore > 0 ? Math.round((score / maxScore) * 100) : 0
  }

  // Filter and sort scholarships
  const filteredScholarships = useMemo(() => {
    const filtered = scholarships.filter((scholarship) => {
      if (!scholarship.isActive) return false
      if (selectedTypes.length > 0 && !selectedTypes.includes(scholarship.type)) return false
      if (showMatched) {
        const match = calculateMatch(scholarship)
        return match >= 60 // Show only high matches
      }
      return true
    })

    // Sort by match percentage and deadline
    return filtered.sort((a, b) => {
      const matchA = calculateMatch(a)
      const matchB = calculateMatch(b)
      if (matchA !== matchB) return matchB - matchA
      return a.deadline.getTime() - b.deadline.getTime()
    })
  }, [studentProfile, selectedTypes, showMatched])

  const getMatchColor = (percentage: number) => {
    if (percentage >= 80) return "text-green-600"
    if (percentage >= 60) return "text-yellow-600"
    if (percentage >= 40) return "text-orange-600"
    return "text-red-600"
  }

  const getMatchBadge = (percentage: number) => {
    if (percentage >= 80) return { text: "Excellent Match", color: "bg-green-500" }
    if (percentage >= 60) return { text: "Good Match", color: "bg-yellow-500" }
    if (percentage >= 40) return { text: "Fair Match", color: "bg-orange-500" }
    return { text: "Low Match", color: "bg-red-500" }
  }

  const getDaysUntilDeadline = (deadline: Date) => {
    const today = new Date()
    const diffTime = deadline.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  const toggleNotification = (scholarshipId: string) => {
    setNotifications((prev) =>
      prev.includes(scholarshipId) ? prev.filter((id) => id !== scholarshipId) : [...prev, scholarshipId],
    )
  }

  const exportMatches = () => {
    const matchedScholarships = filteredScholarships
      .filter((s) => calculateMatch(s) >= 60)
      .map((s) => ({
        name: s.name,
        provider: s.provider,
        amount: s.amount,
        deadline: s.deadline.toLocaleDateString(),
        match: calculateMatch(s) + "%",
        link: s.applicationLink,
      }))

    const csvContent = [
      "Name,Provider,Amount,Deadline,Match,Application Link",
      ...matchedScholarships.map(
        (s) => `"${s.name}","${s.provider}","${s.amount}","${s.deadline}","${s.match}","${s.link}"`,
      ),
    ].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "scholarship-matches.csv"
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="min-h-screen bg-background">
      <SidebarNav />
      <main className="md:ml-64 p-6">
        <div className="max-w-7xl mx-auto mt-12 md:mt-0">
          {/* Header */}
          <div className="mb-8">
            <h1 className="font-playfair text-4xl font-bold text-foreground mb-2">Scholarship Matchmaker</h1>
            <p className="text-muted-foreground text-lg">
              AI-powered scholarship matching based on your profile and eligibility
            </p>
          </div>

          <div className="grid lg:grid-cols-4 gap-6">
            {/* Profile Setup */}
            <div className="lg:col-span-1">
              <Card className="sticky top-6">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-primary" />
                    Your Profile
                  </CardTitle>
                  <CardDescription>Complete your profile for better matches</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Category</label>
                    <Select
                      value={studentProfile.category}
                      onValueChange={(value) => setStudentProfile((prev) => ({ ...prev, category: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="General">General</SelectItem>
                        <SelectItem value="OBC">OBC</SelectItem>
                        <SelectItem value="SC">SC</SelectItem>
                        <SelectItem value="ST">ST</SelectItem>
                        <SelectItem value="Muslim">Muslim</SelectItem>
                        <SelectItem value="Christian">Christian</SelectItem>
                        <SelectItem value="Sikh">Sikh</SelectItem>
                        <SelectItem value="Buddhist">Buddhist</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Annual Family Income</label>
                    <Input
                      type="number"
                      placeholder="Enter income in ₹"
                      value={studentProfile.income || ""}
                      onChange={(e) =>
                        setStudentProfile((prev) => ({ ...prev, income: Number.parseInt(e.target.value) || 0 }))
                      }
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Academic Percentage</label>
                    <Input
                      type="number"
                      placeholder="Enter percentage"
                      max="100"
                      value={studentProfile.percentage || ""}
                      onChange={(e) =>
                        setStudentProfile((prev) => ({ ...prev, percentage: Number.parseInt(e.target.value) || 0 }))
                      }
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Course/Stream</label>
                    <Select
                      value={studentProfile.course}
                      onValueChange={(value) => setStudentProfile((prev) => ({ ...prev, course: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select course" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Engineering">Engineering</SelectItem>
                        <SelectItem value="Medical">Medical</SelectItem>
                        <SelectItem value="Arts">Arts</SelectItem>
                        <SelectItem value="Commerce">Commerce</SelectItem>
                        <SelectItem value="Science">Science</SelectItem>
                        <SelectItem value="Technology">Technology</SelectItem>
                        <SelectItem value="Fine Arts">Fine Arts</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Gender</label>
                    <Select
                      value={studentProfile.gender}
                      onValueChange={(value) => setStudentProfile((prev) => ({ ...prev, gender: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Male">Male</SelectItem>
                        <SelectItem value="Female">Female</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Filters */}
                  <div className="pt-4 border-t">
                    <div className="flex items-center gap-2 mb-3">
                      <Filter className="h-4 w-4 text-primary" />
                      <label className="text-sm font-medium">Scholarship Types</label>
                    </div>
                    <div className="space-y-2">
                      {["merit", "need", "minority", "sports", "arts", "research"].map((type) => (
                        <div key={type} className="flex items-center space-x-2">
                          <Checkbox
                            id={type}
                            checked={selectedTypes.includes(type)}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                setSelectedTypes((prev) => [...prev, type])
                              } else {
                                setSelectedTypes((prev) => prev.filter((t) => t !== type))
                              }
                            }}
                          />
                          <label htmlFor={type} className="text-sm capitalize cursor-pointer">
                            {type}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-4 border-t">
                    <div className="flex items-center space-x-2 mb-3">
                      <Checkbox
                        id="show-matched"
                        checked={showMatched}
                        onCheckedChange={(checked) => setShowMatched(checked as boolean)}
                      />
                      <label htmlFor="show-matched" className="text-sm cursor-pointer">
                        Show only high matches (60%+)
                      </label>
                    </div>
                    <Button onClick={exportMatches} variant="outline" className="w-full bg-transparent">
                      <Download className="h-4 w-4 mr-2" />
                      Export Matches
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Scholarships List */}
            <div className="lg:col-span-3">
              <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                  <p className="text-sm text-muted-foreground">
                    Found {filteredScholarships.length} scholarships
                    {showMatched && " with high match"}
                  </p>
                  <div className="flex gap-2">
                    <Badge variant="secondary">
                      <Bell className="h-3 w-3 mr-1" />
                      {notifications.length} alerts set
                    </Badge>
                  </div>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2">
                        <Award className="h-4 w-4 text-primary" />
                        <span className="text-sm text-muted-foreground">High Matches</span>
                      </div>
                      <p className="text-2xl font-bold">
                        {filteredScholarships.filter((s) => calculateMatch(s) >= 80).length}
                      </p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-primary" />
                        <span className="text-sm text-muted-foreground">Urgent Deadlines</span>
                      </div>
                      <p className="text-2xl font-bold">
                        {filteredScholarships.filter((s) => getDaysUntilDeadline(s.deadline) <= 7).length}
                      </p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2">
                        <DollarSign className="h-4 w-4 text-primary" />
                        <span className="text-sm text-muted-foreground">Total Value</span>
                      </div>
                      <p className="text-2xl font-bold">₹12L+</p>
                    </CardContent>
                  </Card>
                </div>
              </div>

              <div className="space-y-4">
                {filteredScholarships.map((scholarship) => {
                  const matchPercentage = calculateMatch(scholarship)
                  const matchBadge = getMatchBadge(matchPercentage)
                  const daysLeft = getDaysUntilDeadline(scholarship.deadline)
                  const isNotificationSet = notifications.includes(scholarship.id)

                  return (
                    <Card key={scholarship.id} className="hover:shadow-lg transition-shadow">
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <CardTitle className="text-xl">{scholarship.name}</CardTitle>
                              <Badge className={`${matchBadge.color} text-white`}>{matchBadge.text}</Badge>
                            </div>
                            <CardDescription className="text-base">{scholarship.provider}</CardDescription>
                          </div>
                          <div className="text-right">
                            <div className="text-2xl font-bold text-primary mb-1">{scholarship.amount}</div>
                            <Badge
                              variant={daysLeft <= 7 ? "destructive" : daysLeft <= 30 ? "default" : "secondary"}
                              className="text-xs"
                            >
                              <Calendar className="h-3 w-3 mr-1" />
                              {daysLeft > 0 ? `${daysLeft} days left` : "Expired"}
                            </Badge>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <Tabs defaultValue="overview" className="w-full">
                          <TabsList className="grid w-full grid-cols-4">
                            <TabsTrigger value="overview">Overview</TabsTrigger>
                            <TabsTrigger value="eligibility">Eligibility</TabsTrigger>
                            <TabsTrigger value="benefits">Benefits</TabsTrigger>
                            <TabsTrigger value="documents">Documents</TabsTrigger>
                          </TabsList>

                          <TabsContent value="overview" className="mt-4">
                            <div className="space-y-4">
                              <p className="text-sm text-muted-foreground">{scholarship.description}</p>

                              <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                                <div>
                                  <span className="text-sm font-medium">Match Score</span>
                                  <div className="flex items-center gap-2 mt-1">
                                    <Progress value={matchPercentage} className="w-24 h-2" />
                                    <span className={`text-sm font-bold ${getMatchColor(matchPercentage)}`}>
                                      {matchPercentage}%
                                    </span>
                                  </div>
                                </div>
                                <div className="text-right">
                                  <div className="text-sm text-muted-foreground">Success Rate</div>
                                  <div className="font-semibold">{scholarship.successRate}%</div>
                                </div>
                              </div>

                              {scholarship.totalApplicants && (
                                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                  <div className="flex items-center gap-1">
                                    <Users className="h-4 w-4" />
                                    {scholarship.totalApplicants.toLocaleString()} applicants
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <TrendingUp className="h-4 w-4" />
                                    {scholarship.successRate}% success rate
                                  </div>
                                </div>
                              )}
                            </div>
                          </TabsContent>

                          <TabsContent value="eligibility" className="mt-4">
                            <div className="space-y-3">
                              {scholarship.eligibility.category && (
                                <div className="flex justify-between items-center">
                                  <span className="text-sm">Category:</span>
                                  <div className="flex gap-1">
                                    {scholarship.eligibility.category.map((cat) => (
                                      <Badge key={cat} variant="outline" className="text-xs">
                                        {cat}
                                      </Badge>
                                    ))}
                                  </div>
                                </div>
                              )}
                              {scholarship.eligibility.income && (
                                <div className="flex justify-between items-center">
                                  <span className="text-sm">Max Income:</span>
                                  <Badge variant="outline">₹{scholarship.eligibility.income.toLocaleString()}</Badge>
                                </div>
                              )}
                              {scholarship.eligibility.percentage && (
                                <div className="flex justify-between items-center">
                                  <span className="text-sm">Min Percentage:</span>
                                  <Badge variant="outline">{scholarship.eligibility.percentage}%</Badge>
                                </div>
                              )}
                              {scholarship.eligibility.course && (
                                <div className="flex justify-between items-center">
                                  <span className="text-sm">Courses:</span>
                                  <div className="flex gap-1">
                                    {scholarship.eligibility.course.map((course) => (
                                      <Badge key={course} variant="outline" className="text-xs">
                                        {course}
                                      </Badge>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          </TabsContent>

                          <TabsContent value="benefits" className="mt-4">
                            <ul className="space-y-2">
                              {scholarship.benefits.map((benefit, index) => (
                                <li key={index} className="flex items-center gap-2 text-sm">
                                  <CheckCircle className="h-4 w-4 text-green-500" />
                                  {benefit}
                                </li>
                              ))}
                            </ul>
                          </TabsContent>

                          <TabsContent value="documents" className="mt-4">
                            <ul className="space-y-2">
                              {scholarship.documents.map((doc, index) => (
                                <li key={index} className="flex items-center gap-2 text-sm">
                                  <AlertCircle className="h-4 w-4 text-orange-500" />
                                  {doc}
                                </li>
                              ))}
                            </ul>
                          </TabsContent>
                        </Tabs>

                        <div className="mt-6 flex gap-3">
                          <Button asChild className="flex-1">
                            <a href={scholarship.applicationLink} target="_blank" rel="noopener noreferrer">
                              <ExternalLink className="h-4 w-4 mr-2" />
                              Apply Now
                            </a>
                          </Button>
                          <Button
                            variant="outline"
                            onClick={() => toggleNotification(scholarship.id)}
                            className={`bg-transparent ${isNotificationSet ? "border-primary text-primary" : ""}`}
                          >
                            <Bell className={`h-4 w-4 mr-2 ${isNotificationSet ? "fill-current" : ""}`} />
                            {isNotificationSet ? "Alert Set" : "Set Alert"}
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
