"use client"

import { useState } from "react"
import { SidebarNav } from "@/components/sidebar-nav"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Brain, CheckCircle, ArrowRight, ArrowLeft, RotateCcw } from "lucide-react"

interface Question {
  id: number
  question: string
  options: string[]
  category: "analytical" | "creative" | "social" | "technical" | "leadership"
}

const questions: Question[] = [
  {
    id: 1,
    question: "What type of activities do you enjoy most in your free time?",
    options: [
      "Solving puzzles and brain teasers",
      "Drawing, writing, or creating art",
      "Helping friends with their problems",
      "Building or fixing things",
    ],
    category: "analytical",
  },
  {
    id: 2,
    question: "In group projects, you usually:",
    options: [
      "Take charge and organize the team",
      "Come up with creative ideas",
      "Research and analyze information",
      "Make sure everyone gets along",
    ],
    category: "leadership",
  },
  {
    id: 3,
    question: "Which subject did you find most interesting in school?",
    options: [
      "Mathematics and Physics",
      "Literature and Arts",
      "History and Social Studies",
      "Computer Science and Technology",
    ],
    category: "technical",
  },
  {
    id: 4,
    question: "When facing a problem, you prefer to:",
    options: [
      "Break it down into smaller parts",
      "Think outside the box for solutions",
      "Discuss it with others",
      "Use proven methods and tools",
    ],
    category: "analytical",
  },
  {
    id: 5,
    question: "Your ideal work environment would be:",
    options: [
      "A quiet office with minimal distractions",
      "A creative studio with flexible hours",
      "A collaborative space with team interaction",
      "A lab or workshop with latest equipment",
    ],
    category: "social",
  },
  {
    id: 6,
    question: "What motivates you most?",
    options: [
      "Solving complex challenges",
      "Expressing your creativity",
      "Making a positive impact on society",
      "Building innovative solutions",
    ],
    category: "creative",
  },
  {
    id: 7,
    question: "In your future career, you want to:",
    options: [
      "Lead teams and make strategic decisions",
      "Create something new and original",
      "Help people and communities",
      "Work with cutting-edge technology",
    ],
    category: "leadership",
  },
  {
    id: 8,
    question: "Which activity sounds most appealing?",
    options: [
      "Analyzing data to find patterns",
      "Designing a marketing campaign",
      "Organizing a community event",
      "Programming a mobile app",
    ],
    category: "technical",
  },
]

const streamRecommendations = {
  analytical: {
    stream: "Science (PCM)",
    careers: ["Engineering", "Research Scientist", "Data Analyst", "Mathematician"],
    description: "You have strong analytical and problem-solving skills",
  },
  creative: {
    stream: "Arts/Commerce",
    careers: ["Graphic Designer", "Content Creator", "Marketing", "Architecture"],
    description: "You excel in creative thinking and artistic expression",
  },
  social: {
    stream: "Arts/Commerce",
    careers: ["Social Work", "Psychology", "Teaching", "Human Resources"],
    description: "You have excellent interpersonal and communication skills",
  },
  technical: {
    stream: "Science (PCM/PCB)",
    careers: ["Software Engineer", "Doctor", "Biotechnology", "Mechanical Engineer"],
    description: "You show aptitude for technical and scientific fields",
  },
  leadership: {
    stream: "Commerce/Arts",
    careers: ["Business Management", "Entrepreneurship", "Public Administration", "Law"],
    description: "You demonstrate strong leadership and organizational abilities",
  },
}

export default function QuizPage() {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<Record<number, number>>({})
  const [showResults, setShowResults] = useState(false)
  const [selectedAnswer, setSelectedAnswer] = useState<string>("")

  const progress = ((currentQuestion + 1) / questions.length) * 100

  const handleAnswerSelect = (value: string) => {
    setSelectedAnswer(value)
  }

  const handleNext = () => {
    if (selectedAnswer) {
      setAnswers((prev) => ({
        ...prev,
        [questions[currentQuestion].id]: Number.parseInt(selectedAnswer),
      }))

      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion((prev) => prev + 1)
        setSelectedAnswer("")
      } else {
        setShowResults(true)
      }
    }
  }

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion((prev) => prev - 1)
      setSelectedAnswer(answers[questions[currentQuestion - 1].id]?.toString() || "")
    }
  }

  const calculateResults = () => {
    const scores: Record<string, number> = {
      analytical: 0,
      creative: 0,
      social: 0,
      technical: 0,
      leadership: 0,
    }

    Object.entries(answers).forEach(([questionId, answerIndex]) => {
      const question = questions.find((q) => q.id === Number.parseInt(questionId))
      if (question) {
        scores[question.category]++
      }
    })

    const topCategory = Object.entries(scores).reduce((a, b) =>
      scores[a[0]] > scores[b[0]] ? a : b,
    )[0] as keyof typeof streamRecommendations

    return { scores, topCategory }
  }

  const resetQuiz = () => {
    setCurrentQuestion(0)
    setAnswers({})
    setShowResults(false)
    setSelectedAnswer("")
  }

  if (showResults) {
    const { scores, topCategory } = calculateResults()
    const recommendation = streamRecommendations[topCategory]

    return (
      <div className="min-h-screen bg-background">
        <SidebarNav />
        <main className="md:ml-64 p-6">
          <div className="max-w-4xl mx-auto mt-12 md:mt-0">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-8 w-8 text-white" />
              </div>
              <h1 className="font-playfair text-3xl font-bold text-foreground mb-2">Quiz Complete!</h1>
              <p className="text-muted-foreground">Here are your personalized recommendations</p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <Card className="animate-fade-in-left">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Brain className="h-5 w-5 text-primary" />
                    Your Profile
                  </CardTitle>
                  <CardDescription>{recommendation.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium">Recommended Stream</span>
                        <Badge className="bg-primary">{recommendation.stream}</Badge>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium mb-3">Your Strengths:</h4>
                      <div className="space-y-2">
                        {Object.entries(scores).map(([category, score]) => (
                          <div key={category} className="flex justify-between items-center">
                            <span className="text-sm capitalize">{category}</span>
                            <div className="flex items-center gap-2">
                              <Progress value={(score / questions.length) * 100} className="w-20 h-2" />
                              <span className="text-xs text-muted-foreground">
                                {score}/{questions.length}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="animate-fade-in-right">
                <CardHeader>
                  <CardTitle>Recommended Careers</CardTitle>
                  <CardDescription>Based on your aptitude and interests</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {recommendation.careers.map((career, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                        <span className="font-medium">{career}</span>
                        <Button variant="ghost" size="sm">
                          Explore
                          <ArrowRight className="h-4 w-4 ml-1" />
                        </Button>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 space-y-3">
                    <Button className="w-full">
                      Generate Career Roadmap
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                    <Button variant="outline" className="w-full bg-transparent" onClick={resetQuiz}>
                      <RotateCcw className="h-4 w-4 mr-2" />
                      Retake Quiz
                    </Button>
                  </div>
                </CardContent>
              </Card>
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
        <div className="max-w-2xl mx-auto mt-12 md:mt-0">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
              <Brain className="h-8 w-8 text-primary-foreground" />
            </div>
            <h1 className="font-playfair text-3xl font-bold text-foreground mb-2">Aptitude Assessment</h1>
            <p className="text-muted-foreground">Discover your strengths and find the perfect career path</p>
          </div>

          {/* Progress */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-muted-foreground">
                Question {currentQuestion + 1} of {questions.length}
              </span>
              <span className="text-sm text-muted-foreground">{Math.round(progress)}% Complete</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          {/* Question Card */}
          <Card className="animate-fade-in-up">
            <CardHeader>
              <CardTitle className="text-xl">{questions[currentQuestion].question}</CardTitle>
              <CardDescription>Choose the option that best describes you</CardDescription>
            </CardHeader>
            <CardContent>
              <RadioGroup value={selectedAnswer} onValueChange={handleAnswerSelect}>
                <div className="space-y-3">
                  {questions[currentQuestion].options.map((option, index) => (
                    <div
                      key={index}
                      className="flex items-center space-x-3 p-3 rounded-lg border border-border hover:bg-muted transition-colors"
                    >
                      <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                      <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer">
                        {option}
                      </Label>
                    </div>
                  ))}
                </div>
              </RadioGroup>

              <div className="flex justify-between mt-6">
                <Button variant="outline" onClick={handlePrevious} disabled={currentQuestion === 0}>
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Previous
                </Button>
                <Button onClick={handleNext} disabled={!selectedAnswer} className="bg-primary hover:bg-primary/90">
                  {currentQuestion === questions.length - 1 ? "Finish Quiz" : "Next"}
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
