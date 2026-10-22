"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Cpu,
  Network,
  Code2,
  Lightbulb,
  Trophy,
  Clock,
  ShieldAlert,
  Sparkles,
  Zap,
  Gift,
  CheckCircle2,
  Award,
  Medal,
  Terminal,
  BookOpen,
  Calendar,
  Target,
  BatteryCharging,
  Headphones,
  Ticket,
  Lock,
  Unlock,
  ShieldCheck,
} from "lucide-react"
import {
  TOPICS_DATA,
  PRIZES_DATA,
  RULES_DATA,
  QUIZ_CONFIG,
  COMPETITION_SCHEDULE,
  SPECIAL_GIFT,
  REGISTRATION_LOCK_TIME_TODAY,
  REGISTRATION_REOPEN_TIME,
} from "@/lib/quiz-data"

interface LandingPageProps {
  onStartQuiz: (name: string, roll: string, dept?: string) => void
  onViewResult?: () => void
}

export default function LandingPage({ onStartQuiz, onViewResult }: LandingPageProps) {
  const [name, setName] = useState("")
  const [roll, setRoll] = useState("")
  const [dept, setDept] = useState("")
  const [alreadySubmitted, setAlreadySubmitted] = useState<{
    name: string
    roll: string
    dept?: string
    score: number
    submittedAt?: string
  } | null>(null)

  useEffect(() => {
    try {
      const saved = localStorage.getItem("clash_of_techies_2026_submission")
      if (saved) {
        const parsed = JSON.parse(saved)
        if (parsed && parsed.submitted) {
          setAlreadySubmitted(parsed)
        }
      }
    } catch (e) {
      console.error(e)
    }
  }, [])

  // Schedule state:
  // Phase 1: now < lockToday (Before 6 PM today) -> Form is OPEN! Countdown to 6 PM lock.
  // Phase 2: now >= lockToday && now < reopenTime (From 6 PM today until 23 Oct 8 PM) -> Form is LOCKED! Countdown to 23 Oct 8 PM.
  // Phase 3: now >= reopenTime (23 Oct 8 PM onward) -> Form is LIVE!
  const [scheduleState, setScheduleState] = useState<{
    phase: "open_today" | "locked_waiting" | "live_quiz"
    isFormOpen: boolean
    days: number
    hours: number
    minutes: number
    seconds: number
  }>({
    phase: "open_today",
    isFormOpen: true,
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  })

  // Developer / testing override option (?unlock=true)
  const [devOverride, setDevOverride] = useState(false)

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search)
      if (params.get("unlock") === "true" || params.get("test") === "true") {
        setDevOverride(true)
      }
    }

    const updateSchedule = () => {
      const now = Date.now()
      const lockToday = new Date(REGISTRATION_LOCK_TIME_TODAY).getTime()
      const reopenTime = new Date(REGISTRATION_REOPEN_TIME).getTime()

      if (now < lockToday) {
        // OPEN until 6 PM today!
        const diff = lockToday - now
        const hours = Math.floor(diff / (1000 * 60 * 60))
        const minutes = Math.floor((diff / (1000 * 60)) % 60)
        const seconds = Math.floor((diff / 1000) % 60)

        setScheduleState({
          phase: "open_today",
          isFormOpen: true,
          days: 0,
          hours,
          minutes,
          seconds,
        })
      } else if (now < reopenTime) {
        // LOCKED from 6 PM today until 23 Oct 8 PM!
        const diff = reopenTime - now
        const days = Math.floor(diff / (1000 * 60 * 60 * 24))
        const hours = Math.floor((diff / (1000 * 60 * 60)) % 24)
        const minutes = Math.floor((diff / (1000 * 60)) % 60)
        const seconds = Math.floor((diff / 1000) % 60)

        setScheduleState({
          phase: "locked_waiting",
          isFormOpen: false,
          days,
          hours,
          minutes,
          seconds,
        })
      } else {
        // LIVE on 23 Oct 8 PM onward!
        setScheduleState({
          phase: "live_quiz",
          isFormOpen: true,
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0,
        })
      }
    }

    updateSchedule()
    const timer = setInterval(updateSchedule, 1000)
    return () => clearInterval(timer)
  }, [])

  const isFormUnlocked = scheduleState.isFormOpen || devOverride
  const isFormValid = name.trim() !== "" && roll.trim() !== "" && isFormUnlocked

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (isFormValid) {
      onStartQuiz(name.trim(), roll.trim(), dept.trim())
    }
  }

  return (
    <div className="min-h-screen bg-background relative overflow-hidden tech-grid-pattern selection:bg-purple-500 selection:text-white">
      {/* Ambient background gradients */}
      <div className="absolute top-0 left-1/4 -translate-x-1/2 w-96 h-96 bg-purple-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 right-10 w-96 h-96 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-20 left-10 w-96 h-96 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Organizers Nav */}
      <header className="sticky top-0 z-40 backdrop-blur-md bg-background/85 border-b border-border/60">
        <div className="container mx-auto px-4 py-3 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="relative w-10 h-10 rounded-xl overflow-hidden shadow-md ring-2 ring-purple-500/40 bg-purple-950/20 flex-shrink-0">
              <Image
                src="/polytechnic-coders-logo.png"
                alt="Polytechnic Coders Logo"
                fill
                className="object-cover"
                priority
              />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-sm md:text-base tracking-tight text-foreground">
                  Polytechnic Coders
                </span>
                <span className="text-[10px] uppercase font-semibold px-1.5 py-0.5 rounded bg-purple-500/15 text-purple-600 dark:text-purple-400">
                  Organizer
                </span>
              </div>
              <p className="text-[11px] text-muted-foreground font-medium">By Programming Hero</p>
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/80 border border-border text-xs font-semibold text-muted-foreground">
            <Zap className="w-3.5 h-3.5 text-amber-500 animate-pulse" />
            <span>CLASH OF TECHIES 2026</span>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right">
              <div className="flex items-center justify-end gap-1.5">
                <span className="font-bold text-sm md:text-base tracking-tight text-foreground">
                  CPI Timeline
                </span>
                <span className="text-[10px] uppercase font-semibold px-1.5 py-0.5 rounded bg-red-500/15 text-red-600 dark:text-red-400">
                  Organizer
                </span>
              </div>
              <p className="text-[11px] text-muted-foreground font-medium">Chittagong Polytechnic</p>
            </div>
            <div className="relative w-10 h-10 rounded-xl overflow-hidden shadow-md ring-2 ring-red-500/40 bg-red-950/20 flex-shrink-0">
              <Image
                src="/cpi-timeline-logo.png"
                alt="CPI Timeline Logo"
                fill
                className="object-cover"
                priority
              />
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 md:py-12 relative z-10">
        {/* Hero Section */}
        <div className="max-w-5xl mx-auto text-center mb-8">
          {/* Partnership Pill */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-purple-500/15 via-amber-500/15 to-red-500/15 border border-purple-500/30 text-xs md:text-sm font-semibold text-foreground mb-6 shadow-sm">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>Polytechnic Coders</span>
            <span className="text-muted-foreground">×</span>
            <span>CPI Timeline যৌথ আয়োজন</span>
          </div>

          {/* Main Title */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tight mb-4">
            <span className="text-foreground">Clash</span>{" "}
            <span className="text-amber-500 relative inline-block">
              of Techies
              <span className="absolute -bottom-1 left-0 right-0 h-1.5 bg-gradient-to-r from-amber-400 via-yellow-400 to-purple-600 rounded-full" />
            </span>{" "}
            <span className="text-purple-600 dark:text-purple-400 text-3xl sm:text-4xl md:text-5xl align-top font-bold">
              2026
            </span>
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mt-4 leading-relaxed font-normal">
            পলিটেকনিক শিক্ষার্থীদের কম্পিউটার হার্ডওয়্যার, নেটওয়ার্কিং ও সফটওয়্যার ইঞ্জিনিয়ারিং জ্ঞানের মহাযুদ্ধ!
            অংশগ্রহণ করুন এবং জিতে নিন আকর্ষণীয় টেক গ্যাজেটস ও গিফট ভাউচার!
          </p>

          {/* 📑 Competition Details Schedule Card */}
          <div className="max-w-4xl mx-auto mt-8 p-5 sm:p-6 rounded-3xl bg-card/90 border border-purple-500/30 backdrop-blur-md shadow-xl glow-purple text-left">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-5 pb-4 border-b border-border/80">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-purple-500/15 text-purple-600 dark:text-purple-400 flex items-center justify-center font-bold text-xl shadow-inner">
                  📑
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-extrabold text-foreground tracking-tight">
                    Competition Details
                  </h3>
                  <p className="text-xs text-muted-foreground">প্রতিযোগিতার সময়সূচি ও নিয়মাবলী</p>
                </div>
              </div>
              <span className="px-3.5 py-1 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 text-xs font-bold border border-emerald-500/30 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                {scheduleState.phase === "open_today"
                  ? "আজকে সন্ধ্যা ৬টা পর্যন্ত খোলা"
                  : scheduleState.phase === "locked_waiting"
                  ? "২৩ অক্টোবর রাত ৮টায় লাইভ"
                  : "লাইভ কুইজ চলছে"}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
              {/* Date */}
              <div className="p-4 rounded-2xl bg-secondary/60 border border-border/80 flex items-center gap-3.5 hover:bg-secondary/90 transition-all">
                <div className="w-11 h-11 rounded-xl bg-amber-500/15 text-amber-600 dark:text-amber-400 flex items-center justify-center text-xl flex-shrink-0">
                  <Calendar className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-[11px] uppercase tracking-wider text-muted-foreground font-bold">
                    📅 Date
                  </div>
                  <div className="text-sm sm:text-base font-black text-foreground">
                    {COMPETITION_SCHEDULE.date}
                  </div>
                  <div className="text-[11px] text-muted-foreground font-medium">
                    {COMPETITION_SCHEDULE.dateBn}
                  </div>
                </div>
              </div>

              {/* Time */}
              <div className="p-4 rounded-2xl bg-secondary/60 border border-border/80 flex items-center gap-3.5 hover:bg-secondary/90 transition-all">
                <div className="w-11 h-11 rounded-xl bg-purple-500/15 text-purple-600 dark:text-purple-400 flex items-center justify-center text-xl flex-shrink-0">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-[11px] uppercase tracking-wider text-muted-foreground font-bold">
                    ⏱️ Time
                  </div>
                  <div className="text-sm sm:text-base font-black text-foreground">
                    {COMPETITION_SCHEDULE.time}
                  </div>
                  <div className="text-[11px] text-muted-foreground font-medium">
                    {COMPETITION_SCHEDULE.timeBn}
                  </div>
                </div>
              </div>

              {/* Format */}
              <div className="p-4 rounded-2xl bg-secondary/60 border border-border/80 flex items-center gap-3.5 hover:bg-secondary/90 transition-all">
                <div className="w-11 h-11 rounded-xl bg-rose-500/15 text-rose-600 dark:text-rose-400 flex items-center justify-center text-xl flex-shrink-0">
                  <Target className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-[11px] uppercase tracking-wider text-muted-foreground font-bold">
                    🎯 Format
                  </div>
                  <div className="text-sm sm:text-base font-black text-foreground">
                    {COMPETITION_SCHEDULE.format}
                  </div>
                  <div className="text-[11px] text-muted-foreground font-medium">
                    ৩০টি MCQ • ২০ মিনিট সময়
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 md:gap-4 max-w-4xl mx-auto mt-6">
            <div className="p-4 rounded-2xl bg-card/80 border border-purple-500/20 shadow-sm backdrop-blur-sm text-left">
              <div className="w-9 h-9 rounded-xl bg-purple-500/15 text-purple-600 dark:text-purple-400 flex items-center justify-center mb-2">
                <Terminal className="w-5 h-5" />
              </div>
              <div className="text-2xl font-bold text-foreground">৩০ টি</div>
              <div className="text-xs text-muted-foreground font-medium">টেকনিক্যাল MCQ প্রশ্ন</div>
            </div>

            <div className="p-4 rounded-2xl bg-card/80 border border-amber-500/20 shadow-sm backdrop-blur-sm text-left">
              <div className="w-9 h-9 rounded-xl bg-amber-500/15 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-2">
                <Clock className="w-5 h-5" />
              </div>
              <div className="text-2xl font-bold text-foreground">২০ মিনিট</div>
              <div className="text-xs text-muted-foreground font-medium">বরাদ্দকৃত সময়সীমা</div>
            </div>

            <div className="p-4 rounded-2xl bg-card/80 border border-rose-500/20 shadow-sm backdrop-blur-sm text-left">
              <div className="w-9 h-9 rounded-xl bg-rose-500/15 text-rose-600 dark:text-rose-400 flex items-center justify-center mb-2">
                <Gift className="w-5 h-5" />
              </div>
              <div className="text-2xl font-bold text-foreground">টপ গ্যাজেট</div>
              <div className="text-xs text-muted-foreground font-medium">UPS, পাওয়ার ব্যাংক, হেডফোন</div>
            </div>

            <div className="p-4 rounded-2xl bg-card/80 border border-emerald-500/20 shadow-sm backdrop-blur-sm text-left">
              <div className="w-9 h-9 rounded-xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-2">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <div className="text-2xl font-bold text-foreground">অ্যান্টি-চিট</div>
              <div className="text-xs text-muted-foreground font-medium">ট্যাব সুইচ প্রটেকশন</div>
            </div>
          </div>
        </div>

        <div className="max-w-5xl mx-auto space-y-14">
          {/* ✨ Prize-pool Details Section */}
          <section className="relative">
            <div className="text-center mb-10">
              <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-amber-500/15 text-amber-700 dark:text-amber-400 text-xs font-bold uppercase tracking-wider mb-2 border border-amber-500/30">
                <Sparkles className="w-3.5 h-3.5" />
                ✨ Prize-pool Details
              </div>
              <h2 className="text-2xl md:text-4xl font-black text-foreground">
                বিজয়ীদের জন্য বিশেষ উপহার ও পুরস্কার
              </h2>
              <p className="text-muted-foreground text-sm max-w-xl mx-auto mt-2">
                টপ বিজয়ীদের জন্য থাকছে আকর্ষণীয় টেক গ্যাজেটস ও স্পেশাল গিফট সামগ্রী
              </p>
            </div>

            {/* 3 Main Prizes Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {PRIZES_DATA.map((prize, idx) => {
                const isChampion = idx === 0
                const isRunnerUp1 = idx === 1
                const GadgetIcon = isChampion ? BatteryCharging : isRunnerUp1 ? Zap : Headphones

                return (
                  <Card
                    key={idx}
                    className={`border ${prize.borderGlow} bg-card/90 shadow-xl relative overflow-hidden transition-all duration-300 hover:-translate-y-2 flex flex-col justify-between ${
                      isChampion ? "ring-2 ring-amber-500/50 md:-translate-y-3" : ""
                    }`}
                  >
                    {isChampion && (
                      <div className="bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 text-center py-1.5 text-xs font-black tracking-widest uppercase shadow-sm">
                        ★ TOP CHAMPION PRIZE ★
                      </div>
                    )}

                    <div>
                      <CardHeader className="text-center pb-2 pt-6">
                        <div className="flex justify-center mb-3">
                          <div
                            className={`w-16 h-16 rounded-2xl bg-gradient-to-tr ${prize.badgeColor} flex items-center justify-center shadow-lg text-white`}
                          >
                            {idx === 0 ? (
                              <Trophy className="w-8 h-8" />
                            ) : idx === 1 ? (
                              <Medal className="w-8 h-8" />
                            ) : (
                              <Award className="w-8 h-8" />
                            )}
                          </div>
                        </div>

                        <span className="text-xs font-black text-muted-foreground uppercase tracking-widest">
                          {prize.rank}
                        </span>

                        <CardTitle className="text-xl sm:text-2xl font-black text-foreground mt-1">
                          {prize.title}
                        </CardTitle>

                        {/* Highlighted Main Prize Box */}
                        <div className="mt-4 p-3.5 rounded-xl bg-gradient-to-r from-purple-500/10 via-amber-500/10 to-purple-500/10 border border-purple-500/30 flex items-center justify-center gap-2.5">
                          <GadgetIcon className="w-5 h-5 text-amber-500 flex-shrink-0 animate-bounce" />
                          <span className="text-lg sm:text-xl font-black text-foreground">
                            {prize.mainPrize}
                          </span>
                        </div>
                      </CardHeader>

                      <CardContent className="pt-2">
                        <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2 text-center">
                          ইনক্লুডেড গিফট প্যাকেজ:
                        </div>
                        <ul className="space-y-2.5 pt-1">
                          {prize.gifts.map((gift, gIdx) => (
                            <li key={gIdx} className="flex items-start gap-2.5 text-xs sm:text-sm text-foreground/90">
                              <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                              <span className={gIdx === 0 ? "font-bold text-foreground" : ""}>
                                {gift}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </div>

                    <div className="p-4 pt-0">
                      <div className="text-center text-[11px] text-muted-foreground font-medium py-2 rounded-lg bg-secondary/50">
                        {isChampion ? "🥇 চ্যাম্পিয়ন অ্যাওয়ার্ড" : isRunnerUp1 ? "🥈 ১ম রানার আপ অ্যাওয়ার্ড" : "🥉 ২য় রানার আপ অ্যাওয়ার্ড"}
                      </div>
                    </div>
                  </Card>
                )
              })}
            </div>

            {/* 🏅 Special Gift from ChipkaChipki Card */}
            <div className="mt-8 rounded-3xl p-1 bg-gradient-to-r from-pink-500 via-purple-500 to-amber-500 shadow-xl glow-amber">
              <div className="rounded-[22px] bg-card p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-tr from-pink-500 via-rose-500 to-purple-600 text-white flex items-center justify-center text-3xl shadow-lg flex-shrink-0">
                    🏅
                  </div>
                  <div className="space-y-1">
                    <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-pink-500/15 text-pink-600 dark:text-pink-400 text-xs font-bold border border-pink-500/30">
                      Gift Partner
                    </div>
                    <h3 className="text-xl sm:text-2xl font-black text-foreground">
                      {SPECIAL_GIFT.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-muted-foreground">
                      {SPECIAL_GIFT.description}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3.5 px-6 py-4 rounded-2xl bg-gradient-to-r from-pink-500/15 via-purple-500/15 to-amber-500/15 border border-pink-500/30 text-center sm:text-left shadow-md flex-shrink-0">
                  <div className="w-12 h-12 rounded-xl bg-pink-500/20 text-pink-600 dark:text-pink-400 flex items-center justify-center">
                    <Ticket className="w-6 h-6 animate-pulse" />
                  </div>
                  <div>
                    <div className="text-[11px] uppercase font-extrabold tracking-wider text-pink-600 dark:text-pink-400">
                      🎟️ Special Reward
                    </div>
                    <div className="text-lg sm:text-xl font-black text-foreground">
                      {SPECIAL_GIFT.prize}
                    </div>
                    <div className="text-[11px] text-muted-foreground font-medium">
                      স্পেশাল গিফট ভাউচার
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Topics Grid */}
          <section>
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-400 text-xs font-bold uppercase tracking-wider mb-2">
                <BookOpen className="w-3.5 h-3.5" />
                Syllabus & Topics
              </div>
              <h2 className="text-2xl md:text-3xl font-extrabold text-foreground">
                কুইজ প্রতিযোগিতার বিষয়বস্তু
              </h2>
              <p className="text-muted-foreground text-sm max-w-xl mx-auto mt-1">
                বাস্তবমুখী ও ইন্ডাস্ট্রি স্ট্যান্ডার্ড ৩০টি টেকনিক্যাল প্রশ্নের ওপর আপনার দক্ষতা যাচাই করা হবে
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {TOPICS_DATA.map((topic) => {
                const IconComponent =
                  topic.iconName === "Cpu"
                    ? Cpu
                    : topic.iconName === "Network"
                    ? Network
                    : topic.iconName === "Code2"
                    ? Code2
                    : Lightbulb

                return (
                  <Card
                    key={topic.id}
                    className={`border ${topic.borderColor} bg-card/90 shadow-md hover:shadow-lg transition-all duration-200 overflow-hidden relative group`}
                  >
                    <div className={`absolute top-0 right-0 w-28 h-28 ${topic.bgColor} rounded-bl-full pointer-events-none transition-all group-hover:scale-110`} />
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between gap-2">
                        <div className={`w-11 h-11 rounded-2xl ${topic.bgColor} ${topic.color} flex items-center justify-center font-bold shadow-inner`}>
                          <IconComponent className="w-6 h-6" />
                        </div>
                        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${topic.bgColor} ${topic.color} border border-current/20`}>
                          {topic.badge}
                        </span>
                      </div>
                      <CardTitle className="text-lg md:text-xl text-foreground font-bold pt-2">
                        {topic.title}
                      </CardTitle>
                      <p className="text-xs text-muted-foreground font-medium">{topic.titleEn}</p>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <p className="text-sm text-foreground/80 leading-relaxed">{topic.description}</p>
                      <div className="flex flex-wrap gap-1.5 pt-2">
                        {topic.items.map((item, idx) => (
                          <span
                            key={idx}
                            className="text-[11px] font-medium px-2.5 py-1 rounded-md bg-secondary/80 text-secondary-foreground border border-border"
                          >
                            {item}
                          </span>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </section>

          {/* Rules Section */}
          <section>
            <Card className="border-border/80 shadow-md bg-card/90">
              <CardHeader className="border-b border-border/50 pb-4">
                <CardTitle className="flex items-center gap-2.5 text-xl text-foreground font-bold">
                  <ShieldAlert className="w-5 h-5 text-amber-500" />
                  প্রতিযোগিতার নিয়মাবলী ও নির্দেশিকা
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {RULES_DATA.map((rule, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-3 p-3.5 rounded-xl bg-secondary/50 border border-border/60"
                    >
                      <div className="w-6 h-6 rounded-lg bg-primary/10 text-primary flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                        {idx + 1}
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-foreground mb-1">{rule.title}</h4>
                        <p className="text-xs text-muted-foreground leading-relaxed">{rule.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </section>

          {/* 📝 Registration Form Section */}
          <section id="register" className="pt-4 scroll-mt-20">
            <Card className={`border-2 shadow-2xl bg-card overflow-hidden transition-all duration-300 ${
              isFormUnlocked
                ? "border-emerald-500/50 glow-purple"
                : "border-purple-500/40 glow-purple"
            }`}>
              <div className={`h-2.5 bg-gradient-to-r ${
                isFormUnlocked
                  ? "from-emerald-500 via-teal-500 to-purple-600"
                  : "from-purple-600 via-amber-500 to-rose-600"
              }`} />

              <CardHeader className="text-center pb-2 pt-6">
                <div className={`inline-flex items-center justify-center w-14 h-14 rounded-2xl mx-auto mb-3 shadow-md ${
                  alreadySubmitted
                    ? "bg-purple-500/15 text-purple-600 dark:text-purple-400"
                    : isFormUnlocked
                    ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400"
                    : "bg-purple-500/15 text-purple-600 dark:text-purple-400"
                }`}>
                  {alreadySubmitted ? (
                    <ShieldCheck className="w-8 h-8 text-purple-500" />
                  ) : isFormUnlocked ? (
                    <Unlock className="w-7 h-7 text-emerald-500 animate-bounce" />
                  ) : (
                    <Lock className="w-7 h-7 text-amber-500" />
                  )}
                </div>

                <div className="flex items-center justify-center gap-2 mb-1">
                  <span className={`text-xs font-black uppercase tracking-wider px-3 py-1 rounded-full border ${
                    alreadySubmitted
                      ? "bg-purple-500/15 text-purple-600 dark:text-purple-400 border-purple-500/30"
                      : scheduleState.phase === "open_today"
                      ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30"
                      : scheduleState.phase === "locked_waiting"
                      ? "bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30"
                      : "bg-purple-500/15 text-purple-600 dark:text-purple-400 border-purple-500/30"
                  }`}>
                    {alreadySubmitted
                      ? "🔒 অংশগ্রহণ স্ট্যাটাস: সম্পন্ন (লক করা)"
                      : scheduleState.phase === "open_today"
                      ? "🟢 রেজিস্ট্রেশন এখন খোলা রয়েছে (আজকে সন্ধ্যা ৬টায় লক হবে)"
                      : scheduleState.phase === "locked_waiting"
                      ? "🔒 রেজিস্ট্রেশন সাময়িকভাবে লক করা আছে"
                      : "🟢 লাইভ কুইজ চলছে"}
                  </span>
                </div>

                <CardTitle className="text-2xl sm:text-3xl font-black text-foreground mt-2">
                  {alreadySubmitted
                    ? "আপনি ইতিমধ্যে কুইজ সম্পন্ন করেছেন!"
                    : scheduleState.phase === "locked_waiting"
                    ? "রেজিস্ট্রেশন শুরু হতে বাকি রয়েছে"
                    : "কুইজ রেজিস্ট্রেশন ফর্ম"}
                </CardTitle>
                <p className="text-xs sm:text-sm text-muted-foreground mt-1 max-w-md mx-auto">
                  {alreadySubmitted
                    ? "প্রতিযোগিতার নিয়ম অনুযায়ী একজন শিক্ষার্থী কেবল একবারই অংশগ্রহণ করতে পারবেন। পুনরায় অংশগ্রহণ গ্রহণযোগ্য নয়।"
                    : scheduleState.phase === "open_today"
                    ? "আজকে সন্ধ্যা ০৬:০০ টা পর্যন্ত ফর্ম উন্মুক্ত থাকবে। নাম ও রোল দিয়ে কুইজে অংশগ্রহণ করুন!"
                    : scheduleState.phase === "locked_waiting"
                    ? "আজকের প্রাথমিক সেশন শেষ হয়েছে। আগামী ২৩ অক্টোবর রাত ০৮:০০ টায় মূল কুইজ শুরু হবে।"
                    : "আপনার নাম ও রোল নম্বর দিয়ে এখনই সরাসরি কুইজে অংশগ্রহণ করুন"}
                </p>
              </CardHeader>

              <CardContent className="pt-4 pb-8">
                {alreadySubmitted ? (
                  <div className="max-w-xl mx-auto p-6 sm:p-7 rounded-2xl bg-gradient-to-br from-purple-500/10 via-card to-amber-500/10 border border-purple-500/30 text-center shadow-lg space-y-5">
                    <div className="flex items-center justify-center gap-2 text-amber-500 font-bold text-sm">
                      <Sparkles className="w-4 h-4" />
                      <span>আপনার কুইজ সাবমিশন সফলভাবে গৃহীত হয়েছে</span>
                    </div>

                    {/* Participant Summary Box */}
                    <div className="p-4 rounded-xl bg-secondary/80 border border-border text-left grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                      <div>
                        <span className="text-muted-foreground block text-[11px]">শিক্ষার্থীর নাম:</span>
                        <strong className="text-foreground text-sm font-bold truncate block">{alreadySubmitted.name}</strong>
                      </div>
                      <div>
                        <span className="text-muted-foreground block text-[11px]">রোল নম্বর:</span>
                        <strong className="text-foreground text-sm font-bold block">{alreadySubmitted.roll}</strong>
                      </div>
                      <div className="col-span-2 sm:col-span-1">
                        <span className="text-muted-foreground block text-[11px]">প্রাপ্ত স্কোর:</span>
                        <strong className="text-purple-600 dark:text-purple-400 text-sm font-black block">
                          {alreadySubmitted.score} / {QUIZ_CONFIG.totalQuestions}
                        </strong>
                      </div>
                    </div>

                    <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/20 text-xs text-amber-700 dark:text-amber-300">
                      ⚠️ আপনার ফলাফল ও স্কোর অফিসিয়াল ডাটাবেসে সেভ করা আছে। মেধা তালিকা ও বিজয়ীদের নাম পরবর্তীতে ঘোষণা করা হবে।
                    </div>

                    {onViewResult && (
                      <Button
                        type="button"
                        onClick={onViewResult}
                        className="w-full h-13 bg-gradient-to-r from-purple-600 via-violet-600 to-amber-500 hover:from-purple-700 hover:to-amber-600 text-white font-extrabold text-base rounded-xl shadow-lg transition-all"
                      >
                        <span>আপনার রেজাল্ট ও সামারি দেখুন</span>
                        <Sparkles className="w-4 h-4 ml-2" />
                      </Button>
                    )}
                  </div>
                ) : (
                  <>
                    {/* ⏳ Phase 1: OPEN BEFORE 6 PM TODAY - Live Notice and Closing Countdown */}
                    {scheduleState.phase === "open_today" && (
                      <div className="mb-6 p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-emerald-500/10 via-purple-500/10 to-amber-500/10 border border-emerald-500/30 text-center">
                        <div className="flex flex-wrap items-center justify-between gap-3">
                          <div className="flex items-center gap-2.5 text-left">
                            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold text-lg flex-shrink-0">
                              ⚡
                            </div>
                            <div>
                              <div className="text-xs sm:text-sm font-bold text-foreground">
                                আজকের রেজিস্ট্রেশন সেশন উন্মুক্ত রয়েছে
                              </div>
                              <p className="text-[11px] text-muted-foreground">
                                আজকে সন্ধ্যা ০৬:০০ টায় ফর্ম স্বয়ংক্রিয়ভাবে লক হয়ে যাবে
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 bg-card/90 px-4 py-2 rounded-xl border border-border shadow-sm">
                            <Clock className="w-4 h-4 text-amber-500 animate-spin" />
                            <span className="text-xs text-muted-foreground font-semibold">আজকের সেশন শেষ হতে বাকি:</span>
                            <span className="font-mono font-black text-sm sm:text-base text-amber-600 dark:text-amber-400">
                              {String(scheduleState.hours).padStart(2, "0")}:{String(scheduleState.minutes).padStart(2, "0")}:{String(scheduleState.seconds).padStart(2, "0")}
                            </span>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* ⏳ Phase 2: LOCKED BETWEEN 6 PM TODAY & 8 PM TOMORROW - Countdown to 23 Oct 8pm */}
                    {scheduleState.phase === "locked_waiting" && !devOverride && (
                      <div className="mb-8 p-5 sm:p-7 rounded-3xl bg-gradient-to-b from-purple-950/70 via-slate-950/90 to-purple-950/70 border border-purple-500/40 text-center relative overflow-hidden shadow-2xl">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold mb-4 border border-amber-500/30">
                          <Clock className="w-3.5 h-3.5 animate-spin" />
                          ২৩ অক্টোবর রাত ৮:০০ টায় লাইভ কুইজ
                        </div>

                        <div className="grid grid-cols-4 gap-2 sm:gap-4 max-w-md mx-auto">
                          {/* Days */}
                          <div className="p-3 sm:p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm text-center">
                            <div className="text-2xl sm:text-4xl md:text-5xl font-black text-amber-400 font-mono tracking-tight">
                              {String(scheduleState.days).padStart(2, "0")}
                            </div>
                            <div className="text-[10px] sm:text-xs uppercase tracking-wider text-slate-300 font-bold mt-1">
                              দিন (Days)
                            </div>
                          </div>

                          {/* Hours */}
                          <div className="p-3 sm:p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm text-center">
                            <div className="text-2xl sm:text-4xl md:text-5xl font-black text-purple-300 font-mono tracking-tight">
                              {String(scheduleState.hours).padStart(2, "0")}
                            </div>
                            <div className="text-[10px] sm:text-xs uppercase tracking-wider text-slate-300 font-bold mt-1">
                              ঘণ্টা (Hrs)
                            </div>
                          </div>

                          {/* Minutes */}
                          <div className="p-3 sm:p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm text-center">
                            <div className="text-2xl sm:text-4xl md:text-5xl font-black text-violet-300 font-mono tracking-tight">
                              {String(scheduleState.minutes).padStart(2, "0")}
                            </div>
                            <div className="text-[10px] sm:text-xs uppercase tracking-wider text-slate-300 font-bold mt-1">
                              মিনিট (Mins)
                            </div>
                          </div>

                          {/* Seconds */}
                          <div className="p-3 sm:p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm text-center">
                            <div className="text-2xl sm:text-4xl md:text-5xl font-black text-rose-400 font-mono tracking-tight">
                              {String(scheduleState.seconds).padStart(2, "0")}
                            </div>
                            <div className="text-[10px] sm:text-xs uppercase tracking-wider text-slate-300 font-bold mt-1">
                              সেকেন্ড (Sec)
                            </div>
                          </div>
                        </div>

                        <p className="text-xs text-slate-300 mt-4 max-w-sm mx-auto">
                          ২৩ অক্টোবর রাত ০৮:০০ টায় নির্ধারিত সময়ে স্বয়ংক্রিয়ভাবে মূল কুইজ উন্মুক্ত হবে।
                        </p>
                      </div>
                    )}

                    {/* Form Elements */}
                    <form onSubmit={handleSubmit} className="space-y-5 max-w-xl mx-auto">
                      <div className="space-y-2">
                        <Label htmlFor="name" className="text-sm font-semibold text-foreground flex items-center justify-between">
                          <span>আপনার পূর্ণ নাম <span className="text-destructive">*</span></span>
                          {!isFormUnlocked && (
                            <span className="text-xs text-muted-foreground flex items-center gap-1">
                              <Lock className="w-3 h-3 text-amber-500" /> ২৩ অক্টোবর রাত ৮টায় খুলবে
                            </span>
                          )}
                        </Label>
                        <Input
                          id="name"
                          type="text"
                          placeholder={isFormUnlocked ? "যেমন: মোঃ সাব্বির আহমেদ" : "রেজিস্ট্রেশন লক করা রয়েছে..."}
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          disabled={!isFormUnlocked}
                          className="h-12 bg-background border-border text-base focus-visible:ring-purple-500 disabled:opacity-60 disabled:cursor-not-allowed"
                          required
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="roll" className="text-sm font-semibold text-foreground flex items-center justify-between">
                            <span>রোল নম্বর <span className="text-destructive">*</span></span>
                            {!isFormUnlocked && (
                              <span className="text-xs text-muted-foreground flex items-center gap-1">
                                <Lock className="w-3 h-3 text-amber-500" /> লক করা
                              </span>
                            )}
                          </Label>
                          <Input
                            id="roll"
                            type="text"
                            placeholder={isFormUnlocked ? "যেমন: 589412" : "পলিটেকনিক রোল..."}
                            value={roll}
                            onChange={(e) => setRoll(e.target.value)}
                            disabled={!isFormUnlocked}
                            className="h-12 bg-background border-border text-base focus-visible:ring-purple-500 disabled:opacity-60 disabled:cursor-not-allowed"
                            required
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="dept" className="text-sm font-semibold text-foreground">
                            ইনস্টিটিউট / ডিপার্টমেন্ট <span className="text-muted-foreground text-xs">(ঐচ্ছিক)</span>
                          </Label>
                          <Input
                            id="dept"
                            type="text"
                            placeholder={isFormUnlocked ? "যেমন: CPI - Computer" : "ইনস্টিটিউট নাম..."}
                            value={dept}
                            onChange={(e) => setDept(e.target.value)}
                            disabled={!isFormUnlocked}
                            className="h-12 bg-background border-border text-base focus-visible:ring-purple-500 disabled:opacity-60 disabled:cursor-not-allowed"
                          />
                        </div>
                      </div>

                      <div className={`p-3.5 rounded-xl text-xs flex items-start gap-2.5 border ${
                        isFormUnlocked
                          ? "bg-amber-500/10 border-amber-500/20 text-amber-800 dark:text-amber-300"
                          : "bg-secondary border-border text-muted-foreground"
                      }`}>
                        <Clock className="w-4 h-4 flex-shrink-0 mt-0.5 text-amber-600 dark:text-amber-400" />
                        <span>
                          {isFormUnlocked
                            ? "কুইজ শুরু করার সাথে সাথে ২০ মিনিটের টাইমার শুরু হবে। উত্তর নির্বাচন করার সাথে সাথেই তা লক হয়ে যাবে।"
                            : "কুইজের সময়সীমা ২০ মিনিট। ২৩ অক্টোবর রাত ৮:০০ টায় নির্ধারিত সময়ে অংশগ্রহণ নিশ্চিত করুন।"}
                        </span>
                      </div>

                      {/* Submit / Action Button */}
                      {isFormUnlocked ? (
                        <Button
                          type="submit"
                          disabled={!isFormValid}
                          className="w-full h-14 bg-gradient-to-r from-purple-600 via-violet-600 to-amber-500 hover:from-purple-700 hover:to-amber-600 text-white font-black text-lg rounded-xl shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed group"
                        >
                          <span>কুইজ শুরু করুন</span>
                          <Zap className="w-5 h-5 ml-2 group-hover:scale-125 transition-transform" />
                        </Button>
                      ) : (
                        <Button
                          type="button"
                          disabled
                          className="w-full h-14 bg-secondary text-muted-foreground font-bold text-base rounded-xl cursor-not-allowed opacity-80 border border-border flex items-center justify-center gap-2"
                        >
                          <Lock className="w-4 h-4 text-amber-500" />
                          <span>রেজিস্ট্রেশন লক করা আছে (২৩ অক্টোবর রাত ৮:০০ টায় খুলবে)</span>
                        </Button>
                      )}

                      {/* Dev / Admin Test Override Note */}
                      {devOverride && (
                        <div className="text-center pt-2">
                          <span className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/30">
                            ⚡ Developer Test Mode Enabled (Unlocked)
                          </span>
                        </div>
                      )}
                    </form>
                  </>
                )}
              </CardContent>
            </Card>
          </section>
        </div>

        {/* Footer */}
        <footer className="mt-20 border-t border-border/60 pt-8 pb-12 text-center text-muted-foreground">
          <div className="flex flex-wrap items-center justify-center gap-4 mb-4">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 relative rounded-md overflow-hidden">
                <Image src="/polytechnic-coders-logo.png" alt="Polytechnic Coders" fill className="object-cover" />
              </div>
              <span className="text-xs font-semibold text-foreground">Polytechnic Coders</span>
            </div>
            <span className="text-muted-foreground">•</span>
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 relative rounded-md overflow-hidden">
                <Image src="/cpi-timeline-logo.png" alt="CPI Timeline" fill className="object-cover" />
              </div>
              <span className="text-xs font-semibold text-foreground">CPI Timeline</span>
            </div>
          </div>
          <p className="text-xs">
            &copy; 2026 {QUIZ_CONFIG.title}. যৌথ আয়োজনে <strong>Polytechnic Coders</strong> (By Programming Hero) × <strong>CPI Timeline</strong>। সর্বস্বত্ব সংরক্ষিত।
          </p>
        </footer>
      </div>
    </div>
  )
}
