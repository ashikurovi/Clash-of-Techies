"use client"

import { useState, useEffect, useCallback } from "react"
import LandingPage from "@/components/quiz/landing-page"
import QuizInterface from "@/components/quiz/quiz-interface"
import ThankYouPage from "@/components/quiz/thank-you-page"
import { useAntiCheat } from "@/hooks/use-anti-cheat"
import { questions, UserData, QuizState, QUIZ_CONFIG } from "@/lib/quiz-data"

export default function QuizApp() {
  const [st, setSt] = useState<QuizState>("landing")
  const [ud, setUd] = useState<UserData>({ n: "", r: "", dept: "" })
  const [ans, setAns] = useState<Record<number, number>>({})
  const [sc, setSc] = useState(0)
  const [tm, setTm] = useState(QUIZ_CONFIG.durationSeconds)

  // Check if participant already submitted previously
  useEffect(() => {
    try {
      const saved = localStorage.getItem("clash_of_techies_2026_submission")
      if (saved) {
        const parsed = JSON.parse(saved)
        if (parsed && parsed.submitted) {
          setUd({ n: parsed.name, r: parsed.roll, dept: parsed.dept || "" })
          setSc(parsed.score || 0)
          setAns(parsed.answers || {})
          setSt("completed")
        }
      }
    } catch (e) {
      console.error("Error reading saved submission", e)
    }
  }, [])

  const saveSubmission = (scoreVal: number, currentAnswers: Record<number, number>) => {
    try {
      localStorage.setItem(
        "clash_of_techies_2026_submission",
        JSON.stringify({
          submitted: true,
          name: ud.n,
          roll: ud.r,
          dept: ud.dept || "",
          score: scoreVal,
          answers: currentAnswers,
          submittedAt: new Date().toISOString(),
        })
      )
    } catch (e) {
      console.error("Failed to save submission locally", e)
    }
  }

  const hAuto = useCallback(() => {
    let c = 0
    questions.forEach((q) => {
      if (ans[q.id] === q.a) c++
    })
    setSc(c)
    saveSubmission(c, ans)
    setSt("completed")
  }, [ans, ud])

  const { tabSwitchCount } = useAntiCheat(st === "quiz", hAuto)

  const hStart = (n: string, r: string, dept?: string) => {
    // Check if roll or device has already submitted
    try {
      const saved = localStorage.getItem("clash_of_techies_2026_submission")
      if (saved) {
        const parsed = JSON.parse(saved)
        if (parsed && parsed.submitted) {
          setUd({ n: parsed.name, r: parsed.roll, dept: parsed.dept || "" })
          setSc(parsed.score || 0)
          setAns(parsed.answers || {})
          setSt("completed")
          return
        }
      }
    } catch {}

    setUd({ n, r, dept: dept || "" })
    setSt("quiz")
  }

  const hSelect = (id: number, idx: number) => {
    // Only set if not already selected (one-time lock)
    setAns((p) => {
      if (p[id] !== undefined) {
        return p
      }
      return { ...p, [id]: idx }
    })
  }

  const hSub = () => {
    let c = 0
    questions.forEach((q) => {
      if (ans[q.id] === q.a) c++
    })
    setSc(c)
    saveSubmission(c, ans)
    setSt("completed")
  }

  useEffect(() => {
    if (st !== "quiz") return
    const t = setInterval(() => {
      setTm((p) => {
        if (p <= 1) {
          clearInterval(t)
          hAuto()
          return 0
        }
        return p - 1
      })
    }, 1000)
    return () => clearInterval(t)
  }, [st, hAuto])

  return (
    <main className="min-h-screen bg-background">
      {st === "landing" && (
        <LandingPage
          onStartQuiz={hStart}
          onViewResult={() => setSt("completed")}
        />
      )}
      {st === "quiz" && (
        <QuizInterface
          userData={ud}
          questions={questions}
          answers={ans}
          timeRemaining={tm}
          onAnswerSelect={hSelect}
          onSubmit={hSub}
          tabSwitchCount={tabSwitchCount}
        />
      )}
      {st === "completed" && (
        <ThankYouPage
          userData={ud}
          score={sc}
          totalQuestions={questions.length}
          answers={ans}
          onBackToHome={() => setSt("landing")}
        />
      )}
    </main>
  )
}
