"use client"

import { useState, useEffect, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Trophy,
  Medal,
  Award,
  RefreshCw,
  Search,
  Sparkles,
  Zap,
  BatteryCharging,
  Headphones,
  Users,
  TrendingUp,
  AlertCircle,
  HelpCircle,
  ArrowRight,
  Database
} from "lucide-react"
import { QUIZ_CONFIG, LeaderboardEntry } from "@/lib/quiz-data"

interface LeaderboardProps {
  userRoll?: string
}

export default function Leaderboard({ userRoll }: LeaderboardProps) {
  const [data, setData] = useState<LeaderboardEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [lastUpdated, setLastUpdated] = useState<string>("")
  const [isDoGetMissing, setIsDoGetMissing] = useState(false)
  const [mySubmission, setMySubmission] = useState<{
    name: string
    roll: string
    score: number
  } | null>(null)

  // Load user's own submission from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem("clash_of_techies_2026_submission")
      if (saved) {
        const parsed = JSON.parse(saved)
        if (parsed && parsed.submitted) {
          setMySubmission({
            name: parsed.name,
            roll: parsed.roll,
            score: parsed.score,
          })
        }
      }
    } catch {}
  }, [])

  // Fetch live leaderboard from Google Sheets via Next.js server route
  const fetchLeaderboard = async () => {
    setLoading(true)

    try {
      const res = await fetch("/api/leaderboard", {
        method: "GET",
        headers: {
          Accept: "application/json",
        },
        cache: "no-store",
      })

      if (res.ok) {
        const json = await res.json()
        if (json.isDoGetMissing) {
          setIsDoGetMissing(true)
          setData([])
        } else if (Array.isArray(json.leaderboard)) {
          setIsDoGetMissing(false)
          setData(json.leaderboard)
          setLastUpdated(
            new Date().toLocaleTimeString("en-US", {
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
            })
          )
        }
      }
    } catch (err) {
      console.error("Could not fetch live leaderboard from Google Sheets.", err)
    } finally {
      setLoading(false)
    }
  }

  // Initial fetch on mount & auto-poll every 30s
  useEffect(() => {
    fetchLeaderboard()
    const interval = setInterval(() => {
      fetchLeaderboard()
    }, 30000)
    return () => clearInterval(interval)
  }, [])

  // Filtered leaderboard
  const filteredData = useMemo(() => {
    if (!search.trim()) return data
    const query = search.toLowerCase().trim()
    return data.filter(
      (item) =>
        item.name.toLowerCase().includes(query) ||
        item.roll.toLowerCase().includes(query) ||
        (item.rawRoll && item.rawRoll.toLowerCase().includes(query)) ||
        item.dept.toLowerCase().includes(query)
    )
  }, [data, search])

  // Top 3 Podium
  const top1 = data[0]
  const top2 = data[1]
  const top3 = data[2]
  const others = filteredData.slice(search.trim() ? 0 : 3)

  // Find user's rank
  const myRank = useMemo(() => {
    if (!mySubmission) return null
    const targetRoll = mySubmission.roll.trim().toLowerCase()
    const index = data.findIndex(
      (item) =>
        (item.rawRoll && item.rawRoll.toLowerCase() === targetRoll) ||
        item.roll.toLowerCase() === targetRoll
    )
    if (index !== -1) {
      return index + 1
    }
    return null
  }, [data, mySubmission])

  return (
    <section id="leaderboard" className="py-12 scroll-mt-20">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Header Section */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-600 dark:text-amber-400 text-xs font-black uppercase tracking-wider shadow-sm">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            <Trophy className="w-4 h-4 text-amber-500" />
            <span>গুগল শিট লাইভ লিডারবোর্ড • Live Sheet Rankings</span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-foreground">
            Clash of Techies <span className="text-amber-500">লিডারবোর্ড</span>
          </h2>

          <p className="text-sm md:text-base text-muted-foreground max-w-2xl mx-auto">
            গুগল শিটের সকল সাবমিশনের ভিত্তিতে প্রতিযোগীদের স্কোর ও অবস্থান সরাসরি প্রদর্শিত হচ্ছে
          </p>
        </div>

        {/* Status Bar & Search Controls */}
        <div className="p-4 rounded-2xl bg-card border border-border/80 shadow-md flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-xs font-bold px-3 py-1.5 rounded-xl bg-secondary/80 border border-border">
              <Database className="w-3.5 h-3.5 text-purple-500" />
              <span className="text-foreground">
                গুগল শিট সোর্স
              </span>
            </div>

            <div className="text-xs text-muted-foreground flex items-center gap-1.5 font-medium">
              <Users className="w-3.5 h-3.5 text-amber-500" />
              <span>মোট অংশগ্রহণকারী: <strong className="text-foreground">{data.length} জন</strong></span>
            </div>
          </div>

          <div className="flex items-center gap-2.5 flex-1 sm:flex-initial justify-end">
            {/* Search Input */}
            <div className="relative w-full sm:w-60">
              <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
              <Input
                type="text"
                placeholder="নাম বা রোল খুঁজুন..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                disabled={data.length === 0}
                className="pl-9 h-10 text-xs sm:text-sm bg-background border-border rounded-xl focus-visible:ring-purple-500 disabled:opacity-50"
              />
            </div>

            {/* Refresh Button */}
            <Button
              variant="outline"
              size="sm"
              onClick={fetchLeaderboard}
              disabled={loading}
              className="h-10 px-3.5 rounded-xl border-border bg-background hover:bg-secondary flex items-center gap-2 text-xs font-bold"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-amber-500 ${loading ? "animate-spin" : ""}`} />
              <span className="hidden sm:inline">রিফ্রেশ</span>
            </Button>
          </div>
        </div>

        {/* User's Current Rank Highlight (If already submitted) */}
        {mySubmission && (
          <div className="p-4 rounded-2xl bg-gradient-to-r from-purple-500/15 via-amber-500/15 to-purple-500/15 border-2 border-purple-500/40 shadow-lg glow-purple flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-600 text-white flex items-center justify-center font-black text-sm shadow-md">
                {myRank ? `#${myRank}` : "✓"}
              </div>
              <div>
                <div className="text-xs font-semibold text-muted-foreground">আপনার বর্তমান অবস্থান:</div>
                <div className="text-base font-extrabold text-foreground flex items-center gap-2">
                  <span>{mySubmission.name}</span>
                  <span className="text-xs font-bold px-2 py-0.5 rounded bg-purple-500/20 text-purple-600 dark:text-purple-400">
                    রোল: {mySubmission.roll}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="text-[11px] text-muted-foreground font-medium">প্রাপ্ত স্কোর</div>
                <div className="text-lg font-black text-amber-500">
                  {mySubmission.score} / {QUIZ_CONFIG.totalQuestions}
                </div>
              </div>
              {myRank && myRank <= 3 && (
                <div className="px-3 py-1 rounded-xl bg-amber-500/20 text-amber-600 dark:text-amber-400 text-xs font-black border border-amber-500/30">
                  🎉 টপ প্রাইজ জোনে আছেন!
                </div>
              )}
            </div>
          </div>
        )}

        {/* ⚠️ Notice if Google Apps Script needs New Version deployment */}
        {isDoGetMissing && (
          <div className="p-6 rounded-3xl bg-amber-500/10 border-2 border-amber-500/30 text-amber-900 dark:text-amber-200 space-y-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-6 h-6 text-amber-500 flex-shrink-0 mt-0.5" />
              <div className="space-y-1">
                <h4 className="text-base font-bold text-foreground">
                  গুগল শিট থেকে লাইভ লিডারবোর্ড চালু করতে Apps Script New Version ডিপ্লয় করুন:
                </h4>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  আপনার Google Apps Script Web App-এ লিডারবোর্ড API রিড ফাংশন (<code className="bg-amber-500/20 px-1 py-0.5 rounded font-mono text-xs">doGet</code>) এখনও পাবলিশ করা হয়নি। নিচের ধাপগুলো অনুসরণ করুন:
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs pt-1">
              <div className="p-3 rounded-xl bg-background/80 border border-border">
                <div className="font-bold text-foreground mb-1">১. কোড সেভ করুন</div>
                <p className="text-muted-foreground">গুগল শিটে <span className="font-semibold text-foreground">Extensions &gt; Apps Script</span> ওপেন করে প্রজেক্টের <code className="text-purple-500 font-mono">scripts/google-apps-script.js</code> ফাইলটির কোড পেস্ট করে Ctrl+S চাপুন।</p>
              </div>
              <div className="p-3 rounded-xl bg-background/80 border border-border">
                <div className="font-bold text-foreground mb-1">২. New Version দিন</div>
                <p className="text-muted-foreground">উপরে <span className="font-semibold text-foreground">Deploy &gt; Manage deployments</span>-এ ক্লিক করুন &gt; পেনসিল আইকনে চাপুন &gt; Version ড্রপডাউনে <span className="text-emerald-500 font-bold">New version</span> সিলেক্ট করুন।</p>
              </div>
              <div className="p-3 rounded-xl bg-background/80 border border-border">
                <div className="font-bold text-foreground mb-1">৩. Deploy চাপুন</div>
                <p className="text-muted-foreground">নিচে <span className="font-semibold text-foreground">Deploy</span> বাটনে ক্লিক করলেই গুগল শিট থেকে সকল ডাটা লাইভ লোড হওয়া শুরু করবে!</p>
              </div>
            </div>

            <div className="text-center pt-1">
              <Button
                size="sm"
                onClick={fetchLeaderboard}
                disabled={loading}
                className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs rounded-xl"
              >
                <RefreshCw className={`w-3.5 h-3.5 mr-1.5 ${loading ? "animate-spin" : ""}`} />
                <span>ডিপ্লয় করার পর এখানে ক্লিক করে চেক করুন</span>
              </Button>
            </div>
          </div>
        )}

        {/* Loading State Skeleton */}
        {loading && data.length === 0 && (
          <div className="p-12 text-center space-y-4 rounded-3xl bg-card border border-border">
            <RefreshCw className="w-8 h-8 text-amber-500 animate-spin mx-auto" />
            <p className="text-sm font-bold text-foreground">গুগল শিট থেকে লাইভ লিডারবোর্ড ডাটা লোড হচ্ছে...</p>
            <p className="text-xs text-muted-foreground">দয়া করে কিছুক্ষণ অপেক্ষা করুন</p>
          </div>
        )}

        {/* Empty Sheet State (When Google Sheet has 0 rows and doGet is active) */}
        {!loading && !isDoGetMissing && data.length === 0 && (
          <div className="p-10 sm:p-14 text-center space-y-4 rounded-3xl bg-card border border-dashed border-border/80 shadow-md">
            <div className="w-16 h-16 rounded-2xl bg-purple-500/10 text-purple-500 flex items-center justify-center mx-auto text-3xl">
              📊
            </div>
            <div className="space-y-1">
              <h3 className="text-xl sm:text-2xl font-black text-foreground">
                এখনও পর্যন্ত কোনো প্রতিযোগী সাবমিট করেনি
              </h3>
              <p className="text-xs sm:text-sm text-muted-foreground max-w-md mx-auto">
                আপনার গুগল শিটটি প্রস্তুত রয়েছে। প্রথম প্রতিযোগী হিসেবে কুইজে অংশ নিন এবং সরাসরি লিডারবোর্ডের ১ম স্থান অর্জন করুন!
              </p>
            </div>
            <div className="pt-2">
              <a href="#register">
                <Button className="h-12 px-6 bg-gradient-to-r from-purple-600 to-amber-500 hover:from-purple-700 hover:to-amber-600 text-white font-black text-sm rounded-xl shadow-lg">
                  <span>প্রথম প্রতিযোগী হিসেবে কুইজ দিন</span>
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </a>
            </div>
          </div>
        )}

        {/* 🏆 Top 3 Podium Showcase (Displayed only when real data exists) */}
        {!search.trim() && top1 && (
          <div className="pt-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-end">
              {/* 🥈 2nd Place: 1st Runner-up */}
              {top2 && (
                <Card className="order-2 md:order-1 border-slate-400/30 bg-card/90 shadow-xl relative overflow-hidden transition-all duration-300 hover:-translate-y-1.5 md:h-[350px] flex flex-col justify-between">
                  <div className="h-1.5 bg-gradient-to-r from-slate-400 to-zinc-200" />
                  <CardHeader className="text-center pb-2 pt-6">
                    <div className="relative mx-auto mb-3">
                      <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-slate-400 to-zinc-200 flex items-center justify-center text-slate-900 shadow-lg text-2xl font-black">
                        <Medal className="w-8 h-8 text-slate-800" />
                      </div>
                      <span className="absolute -bottom-2 -right-1 w-7 h-7 rounded-full bg-slate-900 text-white font-black text-xs flex items-center justify-center border-2 border-card shadow">
                        #2
                      </span>
                    </div>

                    <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-slate-500/15 text-slate-600 dark:text-slate-300 text-[11px] font-bold mx-auto mb-1">
                      <Zap className="w-3 h-3 text-amber-500" />
                      ১ম রানার আপ (Power Bank)
                    </div>

                    <CardTitle className="text-lg sm:text-xl font-black text-foreground truncate">
                      {top2.name}
                    </CardTitle>
                    <p className="text-xs text-muted-foreground font-semibold">
                      রোল: {top2.roll} • {top2.dept}
                    </p>
                  </CardHeader>

                  <CardContent className="pt-2 text-center pb-6">
                    <div className="p-3 rounded-xl bg-secondary/70 border border-border">
                      <div className="text-2xl font-black text-foreground">
                        {top2.score} <span className="text-xs text-muted-foreground font-normal">/ {top2.totalQuestions}</span>
                      </div>
                      <div className="text-[11px] font-bold text-emerald-500">
                        সঠিকতা: {top2.percentage}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* 🥇 1st Place: Champion (Elevated & Golden) */}
              <Card className="order-1 md:order-2 border-2 border-amber-500/60 bg-gradient-to-b from-amber-500/10 via-card to-card shadow-2xl relative overflow-hidden transition-all duration-300 hover:-translate-y-2 md:h-[390px] flex flex-col justify-between glow-amber">
                <div className="bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-600 text-slate-950 text-center py-1.5 text-xs font-black tracking-widest uppercase shadow">
                  ★ TOP CHAMPION • 1ST PLACE ★
                </div>

                <CardHeader className="text-center pb-2 pt-4">
                  <div className="relative mx-auto mb-3">
                    <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-amber-500 via-yellow-400 to-amber-600 flex items-center justify-center text-slate-950 shadow-xl">
                      <Trophy className="w-10 h-10 text-slate-950 animate-bounce" />
                    </div>
                    <span className="absolute -bottom-2 -right-1 w-8 h-8 rounded-full bg-amber-500 text-slate-950 font-black text-sm flex items-center justify-center border-2 border-card shadow-lg">
                      #1
                    </span>
                  </div>

                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-600 dark:text-amber-400 text-xs font-black mx-auto mb-1 border border-amber-500/30">
                    <BatteryCharging className="w-3.5 h-3.5 text-amber-500" />
                    চ্যাম্পিয়ন (Mini UPS বিজয়ী)
                  </div>

                  <CardTitle className="text-xl sm:text-2xl font-black text-foreground truncate">
                    {top1.name}
                  </CardTitle>
                  <p className="text-xs text-muted-foreground font-semibold">
                    রোল: {top1.roll} • {top1.dept}
                  </p>
                </CardHeader>

                <CardContent className="pt-2 text-center pb-6">
                  <div className="p-3.5 rounded-2xl bg-gradient-to-r from-amber-500/15 via-yellow-500/10 to-amber-500/15 border border-amber-500/30 shadow-inner">
                    <div className="text-3xl font-black text-amber-500">
                      {top1.score} <span className="text-xs text-muted-foreground font-normal">/ {top1.totalQuestions}</span>
                    </div>
                    <div className="text-xs font-black text-emerald-500 mt-0.5">
                      সঠিকতা: {top1.percentage}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* 🥉 3rd Place: 2nd Runner-up */}
              {top3 && (
                <Card className="order-3 border-amber-700/30 bg-card/90 shadow-xl relative overflow-hidden transition-all duration-300 hover:-translate-y-1.5 md:h-[350px] flex flex-col justify-between">
                  <div className="h-1.5 bg-gradient-to-r from-amber-700 to-amber-500" />
                  <CardHeader className="text-center pb-2 pt-6">
                    <div className="relative mx-auto mb-3">
                      <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-700 to-amber-500 flex items-center justify-center text-white shadow-lg text-2xl font-black">
                        <Award className="w-8 h-8 text-amber-100" />
                      </div>
                      <span className="absolute -bottom-2 -right-1 w-7 h-7 rounded-full bg-amber-900 text-white font-black text-xs flex items-center justify-center border-2 border-card shadow">
                        #3
                      </span>
                    </div>

                    <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-700/15 text-amber-700 dark:text-amber-400 text-[11px] font-bold mx-auto mb-1">
                      <Headphones className="w-3 h-3 text-amber-500" />
                      ২য় রানার আপ (Headphone)
                    </div>

                    <CardTitle className="text-lg sm:text-xl font-black text-foreground truncate">
                      {top3.name}
                    </CardTitle>
                    <p className="text-xs text-muted-foreground font-semibold">
                      রোল: {top3.roll} • {top3.dept}
                    </p>
                  </CardHeader>

                  <CardContent className="pt-2 text-center pb-6">
                    <div className="p-3 rounded-xl bg-secondary/70 border border-border">
                      <div className="text-2xl font-black text-foreground">
                        {top3.score} <span className="text-xs text-muted-foreground font-normal">/ {top3.totalQuestions}</span>
                      </div>
                      <div className="text-[11px] font-bold text-emerald-500">
                        সঠিকতা: {top3.percentage}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        )}

        {/* 📜 Leaderboard Table (When real data exists) */}
        {data.length > 0 && (
          <Card className="border-border/80 shadow-xl bg-card overflow-hidden">
            <CardHeader className="pb-3 border-b border-border/60 bg-muted/30">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base sm:text-lg font-bold text-foreground flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-purple-500" />
                  <span>
                    {search.trim() ? "অনুসন্ধানের ফলাফল" : "প্রতিযোগীদের সম্পূর্ণ মেধা তালিকা"}
                  </span>
                </CardTitle>
                <span className="text-xs text-muted-foreground font-medium">
                  {others.length} জন প্রতিযোগী প্রদর্শিত
                </span>
              </div>
            </CardHeader>

            <CardContent className="p-0">
              {others.length === 0 ? (
                <div className="p-10 text-center space-y-2">
                  <AlertCircle className="w-8 h-8 text-muted-foreground mx-auto opacity-50" />
                  <p className="text-sm font-semibold text-foreground">কোনো প্রতিযোগী পাওয়া যায়নি</p>
                  <p className="text-xs text-muted-foreground">ভিন্ন নাম বা রোল দিয়ে অনুসন্ধান করে দেখুন।</p>
                </div>
              ) : (
                <div className="divide-y divide-border/60">
                  {others.map((item, idx) => {
                    const rank = search.trim()
                      ? data.findIndex((d) => d.id === item.id) + 1
                      : idx + 4

                    const isCurrentUser =
                      mySubmission &&
                      ((item.rawRoll && item.rawRoll.toLowerCase() === mySubmission.roll.toLowerCase()) ||
                        item.roll.toLowerCase() === mySubmission.roll.toLowerCase())

                    return (
                      <div
                        key={item.id || idx}
                        className={`p-3.5 sm:p-4 flex items-center justify-between gap-3 transition-colors ${
                          isCurrentUser
                            ? "bg-purple-500/15 border-l-4 border-l-purple-500 font-semibold"
                            : "hover:bg-muted/40"
                        }`}
                      >
                        {/* Rank & User Info */}
                        <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                          <div
                            className={`w-8 h-8 rounded-xl flex items-center justify-center font-black text-xs flex-shrink-0 ${
                              rank <= 3
                                ? "bg-amber-500 text-slate-950"
                                : rank <= 10
                                ? "bg-purple-500/20 text-purple-600 dark:text-purple-400 font-extrabold"
                                : "bg-secondary text-muted-foreground"
                            }`}
                          >
                            #{rank}
                          </div>

                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="text-sm sm:text-base font-bold text-foreground truncate block">
                                {item.name}
                              </span>
                              {isCurrentUser && (
                                <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-purple-600 text-white shadow-sm flex-shrink-0">
                                  আপনি
                                </span>
                              )}
                            </div>
                            <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground mt-0.5">
                              <span className="font-mono font-medium">রোল: {item.roll}</span>
                              <span>•</span>
                              <span className="truncate">{item.dept}</span>
                            </div>
                          </div>
                        </div>

                        {/* Score & Percentage */}
                        <div className="flex items-center gap-4 flex-shrink-0 text-right">
                          <div>
                            <div className="text-base sm:text-lg font-black text-foreground">
                              {item.score}{" "}
                              <span className="text-[11px] text-muted-foreground font-normal">
                                / {item.totalQuestions}
                              </span>
                            </div>
                            <div className="text-[11px] font-bold text-emerald-500">
                              {item.percentage}
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Live Sync Notice */}
        {data.length > 0 && (
          <div className="p-4 rounded-2xl bg-secondary/50 border border-border/60 text-xs text-muted-foreground flex items-center justify-between gap-3 flex-wrap">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-500 flex-shrink-0" />
              <span>
                গুগল শিটে নতুন কুইজ সাবমিট হওয়ার সাথে সাথে প্রতি ৩০ সেকেন্ড পর পর এই লিডারবোর্ড স্বয়ংক্রিয়ভাবে হালনাগাদ হয়।
              </span>
            </div>
            {lastUpdated && (
              <span className="text-[11px] font-mono text-muted-foreground">
                সর্বশেষ আপডেট: {lastUpdated}
              </span>
            )}
          </div>
        )}
      </div>
    </section>
  )
}
