"use client"

import { useEffect, useState } from "react"
import { SidebarNav } from "@/components/sidebar-nav"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  ArrowLeft,
  TrendingUp,
  Users,
  DollarSign,
  Calendar,
  MapPin,
  Star,
  Building,
  GraduationCap,
  Briefcase,
  Target,
  Award,
} from "lucide-react"
import Link from "next/link"

interface College {
  id: string
  name: string
  location: string
  district: string
  type: "government" | "private" | "autonomous"
  established: number
  courses: Course[]
  facilities: string[]
  contact: {
    phone: string
    email: string
    website: string
  }
  rating: number
  totalSeats: number
  hostelAvailable: boolean
}

interface Course {
  id: string
  name: string
  duration: string
  seats: number
  cutoff2023: number
  cutoff2022: number
  fees: number
  eligibility: string
}

export default function CollegeAnalysisPage() {
  const [college, setCollege] = useState<College | null>(null)
  const [loading, setLoading] = useState(true)
  const [isSaved, setIsSaved] = useState(false)
  const [showComparison, setShowComparison] = useState(false)

  useEffect(() => {
    const storedCollege = localStorage.getItem("selectedCollegeAnalysis")
    if (storedCollege) {
      setCollege(JSON.parse(storedCollege))
    }
    const savedColleges = JSON.parse(localStorage.getItem("savedColleges") || "[]")
    if (storedCollege) {
      const college = JSON.parse(storedCollege)
      setIsSaved(savedColleges.some((saved: any) => saved.id === college.id))
    }
    setLoading(false)
  }, [])

  const handleSaveCollege = () => {
    if (!college) return

    const savedColleges = JSON.parse(localStorage.getItem("savedColleges") || "[]")

    if (isSaved) {
      const updatedSaved = savedColleges.filter((saved: any) => saved.id !== college.id)
      localStorage.setItem("savedColleges", JSON.stringify(updatedSaved))
      setIsSaved(false)
    } else {
      savedColleges.push(college)
      localStorage.setItem("savedColleges", JSON.stringify(savedColleges))
      setIsSaved(true)
    }
  }

  const handleDownloadReport = () => {
    if (!college) return

    const reportData = {
      collegeName: college.name,
      location: college.location,
      rating: college.rating,
      totalSeats: college.totalSeats,
      courses: college.courses,
      facilities: college.facilities,
      generatedAt: new Date().toISOString(),
    }

    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${college.name.replace(/\s+/g, "_")}_Analysis_Report.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <SidebarNav />
        <main className="md:ml-64 p-6">
          <div className="max-w-7xl mx-auto mt-12 md:mt-0">
            <div className="animate-pulse">
              <div className="h-8 bg-muted rounded w-1/3 mb-4"></div>
              <div className="h-4 bg-muted rounded w-2/3 mb-8"></div>
              <div className="grid gap-6">
                <div className="h-64 bg-muted rounded"></div>
                <div className="h-64 bg-muted rounded"></div>
              </div>
            </div>
          </div>
        </main>
      </div>
    )
  }

  if (!college) {
    return (
      <div className="min-h-screen bg-background">
        <SidebarNav />
        <main className="md:ml-64 p-6">
          <div className="max-w-7xl mx-auto mt-12 md:mt-0">
            <div className="text-center py-12">
              <h1 className="text-2xl font-bold mb-4">College Not Found</h1>
              <p className="text-muted-foreground mb-6">The requested college analysis could not be loaded.</p>
              <Link href="/colleges">
                <Button>
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Colleges
                </Button>
              </Link>
            </div>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <SidebarNav />
      <main className="md:ml-64 p-6">
        <div className="max-w-7xl mx-auto mt-12 md:mt-0">
          {/* Header */}
          <div className="mb-8">
            <Link href="/colleges">
              <Button variant="ghost" className="mb-4">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Colleges
              </Button>
            </Link>
            <h1 className="font-playfair text-4xl font-bold text-foreground mb-2">{college.name}</h1>
            <div className="flex items-center gap-4 text-muted-foreground">
              <div className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                {college.location}
              </div>
              <div className="flex items-center gap-1">
                <Building className="h-4 w-4" />
                Est. {college.established}
              </div>
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 text-yellow-500" />
                {college.rating}/5.0
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Main Analysis */}
            <div className="lg:col-span-2">
              <Tabs defaultValue="overview" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="courses">Courses</TabsTrigger>
                  <TabsTrigger value="placement">Placement</TabsTrigger>
                  <TabsTrigger value="trends">Trends</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="mt-6">
                  <div className="space-y-6">
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Award className="h-5 w-5 text-primary" />
                          College Highlights
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid md:grid-cols-2 gap-4">
                          <div className="space-y-3">
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Total Seats</span>
                              <span className="font-medium">{college.totalSeats}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">College Type</span>
                              <Badge className="capitalize">{college.type}</Badge>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Hostel</span>
                              <span className={college.hostelAvailable ? "text-green-600" : "text-red-600"}>
                                {college.hostelAvailable ? "Available" : "Not Available"}
                              </span>
                            </div>
                          </div>
                          <div className="space-y-3">
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Programs</span>
                              <span className="font-medium">{college.courses.length}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Facilities</span>
                              <span className="font-medium">{college.facilities.length}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Rating</span>
                              <div className="flex items-center gap-1">
                                <Star className="h-4 w-4 text-yellow-500" />
                                <span className="font-medium">{college.rating}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle>Facilities & Infrastructure</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex flex-wrap gap-2">
                          {college.facilities.map((facility, index) => (
                            <Badge key={index} variant="secondary" className="text-sm">
                              {facility}
                            </Badge>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                <TabsContent value="courses" className="mt-6">
                  <div className="space-y-4">
                    {college.courses.map((course) => (
                      <Card key={course.id}>
                        <CardHeader>
                          <CardTitle className="text-lg">{course.name}</CardTitle>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span>{course.duration}</span>
                            <span>{course.seats} seats</span>
                            <Badge variant="outline">₹{course.fees.toLocaleString()}/year</Badge>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="grid md:grid-cols-2 gap-4">
                            <div>
                              <h4 className="font-medium mb-2">Cutoff Trends</h4>
                              <div className="space-y-2">
                                <div className="flex justify-between">
                                  <span className="text-muted-foreground">2023</span>
                                  <span className="font-medium">{course.cutoff2023.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-muted-foreground">2022</span>
                                  <span className="font-medium">{course.cutoff2022.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-muted-foreground">Change</span>
                                  <span
                                    className={
                                      course.cutoff2023 < course.cutoff2022 ? "text-green-600" : "text-red-600"
                                    }
                                  >
                                    {course.cutoff2023 < course.cutoff2022 ? "↓" : "↑"}
                                    {Math.abs(course.cutoff2023 - course.cutoff2022).toLocaleString()}
                                  </span>
                                </div>
                              </div>
                            </div>
                            <div>
                              <h4 className="font-medium mb-2">Eligibility</h4>
                              <p className="text-sm text-muted-foreground">{course.eligibility}</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="placement" className="mt-6">
                  <div className="space-y-6">
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Briefcase className="h-5 w-5 text-primary" />
                          Placement Statistics
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid md:grid-cols-3 gap-6">
                          <div className="text-center">
                            <div className="text-2xl font-bold text-primary mb-1">85%</div>
                            <div className="text-sm text-muted-foreground">Placement Rate</div>
                            <Progress value={85} className="mt-2 h-2" />
                          </div>
                          <div className="text-center">
                            <div className="text-2xl font-bold text-primary mb-1">₹6.5L</div>
                            <div className="text-sm text-muted-foreground">Average Package</div>
                            <Progress value={65} className="mt-2 h-2" />
                          </div>
                          <div className="text-center">
                            <div className="text-2xl font-bold text-primary mb-1">₹15L</div>
                            <div className="text-sm text-muted-foreground">Highest Package</div>
                            <Progress value={90} className="mt-2 h-2" />
                          </div>
                        </div>

                        <div className="mt-8 grid md:grid-cols-2 gap-6">
                          <div>
                            <h4 className="font-medium mb-3">Department-wise Placement</h4>
                            <div className="space-y-3">
                              {[
                                { dept: "Computer Science", rate: 95, avg: "₹8.2L" },
                                { dept: "Electronics", rate: 88, avg: "₹6.8L" },
                                { dept: "Mechanical", rate: 82, avg: "₹5.9L" },
                                { dept: "Civil", rate: 75, avg: "₹5.2L" },
                              ].map((item) => (
                                <div
                                  key={item.dept}
                                  className="flex items-center justify-between p-3 border rounded-lg"
                                >
                                  <div>
                                    <span className="font-medium">{item.dept}</span>
                                    <div className="text-sm text-muted-foreground">{item.rate}% placed</div>
                                  </div>
                                  <div className="text-right">
                                    <div className="font-medium">{item.avg}</div>
                                    <Progress value={item.rate} className="w-16 h-2 mt-1" />
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>

                          <div>
                            <h4 className="font-medium mb-3">Salary Distribution</h4>
                            <div className="space-y-3">
                              {[
                                { range: "₹10L+", percentage: 15 },
                                { range: "₹7-10L", percentage: 35 },
                                { range: "₹5-7L", percentage: 30 },
                                { range: "₹3-5L", percentage: 20 },
                              ].map((item) => (
                                <div key={item.range} className="flex items-center justify-between">
                                  <span className="text-sm">{item.range}</span>
                                  <div className="flex items-center gap-2">
                                    <Progress value={item.percentage} className="w-20 h-2" />
                                    <span className="text-sm font-medium w-8">{item.percentage}%</span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>

                        <div className="mt-6">
                          <h4 className="font-medium mb-3">Top Recruiters</h4>
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                            {[
                              { name: "TCS", positions: 45 },
                              { name: "Infosys", positions: 38 },
                              { name: "Wipro", positions: 32 },
                              { name: "Accenture", positions: 28 },
                              { name: "IBM", positions: 22 },
                              { name: "Cognizant", positions: 20 },
                            ].map((company) => (
                              <div key={company.name} className="p-3 border rounded-lg text-center">
                                <div className="font-medium">{company.name}</div>
                                <div className="text-sm text-muted-foreground">{company.positions} positions</div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle>Alumni Success Stories</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {[
                            {
                              name: "Rahul Sharma",
                              batch: "2020",
                              company: "Google",
                              position: "Software Engineer",
                              package: "₹25L",
                            },
                            {
                              name: "Priya Gupta",
                              batch: "2019",
                              company: "Microsoft",
                              position: "Product Manager",
                              package: "₹22L",
                            },
                            {
                              name: "Amit Kumar",
                              batch: "2021",
                              company: "Amazon",
                              position: "SDE-2",
                              package: "₹28L",
                            },
                          ].map((alumni) => (
                            <div key={alumni.name} className="p-4 border rounded-lg">
                              <div className="flex justify-between items-start">
                                <div>
                                  <h5 className="font-medium">{alumni.name}</h5>
                                  <p className="text-sm text-muted-foreground">Batch of {alumni.batch}</p>
                                  <p className="text-sm">
                                    {alumni.position} at {alumni.company}
                                  </p>
                                </div>
                                <Badge variant="secondary">{alumni.package}</Badge>
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                <TabsContent value="trends" className="mt-6">
                  <div className="space-y-6">
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <TrendingUp className="h-5 w-5 text-primary" />
                          Admission Trends & Predictions
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-6">
                          <div>
                            <h4 className="font-medium mb-3">5-Year Cutoff Analysis</h4>
                            <p className="text-sm text-muted-foreground mb-4">
                              Historical cutoff trends show a gradual decrease, making admission more accessible. Our AI
                              predicts continued stability with slight variations based on seat availability.
                            </p>
                            <div className="space-y-3">
                              {college.courses.map((course) => {
                                const trend = course.cutoff2023 < course.cutoff2022 ? "down" : "up"
                                const percentage = Math.abs(
                                  ((course.cutoff2023 - course.cutoff2022) / course.cutoff2022) * 100,
                                )
                                const predictedCutoff =
                                  trend === "down"
                                    ? Math.round(course.cutoff2023 * 0.95)
                                    : Math.round(course.cutoff2023 * 1.05)

                                return (
                                  <div key={course.id} className="p-4 border rounded-lg">
                                    <div className="flex items-center justify-between mb-2">
                                      <span className="font-medium">{course.name}</span>
                                      <div className="flex items-center gap-2">
                                        <span
                                          className={`text-sm ${trend === "down" ? "text-green-600" : "text-red-600"}`}
                                        >
                                          {trend === "down" ? "↓" : "↑"} {percentage.toFixed(1)}%
                                        </span>
                                        <Progress
                                          value={percentage}
                                          className={`w-20 h-2 ${trend === "down" ? "[&>div]:bg-green-500" : "[&>div]:bg-red-500"}`}
                                        />
                                      </div>
                                    </div>
                                    <div className="grid grid-cols-3 gap-4 text-sm">
                                      <div>
                                        <span className="text-muted-foreground">2023 Cutoff</span>
                                        <div className="font-medium">{course.cutoff2023.toLocaleString()}</div>
                                      </div>
                                      <div>
                                        <span className="text-muted-foreground">2022 Cutoff</span>
                                        <div className="font-medium">{course.cutoff2022.toLocaleString()}</div>
                                      </div>
                                      <div>
                                        <span className="text-muted-foreground">2024 Prediction</span>
                                        <div className="font-medium text-primary">
                                          {predictedCutoff.toLocaleString()}
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                )
                              })}
                            </div>
                          </div>

                          <div>
                            <h4 className="font-medium mb-3">Competition Analysis</h4>
                            <div className="grid md:grid-cols-2 gap-4">
                              <Card>
                                <CardContent className="p-4">
                                  <div className="text-center">
                                    <div className="text-2xl font-bold text-primary mb-1">3.2:1</div>
                                    <div className="text-sm text-muted-foreground">Applications per Seat</div>
                                  </div>
                                </CardContent>
                              </Card>
                              <Card>
                                <CardContent className="p-4">
                                  <div className="text-center">
                                    <div className="text-2xl font-bold text-primary mb-1">68%</div>
                                    <div className="text-sm text-muted-foreground">Admission Success Rate</div>
                                  </div>
                                </CardContent>
                              </Card>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle>Admission Tips & Strategy</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
                            <h5 className="font-medium text-blue-800 dark:text-blue-200 mb-2">💡 Pro Tip</h5>
                            <p className="text-sm text-blue-700 dark:text-blue-300">
                              Based on trends, applying early and having backup options increases your chances by 40%.
                            </p>
                          </div>
                          <div className="grid md:grid-cols-2 gap-4">
                            <div>
                              <h5 className="font-medium mb-2">Best Time to Apply</h5>
                              <p className="text-sm text-muted-foreground">
                                Applications typically open in May. Early applications have higher success rates.
                              </p>
                            </div>
                            <div>
                              <h5 className="font-medium mb-2">Required Documents</h5>
                              <ul className="text-sm text-muted-foreground space-y-1">
                                <li>• Class 12 Marksheet</li>
                                <li>• JEE/CET Scorecard</li>
                                <li>• Category Certificate (if applicable)</li>
                                <li>• Domicile Certificate</li>
                              </ul>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>
              </Tabs>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Target className="h-5 w-5 text-primary" />
                      Quick Stats
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">Total Seats</span>
                        </div>
                        <span className="font-medium">{college.totalSeats}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <GraduationCap className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">Programs</span>
                        </div>
                        <span className="font-medium">{college.courses.length}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">Established</span>
                        </div>
                        <span className="font-medium">{college.established}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <DollarSign className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">Fee Range</span>
                        </div>
                        <span className="font-medium">
                          ₹{Math.min(...college.courses.map((c) => c.fees)).toLocaleString()} - ₹
                          {Math.max(...college.courses.map((c) => c.fees)).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Contact Information</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div>
                        <span className="text-sm text-muted-foreground">Phone</span>
                        <p className="font-medium">{college.contact.phone}</p>
                      </div>
                      <div>
                        <span className="text-sm text-muted-foreground">Website</span>
                        <Link
                          href={college.contact.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block text-primary hover:underline transition-colors"
                        >
                          Visit Website
                        </Link>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Actions</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <Button
                        className={`w-full ${isSaved ? "bg-green-600 hover:bg-green-700" : ""}`}
                        onClick={handleSaveCollege}
                      >
                        {isSaved ? "✓ Saved to Favorites" : "Save to Favorites"}
                      </Button>
                      <Button variant="outline" className="w-full bg-transparent" onClick={handleDownloadReport}>
                        Download Report
                      </Button>
                      <Button
                        variant="outline"
                        className="w-full bg-transparent"
                        onClick={() => setShowComparison(!showComparison)}
                      >
                        {showComparison ? "Hide Comparison" : "Compare Colleges"}
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {showComparison && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Quick Comparison</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3 text-sm">
                        <div className="flex justify-between">
                          <span>vs. Similar Colleges</span>
                          <Badge variant="secondary">Better</Badge>
                        </div>
                        <div className="flex justify-between">
                          <span>Placement Rate</span>
                          <span className="text-green-600">+12% above avg</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Fee Structure</span>
                          <span className="text-green-600">15% lower</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Faculty Ratio</span>
                          <span className="text-blue-600">1:15 (Good)</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
