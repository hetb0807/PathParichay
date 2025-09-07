"use client"

import { useState, useRef, useEffect } from "react"
import { SidebarNav } from "@/components/sidebar-nav"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Mic, MicOff, Volume2, VolumeX, Sparkles, AudioWaveform as Waveform } from "lucide-react"

interface Message {
  id: string
  content: string
  sender: "user" | "ai"
  timestamp: Date
  isVoice?: boolean
  isTyping?: boolean
}

interface VoiceSettings {
  enabled: boolean
  voice: string
  speed: number
  pitch: number
  muted: boolean
  voiceEffect: string
  reverb: number
  echo: number
  distortion: number
}

const predefinedQuestions = [
  "What career is best for me after 12th Science?",
  "Which engineering branch has the best scope in J&K?",
  "How do I prepare for NEET exam?",
  "What are the government job opportunities after graduation?",
  "Should I choose Arts or Commerce stream?",
  "Which colleges in Srinagar offer Computer Science?",
]

const conversationalResponses = {
  greetings: [
    "Hello! I'm excited to help you with your career journey. What would you like to explore today?",
    "Hi there! Ready to discover your perfect career path? I'm here to guide you!",
    "Hey! Great to see you here. Let's find the best educational opportunities for you in J&K!",
  ],
  howAreYou: [
    "I'm doing great, thank you for asking! I'm here and ready to help you with all your career questions. How are you doing?",
    "I'm fantastic and energized to help students like you! How can I assist you with your educational journey today?",
    "I'm wonderful, thanks! I love helping students discover their potential. What's on your mind about your future?",
  ],
  thanks: [
    "You're very welcome! I'm always happy to help. Is there anything else about your career or education you'd like to discuss?",
    "My pleasure! That's what I'm here for. Feel free to ask me anything about colleges, careers, or studies in J&K.",
    "Glad I could help! Don't hesitate to reach out if you have more questions about your future plans.",
  ],
  goodbye: [
    "Goodbye! Best of luck with your studies and career planning. I'll be here whenever you need guidance!",
    "Take care! Remember, I'm always here to help with your educational journey. See you soon!",
    "Bye! Wishing you all the best in your academic and career pursuits. Come back anytime!",
  ],
}

const TypingAnimation = () => (
  <div className="flex items-center gap-1 p-4">
    <div className="flex gap-1">
      <div className="w-2 h-2 bg-muted-foreground/60 rounded-full animate-bounce" />
      <div className="w-2 h-2 bg-muted-foreground/60 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }} />
      <div className="w-2 h-2 bg-muted-foreground/60 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }} />
    </div>
    <span className="text-sm text-muted-foreground ml-2">AI is thinking...</span>
  </div>
)

const TypewriterText = ({ text, onComplete }: { text: string; onComplete?: () => void }) => {
  const [displayText, setDisplayText] = useState("")
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    if (currentIndex < text.length) {
      const timer = setTimeout(() => {
        setDisplayText((prev) => prev + text[currentIndex])
        setCurrentIndex((prev) => prev + 1)
      }, 30)
      return () => clearTimeout(timer)
    } else if (onComplete) {
      onComplete()
    }
  }, [currentIndex, text, onComplete])

  return <span>{displayText}</span>
}

const voiceOptions = [
  { id: "female-1", name: "Priya (Female, Hindi/English)", lang: "hi-IN" },
  { id: "male-1", name: "Arjun (Male, Hindi/English)", lang: "hi-IN" },
  { id: "female-2", name: "Sarah (Female, English)", lang: "en-US" },
  { id: "male-2", name: "David (Male, English)", lang: "en-US" },
]

const voiceEffects = [
  { id: "normal", name: "Normal", description: "Natural voice" },
  { id: "robot", name: "Robot", description: "Robotic effect" },
  { id: "alien", name: "Alien", description: "Otherworldly sound" },
  { id: "deep", name: "Deep", description: "Lower pitch" },
  { id: "chipmunk", name: "Chipmunk", description: "Higher pitch" },
  { id: "echo", name: "Echo", description: "Echo chamber" },
  { id: "whisper", name: "Whisper", description: "Soft whisper" },
]

export default function MentorPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content:
        "Hello! I'm your AI Career Mentor. I'm here to help you with career guidance, college selection, and educational planning in Jammu & Kashmir. How can I assist you today?",
      sender: "ai",
      timestamp: new Date(),
    },
  ])
  const [inputMessage, setInputMessage] = useState("")
  const [isListening, setIsListening] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [voiceSettings, setVoiceSettings] = useState<VoiceSettings>({
    enabled: true,
    voice: "female-1",
    speed: 1,
    pitch: 1,
    muted: false,
    voiceEffect: "normal",
    reverb: 0,
    echo: 0,
    distortion: 0,
  })
  const [showSettings, setShowSettings] = useState(false)
  const [isVoiceToVoice, setIsVoiceToVoice] = useState(false)
  const [isProcessingVoice, setIsProcessingVoice] = useState(false)

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const recognitionRef = useRef<any>(null)
  const synthRef = useRef<SpeechSynthesis | null>(null)
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null)
  const [voiceProcessor, setVoiceProcessor] = useState<any>(null)

  const [audioNodes, setAudioNodes] = useState<{
    gainNode?: GainNode
    filterNode?: BiquadFilterNode
    delayNode?: DelayNode
    convolverNode?: ConvolverNode
    distortionNode?: WaveShaperNode
  }>({})

  useEffect(() => {
    if (typeof window !== "undefined" && "AudioContext" in window) {
      const ctx = new AudioContext()
      setAudioContext(ctx)

      // Create audio processing nodes
      const gainNode = ctx.createGain()
      const filterNode = ctx.createBiquadFilter()
      const delayNode = ctx.createDelay(1.0)
      const convolverNode = ctx.createConvolver()
      const distortionNode = ctx.createWaveShaper()

      setAudioNodes({
        gainNode,
        filterNode,
        delayNode,
        convolverNode,
        distortionNode,
      })
    }

    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  useEffect(() => {
    // Initialize speech synthesis
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      synthRef.current = window.speechSynthesis
    }

    if (typeof window !== "undefined" && ("webkitSpeechRecognition" in window || "SpeechRecognition" in window)) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition
      recognitionRef.current = new SpeechRecognition()
      recognitionRef.current.continuous = false
      recognitionRef.current.interimResults = false
      recognitionRef.current.lang = "hi-IN"
      recognitionRef.current.maxAlternatives = 1

      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript
        console.log("[v0] Speech recognized:", transcript)
        setInputMessage(transcript)
        setIsListening(false)

        setTimeout(() => {
          if (transcript.trim()) {
            handleSendMessageWithText(transcript)
          }
        }, 200)
      }

      recognitionRef.current.onerror = (event: any) => {
        console.log("[v0] Speech recognition error:", event.error)
        setIsListening(false)

        if (event.error === "network") {
          console.log("[v0] Network error - trying offline recognition")
          // Fallback to basic input
          setInputMessage("Sorry, voice recognition is having network issues. Please type your message.")
        }
      }

      recognitionRef.current.onend = () => {
        setIsListening(false)
      }
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop()
      }
      if (synthRef.current) {
        synthRef.current.cancel()
      }
      if (audioContext) {
        audioContext.close()
      }
    }
  }, [])

  const generateAIResponse = async (userMessage: string): Promise<string> => {
    // Reduced simulation delay for faster responses
    await new Promise((resolve) => setTimeout(resolve, 500 + Math.random() * 1000))

    const message = userMessage.toLowerCase().trim()

    // Handle greetings
    if (message.match(/^(hi|hello|hey|namaste|good morning|good afternoon|good evening)$/)) {
      return conversationalResponses.greetings[Math.floor(Math.random() * conversationalResponses.greetings.length)]
    }

    // Handle "how are you" variations
    if (message.includes("how are you") || message.includes("how r u") || message.includes("kaise ho")) {
      return conversationalResponses.howAreYou[Math.floor(Math.random() * conversationalResponses.howAreYou.length)]
    }

    // Handle thanks
    if (message.match(/^(thanks|thank you|thanku|dhanyawad|shukriya)$/)) {
      return conversationalResponses.thanks[Math.floor(Math.random() * conversationalResponses.thanks.length)]
    }

    // Handle goodbye
    if (message.match(/^(bye|goodbye|see you|alvida|namaste)$/)) {
      return conversationalResponses.goodbye[Math.floor(Math.random() * conversationalResponses.goodbye.length)]
    }

    const responses = {
      career: [
        "Based on your interests in Science, I'd recommend considering Engineering, Medical, or Research fields. In J&K, there are excellent opportunities in Computer Science, Civil Engineering (given the infrastructure development), and Medical sciences. Would you like me to elaborate on any specific field?",
        "For Science students in J&K, popular career paths include Engineering (especially at NIT Srinagar), Medical (GMC Srinagar/Jammu), and emerging fields like Data Science and Biotechnology. What subjects do you enjoy most?",
      ],
      engineering: [
        "In J&K, Computer Science and Civil Engineering have excellent scope. With the digital transformation initiatives and infrastructure development projects, these fields offer great opportunities. NIT Srinagar and IIIT Jammu are top choices for engineering education.",
        "Engineering branches with good scope in J&K include Computer Science (IT sector growth), Civil Engineering (infrastructure projects), and Electrical Engineering (power sector development). Which area interests you most?",
      ],
      neet: [
        "For NEET preparation, focus on NCERT books for all three subjects. Create a study schedule covering Physics, Chemistry, and Biology. Practice previous year papers and take mock tests regularly. Consider joining a coaching institute or online courses for structured guidance.",
        "NEET preparation requires consistent study for 12-18 months. Focus on conceptual clarity in Physics, memorization techniques for Biology, and problem-solving in Chemistry. GMC Srinagar and Jammu are excellent options with your NEET score.",
      ],
      government: [
        "Government job opportunities after graduation in J&K include JKPSC exams, banking sector (J&K Bank), teaching positions, and central government jobs through SSC and UPSC. The state government also offers various administrative positions.",
        "Popular government career paths include Civil Services (JKPSC/UPSC), Banking (J&K Bank recruitment), Teaching (through TET), and technical positions in various departments. What's your educational background?",
      ],
      stream: [
        "The choice between Arts and Commerce depends on your interests. Commerce is ideal if you're interested in business, economics, or accounting careers. Arts offers flexibility with options in humanities, social sciences, and creative fields. What subjects do you enjoy?",
        "Commerce stream leads to careers in CA, CS, Banking, and Business Management. Arts stream opens doors to Civil Services, Law, Journalism, and Social Work. Consider your strengths and career aspirations when choosing.",
      ],
      colleges: [
        "For Computer Science in Srinagar, top options include NIT Srinagar (through JEE Main), IIIT Jammu, and Government College of Engineering & Technology. Private options include Islamic University and Kashmir University. What's your JEE rank or 12th percentage?",
        "Srinagar offers excellent Computer Science programs at NIT Srinagar (premier choice), Government colleges, and private institutions. Admission requirements vary - JEE Main for NITs, state entrance for government colleges.",
      ],
    }

    // Career-related keyword matching
    if (message.includes("career") || message.includes("12th") || message.includes("science")) {
      return responses.career[Math.floor(Math.random() * responses.career.length)]
    }
    if (message.includes("engineering") || message.includes("branch")) {
      return responses.engineering[Math.floor(Math.random() * responses.engineering.length)]
    }
    if (message.includes("neet") || message.includes("medical")) {
      return responses.neet[Math.floor(Math.random() * responses.neet.length)]
    }
    if (message.includes("government") || message.includes("job")) {
      return responses.government[Math.floor(Math.random() * responses.government.length)]
    }
    if (message.includes("arts") || message.includes("commerce") || message.includes("stream")) {
      return responses.stream[Math.floor(Math.random() * responses.stream.length)]
    }
    if (message.includes("college") || message.includes("computer") || message.includes("srinagar")) {
      return responses.colleges[Math.floor(Math.random() * responses.colleges.length)]
    }

    return "That's a great question! Based on the current education landscape in J&K, I'd recommend exploring the career roadmap feature to see detailed paths for your interests. You can also check out the college finder to see admission requirements and cutoffs. What specific aspect would you like me to help you with?"
  }

  const speakMessage = (text: string) => {
    if (!voiceSettings.enabled || !synthRef.current || voiceSettings.muted) return

    synthRef.current.cancel()

    const loadVoices = () => {
      const utterance = new SpeechSynthesisUtterance(text)
      const voices = synthRef.current!.getVoices()

      const selectedVoice = voiceOptions.find((v) => v.id === voiceSettings.voice)
      if (selectedVoice && voices.length > 0) {
        let voice = voices.find((v) => v.lang === selectedVoice.lang)

        if (selectedVoice.id.includes("female")) {
          voice =
            voices.find(
              (v) =>
                v.lang === selectedVoice.lang &&
                (v.name.toLowerCase().includes("female") ||
                  v.name.toLowerCase().includes("woman") ||
                  v.name.toLowerCase().includes("zira") ||
                  v.name.toLowerCase().includes("hazel") ||
                  !v.name.toLowerCase().includes("male")),
            ) || voice
        } else if (selectedVoice.id.includes("male")) {
          voice =
            voices.find(
              (v) =>
                v.lang === selectedVoice.lang &&
                (v.name.toLowerCase().includes("male") ||
                  v.name.toLowerCase().includes("man") ||
                  v.name.toLowerCase().includes("david") ||
                  v.name.toLowerCase().includes("mark")),
            ) || voice
        }

        if (voice) {
          utterance.voice = voice
          console.log("[v0] Selected voice:", voice.name, "for", selectedVoice.name)
        }
      }

      // Apply voice effects based on selected effect
      switch (voiceSettings.voiceEffect) {
        case "robot":
          utterance.rate = 0.8
          utterance.pitch = 0.7
          break
        case "alien":
          utterance.rate = 1.2
          utterance.pitch = 1.8
          break
        case "deep":
          utterance.rate = 0.7
          utterance.pitch = 0.5
          break
        case "chipmunk":
          utterance.rate = 1.5
          utterance.pitch = 2.0
          break
        case "echo":
          utterance.rate = 0.9
          utterance.pitch = 1.1
          break
        case "whisper":
          utterance.rate = 0.6
          utterance.pitch = 0.8
          utterance.volume = 0.3
          break
        default:
          utterance.rate = voiceSettings.speed
          utterance.pitch = voiceSettings.pitch
      }

      // Apply additional custom settings
      if (voiceSettings.voiceEffect === "normal") {
        utterance.rate = voiceSettings.speed
        utterance.pitch = voiceSettings.pitch
      }

      utterance.onstart = () => {
        console.log("[v0] Voice processing started with effect:", voiceSettings.voiceEffect)
      }

      synthRef.current!.speak(utterance)
    }

    if (synthRef.current.getVoices().length === 0) {
      synthRef.current.onvoiceschanged = () => {
        loadVoices()
        synthRef.current!.onvoiceschanged = null
      }
    } else {
      loadVoices()
    }
  }

  const toggleMute = () => {
    setVoiceSettings((prev) => ({ ...prev, muted: !prev.muted }))
    if (synthRef.current && !voiceSettings.muted) {
      synthRef.current.cancel()
    }
  }

  const handleVoiceToVoice = async () => {
    if (!recognitionRef.current) return

    try {
      if (isListening || isVoiceToVoice) {
        console.log("[v0] Stopping existing recognition before starting voice-to-voice")
        recognitionRef.current.stop()
        setIsListening(false)
        setIsVoiceToVoice(false)
        setIsProcessingVoice(false)
        // Wait a moment for cleanup
        await new Promise((resolve) => setTimeout(resolve, 100))
      }

      setIsVoiceToVoice(true)
      setIsProcessingVoice(true)
      setIsListening(true)

      recognitionRef.current.onresult = async (event: any) => {
        const transcript = event.results[0][0].transcript
        console.log("[v0] Voice-to-voice transcript:", transcript)
        setIsListening(false)

        const userMessage: Message = {
          id: Date.now().toString(),
          content: transcript,
          sender: "user",
          timestamp: new Date(),
          isVoice: true,
        }
        setMessages((prev) => [...prev, userMessage])

        try {
          const aiResponsePromise = generateAIResponse(transcript)

          const aiResponse = await aiResponsePromise
          const aiMessage: Message = {
            id: (Date.now() + 1).toString(),
            content: aiResponse,
            sender: "ai",
            timestamp: new Date(),
            isVoice: true,
          }
          setMessages((prev) => [...prev, aiMessage])

          speakMessage(aiResponse)
        } catch (error) {
          console.error("Error in voice-to-voice:", error)
        } finally {
          setIsProcessingVoice(false)
          setIsVoiceToVoice(false)
        }
      }

      recognitionRef.current.onerror = (event: any) => {
        console.log("[v0] Voice-to-voice error:", event.error)
        setIsVoiceToVoice(false)
        setIsProcessingVoice(false)
        setIsListening(false)

        if (event.error === "network") {
          // Add fallback message
          const errorMessage: Message = {
            id: Date.now().toString(),
            content:
              "Voice recognition is experiencing network issues. Please check your internet connection and try again, or use text input instead.",
            sender: "ai",
            timestamp: new Date(),
          }
          setMessages((prev) => [...prev, errorMessage])
        }
      }

      recognitionRef.current.onend = () => {
        setIsListening(false)
        setIsVoiceToVoice(false)
        setIsProcessingVoice(false)
      }

      recognitionRef.current.start()
    } catch (error) {
      console.error("[v0] Error in voice-to-voice mode:", error)
      setIsVoiceToVoice(false)
      setIsProcessingVoice(false)
      setIsListening(false)
    }
  }

  const handleSendMessageWithText = async (messageText: string) => {
    if (!messageText.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      content: messageText,
      sender: "user",
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setIsLoading(true)

    try {
      const aiResponse = await generateAIResponse(messageText)

      const typingMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: aiResponse,
        sender: "ai",
        timestamp: new Date(),
        isTyping: true,
      }

      setMessages((prev) => [...prev, typingMessage])

      setTimeout(() => {
        setMessages((prev) => prev.map((msg) => (msg.id === typingMessage.id ? { ...msg, isTyping: false } : msg)))

        // Speak the AI response
        if (voiceSettings.enabled && !voiceSettings.muted) {
          speakMessage(aiResponse)
        }
      }, 600) // Reduced from 1000ms to 600ms
    } catch (error) {
      console.error("Error generating AI response:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return

    const messageText = inputMessage
    setInputMessage("")
    await handleSendMessageWithText(messageText)
  }

  const startListening = () => {
    if (recognitionRef.current && !isListening && !isVoiceToVoice) {
      try {
        setIsListening(true)
        setInputMessage("")

        const timeout = setTimeout(() => {
          if (isListening) {
            console.log("[v0] Speech recognition timeout - stopping")
            stopListening()
            setInputMessage("Voice recognition timed out. Please try again or type your message.")
          }
        }, 10000) // 10 second timeout

        recognitionRef.current.onend = () => {
          clearTimeout(timeout)
          setIsListening(false)
        }

        recognitionRef.current.start()
        console.log("[v0] Started listening...")
      } catch (error) {
        console.error("[v0] Error starting speech recognition:", error)
        setIsListening(false)
      }
    }
  }

  const stopListening = () => {
    if (recognitionRef.current && (isListening || isVoiceToVoice)) {
      try {
        recognitionRef.current.stop()
        setIsListening(false)
        setIsVoiceToVoice(false)
        setIsProcessingVoice(false)
        console.log("[v0] Stopped listening")
      } catch (error) {
        console.error("[v0] Error stopping speech recognition:", error)
        setIsListening(false)
        setIsVoiceToVoice(false)
        setIsProcessingVoice(false)
      }
    }
  }

  const handleQuickQuestion = (question: string) => {
    setInputMessage(question)
    setTimeout(() => {
      handleSendMessageWithText(question)
    }, 100)
  }

  const clearChat = () => {
    setMessages([
      {
        id: "1",
        content:
          "Hello! I'm your AI Career Mentor. I'm here to help you with career guidance, college selection, and educational planning in Jammu & Kashmir. How can I assist you today?",
        sender: "ai",
        timestamp: new Date(),
      },
    ])
  }

  const copyMessage = (content: string) => {
    navigator.clipboard.writeText(content)
  }

  const exportChat = () => {
    const chatText = messages.map((msg) => `${msg.sender.toUpperCase()}: ${msg.content}`).join("\n\n")

    const blob = new Blob([chatText], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "career-mentor-chat.txt"
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="min-h-screen bg-background">
      <SidebarNav />
      <main className="md:ml-64 p-4 sm:p-6">
        <div className="max-w-6xl mx-auto mt-12 md:mt-0">
          <div className="mb-12">
            <div className="text-center max-w-3xl mx-auto">
              <h1 className="font-playfair text-3xl sm:text-5xl font-bold text-foreground mb-4 bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
                AI Career Mentor
              </h1>
              <p className="text-muted-foreground text-lg sm:text-xl leading-relaxed">
                Get personalized career guidance with advanced AI assistance for students in Jammu & Kashmir
              </p>
            </div>
          </div>

          <div className="grid lg:grid-cols-4 gap-8">
            <div className="lg:col-span-1 order-2 lg:order-1 space-y-8">
              <Card className="border-0 shadow-lg bg-gradient-to-br from-card to-muted/20">
                <CardHeader className="pb-6">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <Sparkles className="h-4 w-4 text-primary" />
                    </div>
                    Quick Start
                  </CardTitle>
                  <CardDescription className="text-sm">Popular questions to get you started</CardDescription>
                </CardHeader>
                <CardContent className="pt-0 space-y-3">
                  {predefinedQuestions.map((question, index) => (
                    <Button
                      key={index}
                      variant="ghost"
                      className="w-full text-left h-auto p-4 justify-start hover:bg-primary/5 hover:border-primary/20 transition-all duration-200 border border-border/40 rounded-lg bg-background/50 backdrop-blur-sm group"
                      onClick={() => handleQuickQuestion(question)}
                    >
                      <div className="text-sm text-left leading-relaxed text-foreground/80 group-hover:text-foreground font-normal whitespace-normal break-words hyphens-auto">
                        {question}
                      </div>
                    </Button>
                  ))}

                  <div className="mt-8 p-4 bg-primary/5 rounded-xl border border-primary/10">
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Sparkles className="h-3 w-3 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground mb-1">Pro Tip</p>
                        <p className="text-xs text-muted-foreground leading-relaxed">
                          Click any question above or use voice chat for instant personalized guidance!
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="h-6"></div>

              {showSettings && (
                <Card className="border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Waveform className="h-5 w-5 text-primary" />
                      Voice Changer Settings
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                      <span className="text-sm font-medium">Voice Response</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setVoiceSettings((prev) => ({ ...prev, enabled: !prev.enabled }))}
                        className="h-8 w-8 p-0"
                      >
                        {voiceSettings.enabled ? (
                          <Volume2 className="h-4 w-4 text-green-600" />
                        ) : (
                          <VolumeX className="h-4 w-4 text-red-500" />
                        )}
                      </Button>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                      <span className="text-sm font-medium">Mute Audio</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={toggleMute}
                        className="h-8 w-8 p-0"
                        disabled={!voiceSettings.enabled}
                      >
                        {voiceSettings.muted ? (
                          <VolumeX className="h-4 w-4 text-red-500" />
                        ) : (
                          <Volume2 className="h-4 w-4 text-green-600" />
                        )}
                      </Button>
                    </div>

                    <div>
                      <label className="text-sm font-medium mb-2 block">Voice Selection</label>
                      <Select
                        value={voiceSettings.voice}
                        onValueChange={(value) => {
                          setVoiceSettings((prev) => ({ ...prev, voice: value }))
                          setTimeout(() => {
                            const selectedVoice = voiceOptions.find((v) => v.id === value)
                            if (selectedVoice) {
                              speakMessage(`Hello, I am ${selectedVoice.name.split(" ")[0]}. This is how I sound.`)
                            }
                          }, 100)
                        }}
                      >
                        <SelectTrigger className="h-10">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {voiceOptions.map((voice) => (
                            <SelectItem key={voice.id} value={voice.id} className="text-sm">
                              {voice.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label className="text-sm font-medium mb-2 block">Voice Effect</label>
                      <Select
                        value={voiceSettings.voiceEffect}
                        onValueChange={(value) => setVoiceSettings((prev) => ({ ...prev, voiceEffect: value }))}
                      >
                        <SelectTrigger className="h-10">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {voiceEffects.map((effect) => (
                            <SelectItem key={effect.id} value={effect.id} className="text-sm">
                              <div className="flex flex-col">
                                <span className="font-medium">{effect.name}</span>
                                <span className="text-xs text-muted-foreground">{effect.description}</span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {voiceSettings.voiceEffect === "normal" && (
                      <>
                        <div>
                          <label className="text-sm font-medium mb-2 block">Speed: {voiceSettings.speed}x</label>
                          <input
                            type="range"
                            min="0.5"
                            max="2"
                            step="0.1"
                            value={voiceSettings.speed}
                            onChange={(e) =>
                              setVoiceSettings((prev) => ({ ...prev, speed: Number.parseFloat(e.target.value) }))
                            }
                            className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
                          />
                        </div>

                        <div>
                          <label className="text-sm font-medium mb-2 block">Pitch: {voiceSettings.pitch}x</label>
                          <input
                            type="range"
                            min="0.5"
                            max="2"
                            step="0.1"
                            value={voiceSettings.pitch}
                            onChange={(e) =>
                              setVoiceSettings((prev) => ({ ...prev, pitch: Number.parseFloat(e.target.value) }))
                            }
                            className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
                          />
                        </div>
                      </>
                    )}

                    <div className="space-y-4 pt-4 border-t">
                      <div>
                        <label className="text-sm font-medium mb-2 block">Reverb: {voiceSettings.reverb}%</label>
                        <input
                          type="range"
                          min="0"
                          max="100"
                          step="5"
                          value={voiceSettings.reverb}
                          onChange={(e) =>
                            setVoiceSettings((prev) => ({ ...prev, reverb: Number.parseInt(e.target.value) }))
                          }
                          className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
                        />
                      </div>

                      <div>
                        <label className="text-sm font-medium mb-2 block">Echo: {voiceSettings.echo}%</label>
                        <input
                          type="range"
                          min="0"
                          max="100"
                          step="5"
                          value={voiceSettings.echo}
                          onChange={(e) =>
                            setVoiceSettings((prev) => ({ ...prev, echo: Number.parseInt(e.target.value) }))
                          }
                          className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
                        />
                      </div>

                      <div>
                        <label className="text-sm font-medium mb-2 block">
                          Distortion: {voiceSettings.distortion}%
                        </label>
                        <input
                          type="range"
                          min="0"
                          max="100"
                          step="5"
                          value={voiceSettings.distortion}
                          onChange={(e) =>
                            setVoiceSettings((prev) => ({ ...prev, distortion: Number.parseInt(e.target.value) }))
                          }
                          className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
                        />
                      </div>
                    </div>

                    <div className="pt-4 border-t">
                      <Button
                        onClick={() =>
                          speakMessage("Testing voice changer with current settings. How does this sound?")
                        }
                        variant="outline"
                        className="w-full mb-3"
                        disabled={!voiceSettings.enabled || voiceSettings.muted}
                      >
                        <Volume2 className="h-4 w-4 mr-2" />
                        Test Voice Effect
                      </Button>

                      <Button
                        onClick={handleVoiceToVoice}
                        disabled={isProcessingVoice || !recognitionRef.current}
                        className="w-full h-12"
                        variant={isVoiceToVoice ? "destructive" : "default"}
                      >
                        {isProcessingVoice ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                            Processing...
                          </>
                        ) : isVoiceToVoice ? (
                          <>
                            <MicOff className="h-4 w-4 mr-2" />
                            Stop Voice Chat
                          </>
                        ) : (
                          <>
                            <Mic className="h-4 w-4 mr-2" />
                            Start Voice Chat
                          </>
                        )}
                      </Button>
                      <p className="text-xs text-muted-foreground mt-2 text-center">
                        Speak naturally and get instant voice responses with effects
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            <div className="lg:col-span-3 order-1 lg:order-2">
              <Card className="border-0 shadow-xl bg-gradient-to-br from-card to-muted/10 h-[700px] flex flex-col">
                <CardHeader className="border-b bg-gradient-to-r from-primary/5 to-blue-500/5 flex-shrink-0">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Sparkles className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <CardTitle className="text-xl">AI Career Mentor</CardTitle>
                        <CardDescription className="text-sm">
                          {isListening ? "🎤 Listening..." : "Ready to help with your career questions"}
                        </CardDescription>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm" onClick={toggleMute} className="h-8 w-8 p-0">
                        {voiceSettings.muted ? (
                          <VolumeX className="h-4 w-4 text-red-500" />
                        ) : (
                          <Volume2 className="h-4 w-4 text-green-600" />
                        )}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowSettings(!showSettings)}
                        className="h-8 w-8 p-0"
                      >
                        <Waveform className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={clearChat}>
                        Clear
                      </Button>
                      <Button variant="ghost" size="sm" onClick={exportChat}>
                        Export
                      </Button>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="flex-1 overflow-hidden p-0 flex flex-col">
                  <div className="flex-1 overflow-y-auto p-6 space-y-4">
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"} animate-in slide-in-from-bottom-2 duration-300`}
                      >
                        <div
                          className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                            message.sender === "user"
                              ? "bg-primary text-primary-foreground ml-4"
                              : "bg-muted text-muted-foreground mr-4"
                          } ${message.isVoice ? "border-2 border-primary/30" : ""}`}
                        >
                          <div className="flex items-start gap-2">
                            {message.sender === "ai" && (
                              <div className="w-6 h-6 rounded-full bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                                <Sparkles className="h-3 w-3 text-white" />
                              </div>
                            )}
                            <div className="flex-1">
                              {message.isTyping ? (
                                <TypewriterText text={message.content} />
                              ) : (
                                <p className="text-sm leading-relaxed">{message.content}</p>
                              )}
                              <div className="flex items-center justify-between mt-2">
                                <span className="text-xs opacity-60">
                                  {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                                  {message.isVoice && " 🎤"}
                                </span>
                                <Button
                                  onClick={() => copyMessage(message.content)}
                                  variant="ghost"
                                  size="sm"
                                  className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                  📋
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                    {isLoading && <TypingAnimation />}
                    <div ref={messagesEndRef} />
                  </div>

                  <div className="border-t bg-background/50 backdrop-blur-sm p-4 flex-shrink-0">
                    <div className="flex gap-3">
                      <div className="flex-1 relative">
                        <input
                          type="text"
                          value={inputMessage}
                          onChange={(e) => setInputMessage(e.target.value)}
                          onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                          placeholder={isListening ? "Listening..." : "Ask about careers, colleges, or studies..."}
                          className="w-full px-4 py-3 pr-12 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200"
                          disabled={isListening || isLoading}
                        />
                        <Button
                          onClick={isListening ? stopListening : startListening}
                          variant="ghost"
                          size="sm"
                          className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 p-0"
                          disabled={!recognitionRef.current}
                        >
                          {isListening ? (
                            <MicOff className="h-4 w-4 text-red-500 animate-pulse" />
                          ) : (
                            <Mic className="h-4 w-4 text-muted-foreground hover:text-primary" />
                          )}
                        </Button>
                      </div>
                      <Button
                        onClick={handleSendMessage}
                        disabled={!inputMessage.trim() || isLoading}
                        className="px-6 py-3 rounded-xl"
                      >
                        {isLoading ? (
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        ) : (
                          "Send"
                        )}
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2 text-center">
                      Press Enter to send • Click mic for voice input • Use voice chat for hands-free conversation
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
