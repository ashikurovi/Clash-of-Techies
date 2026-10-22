"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import {
  Clock,
  User,
  Hash,
  AlertTriangle,
  Zap,
  Send,
  ChevronLeft,
  ChevronRight,
  Lock,
  Cpu,
  Network,
  Code2,
  CheckCircle2,
  Building,
} from "lucide-react"
import { Question, UserData } from "@/lib/quiz-data"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

interface QuizInterfaceProps {
  userData: UserData
  questions: Question[]
  answers: Record<number, number>
  timeRemaining: number
  onAnswerSelect: (questionId: number, optionIndex: number) => void
  onSubmit: () => void
  tabSwitchCount: number
}

export default function QuizInterface({
  userData,
  questions,
  answers,
  timeRemaining,
  onAnswerSelect,
  onSubmit,
  tabSwitchCount,
}: QuizInterfaceProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const answeredCount = Object.keys(answers).length
  const isCriticalTime = timeRemaining <= 120 // 2 minutes
  const isWarningTime = timeRemaining <= 300 && !isCriticalTime // 5 minutes
  const currentQuestion = questions[currentQuestionIndex] || questions[0]
  const isCurrentAnswered = currentQuestion && answers[currentQuestion.id] !== undefined

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
    }
  }

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1)
    }
  }

  const handleQuestionJump = (index: number) => {
    setCurrentQuestionIndex(index)
  }

  const getCategoryBadge = (category: string) => {
    if (category === "Hardware") {
      return {
        label: "Hardware",
        labelBn: "হার্ডওয়্যার ও আর্কিটেকচার",
        icon: Cpu,
        color: "text-purple-600 dark:text-purple-400",
        bg: "bg-purple-500/10 border-purple-500/30",
      }
    }
    if (category === "Networking") {
      return {
        label: "Networking",
        labelBn: "কম্পিউটার নেটওয়ার্কিং",
        icon: Network,
        color: "text-amber-600 dark:text-amber-400",
        bg: "bg-amber-500/10 border-amber-500/30",
      }
    }
    return {
      label: "Software",
      labelBn: "সফটওয়্যার ইঞ্জিনিয়ারিং",
      icon: Code2,
      color: "text-violet-600 dark:text-violet-400",
      bg: "bg-violet-500/10 border-violet-500/30",
    }
  }

  const catMeta = getCategoryBadge(currentQuestion?.category || "")
  const CategoryIcon = catMeta.icon

  return (
    <div className="min-h-screen bg-background select-none tech-grid-pattern flex flex-col">
      {/* Top Header Bar */}
      <header className="sticky top-0 z-40 backdrop-blur-md bg-card/90 border-b border-border shadow-sm">
        <div className="container mx-auto px-4 py-2.5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            {/* Branding & User Info */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-gradient-to-r from-purple-500/15 to-amber-500/15 border border-purple-500/20 font-black text-xs text-foreground">
                <Zap className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                <span className="hidden sm:inline">CLASH OF TECHIES</span>
              </div>

              <div className="flex items-center gap-2 pl-1 border-l border-border text-xs">
                <div className="flex items-center gap-1 text-foreground font-medium">
                  <User className="w-3.5 h-3.5 text-purple-500" />
                  <span className="truncate max-w-[100px] sm:max-w-[140px]">{userData.n}</span>
                </div>
                <div className="flex items-center gap-1 text-muted-foreground font-mono">
                  <Hash className="w-3 h-3" />
                  <span>{userData.r}</span>
                </div>
                {userData.dept && (
                  <div className="hidden md:flex items-center gap-1 text-muted-foreground">
                    <Building className="w-3 h-3" />
                    <span className="truncate max-w-[120px]">{userData.dept}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Timer & Warnings */}
            <div className="flex items-center gap-2.5">
              {/* Anti-cheat tab alert */}
              {tabSwitchCount > 0 && (
                <div className="flex items-center gap-1.5 px-2.5 py-1 bg-red-500/15 text-red-600 dark:text-red-400 border border-red-500/30 rounded-lg text-xs font-bold animate-pulse">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>ট্যাব পরিবর্তন: {tabSwitchCount}/2</span>
                </div>
              )}

              {/* Countdown Timer */}
              <div
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl font-mono text-sm sm:text-base font-bold shadow-sm transition-all border ${
                  isCriticalTime
                    ? "bg-red-500/20 text-red-600 dark:text-red-400 border-red-500/40 animate-pulse"
                    : isWarningTime
                    ? "bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30"
                    : "bg-purple-500/15 text-purple-600 dark:text-purple-400 border-purple-500/30"
                }`}
              >
                <Clock className="w-4 h-4" />
                <span>{formatTime(timeRemaining)}</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Quiz Area */}
      <main className="container mx-auto px-4 py-6 md:py-8 flex-1 max-w-4xl space-y-6">
        {/* Progress Tracker Card */}
        <div className="p-3.5 sm:p-4 rounded-2xl bg-card/80 border border-border shadow-sm backdrop-blur-sm space-y-2.5">
          <div className="flex items-center justify-between text-xs sm:text-sm">
            <div className="flex items-center gap-2 font-semibold text-foreground">
              <span>প্রশ্ন {currentQuestionIndex + 1} / {questions.length}</span>
              <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold border ${catMeta.bg} ${catMeta.color}`}>
                <CategoryIcon className="w-3 h-3" />
                {catMeta.labelBn}
              </span>
            </div>
            <div className="text-muted-foreground font-medium">
              উত্তর সম্পন্ন: <strong className="text-purple-600 dark:text-purple-400">{answeredCount}</strong> / {questions.length}
            </div>
          </div>

          <div className="w-full h-2.5 bg-secondary rounded-full overflow-hidden p-0.5">
            <div
              className="h-full bg-gradient-to-r from-purple-600 via-violet-600 to-amber-500 rounded-full transition-all duration-300"
              style={{ width: `${(answeredCount / questions.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Current Question Card */}
        {currentQuestion && (
          <Card className="border border-purple-500/30 shadow-xl bg-card/95 overflow-hidden">
            <div className="h-1.5 bg-gradient-to-r from-purple-600 via-amber-500 to-purple-600" />
            <CardHeader className="pb-4">
              <div className="flex items-start gap-3 sm:gap-4">
                <span className="flex items-center justify-center w-9 h-9 sm:w-11 sm:h-11 rounded-2xl bg-gradient-to-tr from-purple-600 to-violet-500 text-white text-base sm:text-lg font-black shadow-md flex-shrink-0 mt-0.5">
                  {currentQuestionIndex + 1}
                </span>
                <div className="space-y-1.5 pt-0.5">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                      {currentQuestion.category} Question
                    </span>
                    {isCurrentAnswered && (
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-600 dark:text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full">
                        <Lock className="w-3 h-3" /> লক করা
                      </span>
                    )}
                  </div>
                  <CardTitle className="text-lg sm:text-xl md:text-2xl text-foreground font-bold leading-relaxed">
                    {currentQuestion.q}
                  </CardTitle>
                </div>
              </div>
            </CardHeader>

            <CardContent className="pt-2 pb-6">
              <RadioGroup
                value={answers[currentQuestion.id] !== undefined ? answers[currentQuestion.id].toString() : ""}
                onValueChange={(value) => {
                  if (answers[currentQuestion.id] === undefined) {
                    onAnswerSelect(currentQuestion.id, parseInt(value))
                  }
                }}
                className="space-y-3"
              >
                {currentQuestion.o.map((option, optionIndex) => {
                  const isSelected = answers[currentQuestion.id] === optionIndex
                  const isAnswered = answers[currentQuestion.id] !== undefined

                  return (
                    <div
                      key={optionIndex}
                      onClick={() => {
                        if (!isAnswered) {
                          onAnswerSelect(currentQuestion.id, optionIndex)
                        }
                      }}
                      className={`relative flex items-center gap-3.5 p-4 rounded-xl border transition-all duration-200 ${
                        isAnswered
                          ? isSelected
                            ? "bg-purple-500/15 border-purple-500/60 shadow-sm"
                            : "opacity-60 bg-secondary/30 border-border cursor-not-allowed"
                          : "hover:bg-purple-500/5 hover:border-purple-500/40 cursor-pointer border-border active:scale-[0.99]"
                      }`}
                    >
                      <RadioGroupItem
                        value={optionIndex.toString()}
                        id={`q${currentQuestion.id}-o${optionIndex}`}
                        className="border-purple-500 text-purple-600"
                        disabled={isAnswered}
                      />
                      <Label
                        htmlFor={`q${currentQuestion.id}-o${optionIndex}`}
                        className={`flex-1 text-sm sm:text-base font-medium leading-relaxed ${
                          isAnswered ? "cursor-not-allowed" : "cursor-pointer"
                        } text-foreground`}
                      >
                        {option}
                      </Label>
                      {isSelected && (
                        <div className="flex items-center gap-1 text-xs font-bold text-purple-600 dark:text-purple-400">
                          <CheckCircle2 className="w-4 h-4" />
                          <span className="hidden sm:inline">নির্বাচিত</span>
                        </div>
                      )}
                    </div>
                  )
                })}
              </RadioGroup>
            </CardContent>
          </Card>
        )}

        {/* Quick Question Jump Matrix */}
        <Card className="border border-border/80 shadow-sm bg-card/90">
          <CardHeader className="pb-3 pt-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                প্রশ্ন নেভিগেশন গ্রিড (১ - {questions.length})
              </span>
              <div className="flex items-center gap-3 text-xs">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-purple-600" />
                  <span className="text-muted-foreground">উত্তর দেওয়া</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-secondary border border-border" />
                  <span className="text-muted-foreground">বাকি আছে</span>
                </span>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-0 pb-4">
            <div className="grid grid-cols-6 sm:grid-cols-10 gap-2">
              {questions.map((q, index) => {
                const isAns = answers[q.id] !== undefined
                const isCurr = currentQuestionIndex === index

                return (
                  <button
                    key={q.id}
                    onClick={() => handleQuestionJump(index)}
                    className={`h-9 sm:h-10 rounded-xl font-bold text-xs sm:text-sm transition-all duration-150 flex items-center justify-center relative ${
                      isCurr
                        ? "ring-2 ring-amber-500 bg-amber-500 text-slate-950 font-black shadow-md scale-105"
                        : isAns
                        ? "bg-purple-600 text-white shadow-sm hover:bg-purple-700"
                        : "bg-secondary text-foreground hover:bg-muted border border-border"
                    }`}
                  >
                    {index + 1}
                  </button>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </main>

      {/* Fixed Bottom Action Bar */}
      <footer className="sticky bottom-0 z-40 backdrop-blur-md bg-card/95 border-t border-border shadow-lg mt-auto">
        <div className="container mx-auto px-4 py-3">
          <div className="max-w-4xl mx-auto flex items-center justify-between gap-3">
            <div className="hidden sm:flex items-center gap-2 text-xs text-muted-foreground">
              <Zap className="w-4 h-4 text-purple-600" />
              <span>Clash of Techies 2026 | Polytechnic Coders × CPI Timeline</span>
            </div>

            <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto justify-between sm:justify-end">
              <Button
                onClick={handlePrevious}
                disabled={currentQuestionIndex === 0}
                variant="outline"
                className="h-10 px-3.5 text-xs sm:text-sm font-semibold border-border"
              >
                <ChevronLeft className="w-4 h-4 mr-1" />
                আগের প্রশ্ন
              </Button>

              <Button
                onClick={handleNext}
                disabled={currentQuestionIndex === questions.length - 1}
                variant="outline"
                className="h-10 px-3.5 text-xs sm:text-sm font-semibold border-border"
              >
                পরবর্তী প্রশ্ন
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>

              {/* Submit with Confirmation Dialog */}
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button className="h-10 px-5 text-xs sm:text-sm font-bold bg-gradient-to-r from-purple-600 to-amber-500 hover:from-purple-700 hover:to-amber-600 text-white shadow-md">
                    <Send className="w-3.5 h-3.5 mr-1.5" />
                    সাবমিট
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle className="text-xl font-bold flex items-center gap-2">
                      <Zap className="w-5 h-5 text-amber-500" />
                      আপনি কি কুইজ জমা দিতে চান?
                    </AlertDialogTitle>
                    <AlertDialogDescription className="space-y-2 pt-2 text-sm text-foreground/80">
                      <div>
                        আপনি মোট <strong>{questions.length}</strong> টির মধ্যে <strong>{answeredCount}</strong> টি প্রশ্নের উত্তর দিয়েছেন।
                      </div>
                      {answeredCount < questions.length && (
                        <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-800 dark:text-amber-300 text-xs">
                          ⚠️ এখনো {questions.length - answeredCount} টি প্রশ্ন অনুত্তরিত রয়েছে! সাবমিট করার পর আর উত্তর পরিবর্তন করা যাবে না।
                        </div>
                      )}
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>ফিরে যান</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={onSubmit}
                      className="bg-purple-600 hover:bg-purple-700 text-white font-bold"
                    >
                      হ্যাঁ, সাবমিট করুন
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
