"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import { SidebarNav } from "@/components/sidebar-nav"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import {
  MapPin,
  Users,
  Star,
  TrendingUp,
  Search,
  Filter,
  Calculator,
  CheckCircle,
  AlertCircle,
  Info,
  Phone,
  Globe,
  Building,
} from "lucide-react"

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

const colleges: College[] = [
  {
    id: "nit-srinagar",
    name: "National Institute of Technology Srinagar",
    location: "Hazratbal, Srinagar",
    district: "Srinagar",
    type: "government",
    established: 1960,
    rating: 4.2,
    totalSeats: 1200,
    hostelAvailable: true,
    facilities: ["Library", "Labs", "Sports Complex", "Hostel", "WiFi", "Cafeteria"],
    contact: {
      phone: "+91-194-2420475",
      email: "registrar@nitsri.net",
      website: "https://www.nitsri.net",
    },
    courses: [
      {
        id: "cse",
        name: "Computer Science & Engineering",
        duration: "4 years",
        seats: 120,
        cutoff2023: 15000,
        cutoff2022: 18000,
        fees: 125000,
        eligibility: "JEE Main + 12th PCM with 75%",
      },
      {
        id: "ece",
        name: "Electronics & Communication",
        duration: "4 years",
        seats: 90,
        cutoff2023: 25000,
        cutoff2022: 28000,
        fees: 125000,
        eligibility: "JEE Main + 12th PCM with 75%",
      },
      {
        id: "me",
        name: "Mechanical Engineering",
        duration: "4 years",
        seats: 90,
        cutoff2023: 35000,
        cutoff2022: 38000,
        fees: 125000,
        eligibility: "JEE Main + 12th PCM with 75%",
      },
    ],
  },
  {
    id: "iiit-jammu",
    name: "Indian Institute of Information Technology Jammu",
    location: "Nagrota, Jammu",
    district: "Jammu",
    type: "government",
    established: 2016,
    rating: 4.0,
    totalSeats: 400,
    hostelAvailable: true,
    facilities: ["Modern Labs", "Library", "Sports", "Hostel", "WiFi", "Research Centers"],
    contact: {
      phone: "+91-191-2690084",
      email: "info@iiitjammu.ac.in",
      website: "https://www.iiitjammu.ac.in",
    },
    courses: [
      {
        id: "cse-iiit",
        name: "Computer Science & Engineering",
        duration: "4 years",
        seats: 100,
        cutoff2023: 12000,
        cutoff2022: 15000,
        fees: 200000,
        eligibility: "JEE Main + 12th PCM with 75%",
      },
      {
        id: "it",
        name: "Information Technology",
        duration: "4 years",
        seats: 50,
        cutoff2023: 18000,
        cutoff2022: 21000,
        fees: 200000,
        eligibility: "JEE Main + 12th PCM with 75%",
      },
    ],
  },
  {
    id: "gmc-srinagar",
    name: "Government Medical College Srinagar",
    location: "Karan Nagar, Srinagar",
    district: "Srinagar",
    type: "government",
    established: 1959,
    rating: 4.3,
    totalSeats: 150,
    hostelAvailable: true,
    facilities: ["Hospital", "Library", "Labs", "Hostel", "Research Wing"],
    contact: {
      phone: "+91-194-2503204",
      email: "principal@gmcsrinagar.edu.in",
      website: "https://www.gmcsrinagar.edu.in",
    },
    courses: [
      {
        id: "mbbs",
        name: "Bachelor of Medicine & Bachelor of Surgery",
        duration: "5.5 years",
        seats: 100,
        cutoff2023: 550,
        cutoff2022: 540,
        fees: 50000,
        eligibility: "NEET + 12th PCB with 50%",
      },
      {
        id: "bds",
        name: "Bachelor of Dental Surgery",
        duration: "5 years",
        seats: 50,
        cutoff2023: 480,
        cutoff2022: 470,
        fees: 75000,
        eligibility: "NEET + 12th PCB with 50%",
      },
    ],
  },
  {
    id: "gce-srinagar",
    name: "Government College of Engineering & Technology",
    location: "Safapora, Ganderbal",
    district: "Ganderbal",
    type: "government",
    established: 2012,
    rating: 3.8,
    totalSeats: 600,
    hostelAvailable: true,
    facilities: ["Labs", "Library", "Workshop", "Hostel", "Cafeteria"],
    contact: {
      phone: "+91-194-2311234",
      email: "principal@gcetsafapora.ac.in",
      website: "https://www.gcetsafapora.ac.in",
    },
    courses: [
      {
        id: "civil",
        name: "Civil Engineering",
        duration: "4 years",
        seats: 120,
        cutoff2023: 45000,
        cutoff2022: 48000,
        fees: 85000,
        eligibility: "JEE Main + 12th PCM with 45%",
      },
      {
        id: "electrical",
        name: "Electrical Engineering",
        duration: "4 years",
        seats: 90,
        cutoff2023: 42000,
        cutoff2022: 45000,
        fees: 85000,
        eligibility: "JEE Main + 12th PCM with 45%",
      },
    ],
  },
]

export default function CollegesPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedDistrict, setSelectedDistrict] = useState<string>("all")
  const [selectedType, setSelectedType] = useState<string>("all")
  const [selectedCourse, setSelectedCourse] = useState<string>("all")
  const [studentMarks, setStudentMarks] = useState<string>("")
  const [selectedCollege, setSelectedCollege] = useState<College | null>(null)
  const [savedColleges, setSavedColleges] = useState<Set<string>>(new Set())

  const districts = useMemo(() => {
    const uniqueDistricts = [...new Set(colleges.map((college) => college.district))]
    return uniqueDistricts.sort()
  }, [])

  const courseTypes = useMemo(() => {
    const allCourses = colleges.flatMap((college) => college.courses.map((course) => course.name))
    return [...new Set(allCourses)].sort()
  }, [])

  const filteredColleges = useMemo(() => {
    return colleges.filter((college) => {
      const matchesSearch =
        college.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        college.location.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesDistrict = selectedDistrict === "all" || college.district === selectedDistrict
      const matchesType = selectedType === "all" || college.type === selectedType
      const matchesCourse = selectedCourse === "all" || college.courses.some((course) => course.name === selectedCourse)

      return matchesSearch && matchesDistrict && matchesType && matchesCourse
    })
  }, [searchTerm, selectedDistrict, selectedType, selectedCourse])

  const calculateAdmissionProbability = (course: Course, marks: number) => {
    if (!marks) return 0

    const avgCutoff = (course.cutoff2023 + course.cutoff2022) / 2
    const marksDiff = marks - avgCutoff

    if (marksDiff >= 5000) return 95
    if (marksDiff >= 2000) return 80
    if (marksDiff >= 0) return 65
    if (marksDiff >= -2000) return 40
    if (marksDiff >= -5000) return 20
    return 5
  }

  const getProbabilityColor = (probability: number) => {
    if (probability >= 80) return "text-green-600"
    if (probability >= 60) return "text-yellow-600"
    if (probability >= 40) return "text-orange-600"
    return "text-red-600"
  }

  const getProbabilityIcon = (probability: number) => {
    if (probability >= 80) return CheckCircle
    if (probability >= 40) return AlertCircle
    return Info
  }

  const handleSaveCollege = (collegeId: string) => {
    setSavedColleges((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(collegeId)) {
        newSet.delete(collegeId)
      } else {
        newSet.add(collegeId)
      }
      return newSet
    })
  }

  const handleViewAnalysis = (college: College) => {
    localStorage.setItem("selectedCollegeAnalysis", JSON.stringify(college))
    window.location.href = `/colleges/analysis?id=${college.id}`
  }

  return (
    <div className="min-h-screen bg-background">
      <SidebarNav />
      <main className="md:ml-64 p-6">
        <div className="max-w-7xl mx-auto mt-12 md:mt-0">
          <div className="mb-8">
            <h1 className="font-playfair text-4xl font-bold text-foreground mb-2">College Finder</h1>
            <p className="text-muted-foreground text-lg">
              Discover government colleges in J&K with AI-powered seat probability predictions
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1">
              <Card className="sticky top-6">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Filter className="h-5 w-5 text-primary" />
                    Search & Filters
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Search Colleges</label>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="College name or location..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">District</label>
                    <Select value={selectedDistrict} onValueChange={setSelectedDistrict}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select district" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Districts</SelectItem>
                        {districts.map((district) => (
                          <SelectItem key={district} value={district}>
                            {district}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">College Type</label>
                    <Select value={selectedType} onValueChange={setSelectedType}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Types</SelectItem>
                        <SelectItem value="government">Government</SelectItem>
                        <SelectItem value="private">Private</SelectItem>
                        <SelectItem value="autonomous">Autonomous</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Course</label>
                    <Select value={selectedCourse} onValueChange={setSelectedCourse}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select course" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Courses</SelectItem>
                        {courseTypes.map((course) => (
                          <SelectItem key={course} value={course}>
                            {course}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="pt-4 border-t">
                    <div className="flex items-center gap-2 mb-3">
                      <Calculator className="h-4 w-4 text-primary" />
                      <label className="text-sm font-medium">Your Rank/Marks</label>
                    </div>
                    <Input
                      placeholder="Enter your JEE/NEET rank..."
                      value={studentMarks}
                      onChange={(e) => setStudentMarks(e.target.value)}
                      type="number"
                    />
                    <p className="text-xs text-muted-foreground mt-1">Enter your rank to see admission probability</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="lg:col-span-2">
              <div className="mb-4 flex items-center justify-between">
                <p className="text-sm text-muted-foreground">Found {filteredColleges.length} colleges</p>
                <Button variant="outline" size="sm" className="bg-transparent">
                  Sort by Ranking
                </Button>
              </div>

              <div className="space-y-4">
                {filteredColleges.map((college) => (
                  <Card key={college.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-xl mb-1">{college.name}</CardTitle>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
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
                              {college.rating}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <Badge
                            className={`mb-2 ${
                              college.type === "government"
                                ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                                : college.type === "private"
                                  ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                                  : "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200"
                            }`}
                          >
                            {college.type}
                          </Badge>
                          <div className="text-sm text-muted-foreground">
                            <Users className="h-4 w-4 inline mr-1" />
                            {college.totalSeats} seats
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <Tabs defaultValue="courses" className="w-full">
                        <TabsList className="grid w-full grid-cols-3">
                          <TabsTrigger value="courses">Courses</TabsTrigger>
                          <TabsTrigger value="facilities">Facilities</TabsTrigger>
                          <TabsTrigger value="contact">Contact</TabsTrigger>
                        </TabsList>

                        <TabsContent value="courses" className="mt-4">
                          <div className="space-y-3">
                            {college.courses.map((course) => {
                              const marks = Number.parseInt(studentMarks) || 0
                              const probability = calculateAdmissionProbability(course, marks)
                              const ProbIcon = getProbabilityIcon(probability)

                              return (
                                <div key={course.id} className="p-4 border rounded-lg">
                                  <div className="flex items-start justify-between mb-2">
                                    <div>
                                      <h4 className="font-medium">{course.name}</h4>
                                      <p className="text-sm text-muted-foreground">
                                        {course.duration} • {course.seats} seats
                                      </p>
                                    </div>
                                    <div className="text-right">
                                      <Badge variant="outline">₹{course.fees.toLocaleString()}/year</Badge>
                                    </div>
                                  </div>

                                  <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div>
                                      <span className="text-muted-foreground">2023 Cutoff: </span>
                                      <span className="font-medium">{course.cutoff2023.toLocaleString()}</span>
                                    </div>
                                    <div>
                                      <span className="text-muted-foreground">2022 Cutoff: </span>
                                      <span className="font-medium">{course.cutoff2022.toLocaleString()}</span>
                                    </div>
                                  </div>

                                  {studentMarks && (
                                    <div className="mt-3 p-3 bg-muted rounded-lg">
                                      <div className="flex items-center justify-between mb-2">
                                        <div className="flex items-center gap-2">
                                          <ProbIcon className={`h-4 w-4 ${getProbabilityColor(probability)}`} />
                                          <span className="text-sm font-medium">Admission Probability</span>
                                        </div>
                                        <span className={`font-bold ${getProbabilityColor(probability)}`}>
                                          {probability}%
                                        </span>
                                      </div>
                                      <Progress value={probability} className="h-2" />
                                    </div>
                                  )}

                                  <p className="text-xs text-muted-foreground mt-2">
                                    Eligibility: {course.eligibility}
                                  </p>
                                </div>
                              )
                            })}
                          </div>
                        </TabsContent>

                        <TabsContent value="facilities" className="mt-4">
                          <div className="flex flex-wrap gap-2">
                            {college.facilities.map((facility, index) => (
                              <Badge key={index} variant="secondary">
                                {facility}
                              </Badge>
                            ))}
                          </div>
                          {college.hostelAvailable && (
                            <div className="mt-3 p-3 bg-green-50 dark:bg-green-950 rounded-lg">
                              <div className="flex items-center gap-2 text-green-700 dark:text-green-300">
                                <CheckCircle className="h-4 w-4" />
                                <span className="text-sm font-medium">Hostel facilities available</span>
                              </div>
                            </div>
                          )}
                        </TabsContent>

                        <TabsContent value="contact" className="mt-4">
                          <div className="space-y-3">
                            <div className="flex items-center gap-2">
                              <Phone className="h-4 w-4 text-muted-foreground" />
                              <span className="text-sm">{college.contact.phone}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Globe className="h-4 w-4 text-muted-foreground" />
                              <Link
                                href={college.contact.website}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-sm text-primary hover:underline transition-colors"
                              >
                                {college.contact.website}
                              </Link>
                            </div>
                          </div>
                        </TabsContent>
                      </Tabs>

                      <div className="mt-4 flex gap-2">
                        <Button
                          className="flex-1 hover:scale-105 transition-transform"
                          onClick={() => handleViewAnalysis(college)}
                        >
                          <TrendingUp className="h-4 w-4 mr-2" />
                          View Detailed Analysis
                        </Button>
                        <Button
                          variant={savedColleges.has(college.id) ? "default" : "outline"}
                          className={`transition-all duration-200 ${
                            savedColleges.has(college.id)
                              ? "bg-green-600 hover:bg-green-700 text-white"
                              : "bg-transparent hover:bg-primary hover:text-primary-foreground"
                          }`}
                          onClick={() => handleSaveCollege(college.id)}
                        >
                          {savedColleges.has(college.id) ? "Saved ✓" : "Save College"}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
