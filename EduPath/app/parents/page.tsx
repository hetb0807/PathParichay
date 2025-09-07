"use client"

import { useState } from "react"
import { SidebarNav } from "@/components/sidebar-nav"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Users,
  TrendingUp,
  DollarSign,
  Award,
  Target,
  BarChart3,
  AlertTriangle,
  CheckCircle,
  Info,
  Download,
  Share2,
  Heart,
} from "lucide-react"

interface CareerComparison {
  field: string
  duration: string
  investment: string
  avgSalary: string
  jobSecurity: number
  growthPotential: number
  roi: string
  pros: string[]
  cons: string[]
}

interface EducationPath {
  name: string
  type: "degree" | "skill" | "vocational"
  duration: string
  cost: string
  employability: number
  description: string
}

const careerComparisons: CareerComparison[] = [
  {
    field: "Engineering (B.Tech)",
    duration: "4 years",
    investment: "₹4-8 Lakhs",
    avgSalary: "₹6-15 LPA",
    jobSecurity: 85,
    growthPotential: 90,
    roi: "300-400%",
    pros: ["High earning potential", "Diverse opportunities", "Global demand", "Innovation scope"],
    cons: ["Competitive field", "Continuous learning required", "Initial investment high"],
  },
  {
    field: "Medical (MBBS)",
    duration: "5.5 years",
    investment: "₹2-15 Lakhs",
    avgSalary: "₹8-25 LPA",
    jobSecurity: 95,
    growthPotential: 85,
    roi: "400-500%",
    pros: ["Job security", "Social respect", "Helping society", "Stable income"],
    cons: ["Long study period", "High stress", "Expensive private colleges"],
  },
  {
    field: "Commerce (B.Com + CA)",
    duration: "3+3 years",
    investment: "₹2-5 Lakhs",
    avgSalary: "₹5-20 LPA",
    jobSecurity: 80,
    growthPotential: 85,
    roi: "250-350%",
    pros: ["Business opportunities", "Financial expertise", "Entrepreneurship scope"],
    cons: ["Requires additional certifications", "Market dependent"],
  },
  {
    field: "Arts + Civil Services",
    duration: "3+2 years prep",
    investment: "₹1-3 Lakhs",
    avgSalary: "₹7-15 LPA",
    jobSecurity: 100,
    growthPotential: 70,
    roi: "400-600%",
    pros: ["Job security", "Social impact", "Prestige", "Pension benefits"],
    cons: ["Highly competitive", "Uncertain selection", "Limited private options"],
  },
]

const educationPaths: EducationPath[] = [
  {
    name: "Traditional 4-Year Degree",
    type: "degree",
    duration: "4 years",
    cost: "₹3-8 Lakhs",
    employability: 75,
    description: "Comprehensive education with theoretical foundation and practical exposure",
  },
  {
    name: "Skill-Based Certification",
    type: "skill",
    duration: "6-18 months",
    cost: "₹50K-2 Lakhs",
    employability: 85,
    description: "Industry-focused training for immediate job readiness",
  },
  {
    name: "Vocational Training",
    type: "vocational",
    duration: "1-2 years",
    cost: "₹1-3 Lakhs",
    employability: 80,
    description: "Hands-on training for specific trades and technical skills",
  },
]

const parentingTips = [
  {
    title: "Understanding Your Child's Interests",
    content:
      "Observe what activities naturally engage your child. Notice subjects they excel in and topics they discuss enthusiastically.",
    icon: Heart,
  },
  {
    title: "Supporting Career Exploration",
    content: "Encourage internships, job shadowing, and conversations with professionals in fields of interest.",
    icon: Target,
  },
  {
    title: "Financial Planning for Education",
    content: "Start early with education savings. Research scholarships and government schemes available in J&K.",
    icon: DollarSign,
  },
  {
    title: "Balancing Dreams and Reality",
    content: "Help your child set realistic goals while encouraging them to pursue their passions.",
    icon: BarChart3,
  },
]

export default function ParentsPage() {
  const [selectedComparison, setSelectedComparison] = useState<CareerComparison | null>(null)
  const [activeTab, setActiveTab] = useState("overview")

  const generateReport = () => {
    const reportData = {
      careerComparisons,
      educationPaths,
      parentingTips,
      generatedAt: new Date().toLocaleDateString(),
    }

    const reportContent = `
CAREER GUIDANCE REPORT FOR PARENTS
Generated on: ${reportData.generatedAt}

CAREER FIELD COMPARISONS:
${careerComparisons
  .map(
    (career) => `
${career.field}:
- Duration: ${career.duration}
- Investment: ${career.investment}
- Average Salary: ${career.avgSalary}
- ROI: ${career.roi}
- Job Security: ${career.jobSecurity}%
- Growth Potential: ${career.growthPotential}%
`,
  )
  .join("\n")}

EDUCATION PATH OPTIONS:
${educationPaths
  .map(
    (path) => `
${path.name}:
- Duration: ${path.duration}
- Cost: ${path.cost}
- Employability: ${path.employability}%
- Description: ${path.description}
`,
  )
  .join("\n")}

PARENTING TIPS:
${parentingTips
  .map(
    (tip) => `
${tip.title}:
${tip.content}
`,
  )
  .join("\n")}
    `

    const blob = new Blob([reportContent], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "career-guidance-report.txt"
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
            <div className="flex items-center justify-between">
              <div>
                <h1 className="font-playfair text-4xl font-bold text-foreground mb-2">Parent Guidance Dashboard</h1>
                <p className="text-muted-foreground text-lg">
                  Comprehensive insights to help guide your child's educational and career decisions
                </p>
              </div>
              <div className="flex gap-2">
                <Button onClick={generateReport} variant="outline" className="bg-transparent">
                  <Download className="h-4 w-4 mr-2" />
                  Download Report
                </Button>
                <Button variant="outline" className="bg-transparent">
                  <Share2 className="h-4 w-4 mr-2" />
                  Share Insights
                </Button>
              </div>
            </div>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="comparisons">Career Comparisons</TabsTrigger>
              <TabsTrigger value="education">Education Paths</TabsTrigger>
              <TabsTrigger value="guidance">Parenting Tips</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="mt-6">
              {/* Key Metrics */}
              <div className="grid md:grid-cols-4 gap-4 mb-8">
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <TrendingUp className="h-4 w-4 text-green-500" />
                      <span className="text-sm text-muted-foreground">Job Market Growth</span>
                    </div>
                    <p className="text-2xl font-bold">+15%</p>
                    <p className="text-xs text-muted-foreground">in J&K (2024)</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <DollarSign className="h-4 w-4 text-blue-500" />
                      <span className="text-sm text-muted-foreground">Avg. Starting Salary</span>
                    </div>
                    <p className="text-2xl font-bold">₹4.5L</p>
                    <p className="text-xs text-muted-foreground">for graduates</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Award className="h-4 w-4 text-purple-500" />
                      <span className="text-sm text-muted-foreground">Scholarship Value</span>
                    </div>
                    <p className="text-2xl font-bold">₹12L+</p>
                    <p className="text-xs text-muted-foreground">available annually</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Users className="h-4 w-4 text-orange-500" />
                      <span className="text-sm text-muted-foreground">Success Rate</span>
                    </div>
                    <p className="text-2xl font-bold">94%</p>
                    <p className="text-xs text-muted-foreground">with guidance</p>
                  </CardContent>
                </Card>
              </div>

              {/* Quick Insights */}
              <div className="grid md:grid-cols-2 gap-6 mb-8">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Info className="h-5 w-5 text-primary" />
                      Why Higher Education Matters
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-950 rounded-lg">
                        <span className="text-sm font-medium text-green-800 dark:text-green-200">
                          Higher Earning Potential
                        </span>
                        <Badge className="bg-green-500 text-white">3x more</Badge>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-950 rounded-lg">
                        <span className="text-sm font-medium text-blue-800 dark:text-blue-200">Job Security</span>
                        <Badge className="bg-blue-500 text-white">85% stable</Badge>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-purple-50 dark:bg-purple-950 rounded-lg">
                        <span className="text-sm font-medium text-purple-800 dark:text-purple-200">Career Growth</span>
                        <Badge className="bg-purple-500 text-white">Faster promotion</Badge>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-orange-50 dark:bg-orange-950 rounded-lg">
                        <span className="text-sm font-medium text-orange-800 dark:text-orange-200">Social Impact</span>
                        <Badge className="bg-orange-500 text-white">Leadership roles</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <AlertTriangle className="h-5 w-5 text-yellow-500" />
                      Common Parent Concerns
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="p-3 border-l-4 border-yellow-500 bg-yellow-50 dark:bg-yellow-950">
                        <h4 className="font-medium text-sm text-yellow-800 dark:text-yellow-200">
                          Financial Investment
                        </h4>
                        <p className="text-xs text-yellow-700 dark:text-yellow-300 mt-1">
                          Government colleges offer quality education at affordable costs. Scholarships available.
                        </p>
                      </div>
                      <div className="p-3 border-l-4 border-blue-500 bg-blue-50 dark:bg-blue-950">
                        <h4 className="font-medium text-sm text-blue-800 dark:text-blue-200">Job Guarantee</h4>
                        <p className="text-xs text-blue-700 dark:text-blue-300 mt-1">
                          While no career guarantees jobs, education significantly improves employment prospects.
                        </p>
                      </div>
                      <div className="p-3 border-l-4 border-green-500 bg-green-50 dark:bg-green-950">
                        <h4 className="font-medium text-sm text-green-800 dark:text-green-200">Right Career Choice</h4>
                        <p className="text-xs text-green-700 dark:text-green-300 mt-1">
                          Use our aptitude tests and career guidance to make informed decisions.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Action Items */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    Recommended Actions for Parents
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <div className="flex items-start gap-3 p-3 bg-muted rounded-lg">
                        <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center text-primary-foreground text-xs font-bold">
                          1
                        </div>
                        <div>
                          <h4 className="font-medium text-sm">Take the Aptitude Quiz Together</h4>
                          <p className="text-xs text-muted-foreground">
                            Help your child discover their strengths and interests
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3 p-3 bg-muted rounded-lg">
                        <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center text-primary-foreground text-xs font-bold">
                          2
                        </div>
                        <div>
                          <h4 className="font-medium text-sm">Explore Career Roadmaps</h4>
                          <p className="text-xs text-muted-foreground">
                            Understand the step-by-step path for different careers
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3 p-3 bg-muted rounded-lg">
                        <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center text-primary-foreground text-xs font-bold">
                          3
                        </div>
                        <div>
                          <h4 className="font-medium text-sm">Research Colleges & Costs</h4>
                          <p className="text-xs text-muted-foreground">
                            Use our college finder to compare options and fees
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-start gap-3 p-3 bg-muted rounded-lg">
                        <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center text-primary-foreground text-xs font-bold">
                          4
                        </div>
                        <div>
                          <h4 className="font-medium text-sm">Apply for Scholarships</h4>
                          <p className="text-xs text-muted-foreground">
                            Check scholarship eligibility and application deadlines
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3 p-3 bg-muted rounded-lg">
                        <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center text-primary-foreground text-xs font-bold">
                          5
                        </div>
                        <div>
                          <h4 className="font-medium text-sm">Plan Finances Early</h4>
                          <p className="text-xs text-muted-foreground">
                            Start saving and explore education loan options
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3 p-3 bg-muted rounded-lg">
                        <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center text-primary-foreground text-xs font-bold">
                          6
                        </div>
                        <div>
                          <h4 className="font-medium text-sm">Stay Supportive</h4>
                          <p className="text-xs text-muted-foreground">
                            Encourage exploration while providing emotional support
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="comparisons" className="mt-6">
              <div className="grid lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <div className="grid gap-4">
                    {careerComparisons.map((career, index) => (
                      <Card
                        key={index}
                        className={`cursor-pointer transition-all ${
                          selectedComparison?.field === career.field ? "border-primary shadow-lg" : "hover:shadow-md"
                        }`}
                        onClick={() => setSelectedComparison(career)}
                      >
                        <CardHeader>
                          <div className="flex items-center justify-between">
                            <CardTitle className="text-lg">{career.field}</CardTitle>
                            <Badge className="bg-primary">{career.roi} ROI</Badge>
                          </div>
                          <div className="grid grid-cols-3 gap-4 text-sm">
                            <div>
                              <span className="text-muted-foreground">Duration: </span>
                              <span className="font-medium">{career.duration}</span>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Investment: </span>
                              <span className="font-medium">{career.investment}</span>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Avg Salary: </span>
                              <span className="font-medium">{career.avgSalary}</span>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-3">
                            <div>
                              <div className="flex justify-between text-sm mb-1">
                                <span>Job Security</span>
                                <span>{career.jobSecurity}%</span>
                              </div>
                              <Progress value={career.jobSecurity} className="h-2" />
                            </div>
                            <div>
                              <div className="flex justify-between text-sm mb-1">
                                <span>Growth Potential</span>
                                <span>{career.growthPotential}%</span>
                              </div>
                              <Progress value={career.growthPotential} className="h-2" />
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>

                {selectedComparison && (
                  <div className="lg:col-span-1">
                    <Card className="sticky top-6">
                      <CardHeader>
                        <CardTitle>{selectedComparison.field}</CardTitle>
                        <CardDescription>Detailed Analysis</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div>
                            <h4 className="font-medium text-sm mb-2 text-green-600">Advantages</h4>
                            <ul className="space-y-1">
                              {selectedComparison.pros.map((pro, index) => (
                                <li key={index} className="text-xs flex items-center gap-2">
                                  <CheckCircle className="h-3 w-3 text-green-500" />
                                  {pro}
                                </li>
                              ))}
                            </ul>
                          </div>
                          <div>
                            <h4 className="font-medium text-sm mb-2 text-orange-600">Considerations</h4>
                            <ul className="space-y-1">
                              {selectedComparison.cons.map((con, index) => (
                                <li key={index} className="text-xs flex items-center gap-2">
                                  <AlertTriangle className="h-3 w-3 text-orange-500" />
                                  {con}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="education" className="mt-6">
              <div className="grid md:grid-cols-3 gap-6 mb-8">
                {educationPaths.map((path, index) => (
                  <Card key={index}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">{path.name}</CardTitle>
                        <Badge
                          variant={path.type === "degree" ? "default" : path.type === "skill" ? "secondary" : "outline"}
                        >
                          {path.type}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div>
                            <span className="text-muted-foreground">Duration:</span>
                            <div className="font-medium">{path.duration}</div>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Cost:</span>
                            <div className="font-medium">{path.cost}</div>
                          </div>
                        </div>
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span>Employability</span>
                            <span>{path.employability}%</span>
                          </div>
                          <Progress value={path.employability} className="h-2" />
                        </div>
                        <p className="text-xs text-muted-foreground">{path.description}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Education Investment vs Returns</CardTitle>
                  <CardDescription>Understanding the long-term value of different educational paths</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
                      <h4 className="font-medium mb-2">Short-term vs Long-term Perspective</h4>
                      <p className="text-sm text-muted-foreground">
                        While skill-based courses offer quicker employment, degree programs provide broader career
                        opportunities and higher long-term earning potential. Consider your child's interests and family
                        financial situation when making decisions.
                      </p>
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="p-4 border rounded-lg">
                        <h4 className="font-medium mb-2">Government College Benefits</h4>
                        <ul className="text-sm space-y-1">
                          <li>• Lower fees compared to private institutions</li>
                          <li>• Quality education with experienced faculty</li>
                          <li>• Better placement opportunities</li>
                          <li>• Scholarship availability</li>
                        </ul>
                      </div>
                      <div className="p-4 border rounded-lg">
                        <h4 className="font-medium mb-2">Financial Planning Tips</h4>
                        <ul className="text-sm space-y-1">
                          <li>• Start education savings early</li>
                          <li>• Research scholarship opportunities</li>
                          <li>• Consider education loans if needed</li>
                          <li>• Factor in living expenses</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="guidance" className="mt-6">
              <div className="grid md:grid-cols-2 gap-6">
                {parentingTips.map((tip, index) => (
                  <Card key={index}>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <tip.icon className="h-5 w-5 text-primary" />
                        {tip.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">{tip.content}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>Communication Strategies</CardTitle>
                  <CardDescription>How to have productive career conversations with your child</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-medium mb-3 text-green-600">Do's</h4>
                        <ul className="space-y-2 text-sm">
                          <li className="flex items-start gap-2">
                            <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                            Listen to their interests and concerns
                          </li>
                          <li className="flex items-start gap-2">
                            <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                            Provide information and resources
                          </li>
                          <li className="flex items-start gap-2">
                            <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                            Encourage exploration and research
                          </li>
                          <li className="flex items-start gap-2">
                            <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                            Share your experiences without imposing
                          </li>
                          <li className="flex items-start gap-2">
                            <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                            Support their decisions once made
                          </li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-medium mb-3 text-red-600">Don'ts</h4>
                        <ul className="space-y-2 text-sm">
                          <li className="flex items-start gap-2">
                            <AlertTriangle className="h-4 w-4 text-red-500 mt-0.5" />
                            Force your career preferences on them
                          </li>
                          <li className="flex items-start gap-2">
                            <AlertTriangle className="h-4 w-4 text-red-500 mt-0.5" />
                            Dismiss their interests as impractical
                          </li>
                          <li className="flex items-start gap-2">
                            <AlertTriangle className="h-4 w-4 text-red-500 mt-0.5" />
                            Compare them with other children
                          </li>
                          <li className="flex items-start gap-2">
                            <AlertTriangle className="h-4 w-4 text-red-500 mt-0.5" />
                            Make decisions without their input
                          </li>
                          <li className="flex items-start gap-2">
                            <AlertTriangle className="h-4 w-4 text-red-500 mt-0.5" />
                            Create pressure or stress around choices
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  )
}
