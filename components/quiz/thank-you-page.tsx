"use client"

import { useEffect } from "react"
import Image from "next/image"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Trophy,
  CheckCircle2,
  Zap,
  Sparkles,
  Building,
  User,
  Hash,
  ExternalLink,
  PlayCircle,
  Flame,
} from "lucide-react"
import { UserData, QUIZ_CONFIG } from "@/lib/quiz-data"

interface ThankYouPageProps {
  userData: UserData
  score: number
  totalQuestions: number
  answers: Record<number, number>
}

export default function ThankYouPage({
  userData,
  score,
  totalQuestions,
  answers,
}: ThankYouPageProps) {
  const percentage = Math.round((score / totalQuestions) * 100)

  // Send data to Google Sheets
  useEffect(() => {
    const sendToGoogleSheets = async () => {
      if (!QUIZ_CONFIG.googleScriptUrl) {
        console.log("Google Script URL not configured. Data:", {
          name: userData.n,
          roll: userData.r,
          dept: userData.dept || "",
          answers: JSON.stringify(answers),
          score,
          totalQuestions,
          submittedAt: new Date().toISOString(),
        })
        return
      }

      try {
        await fetch(QUIZ_CONFIG.googleScriptUrl, {
          method: "POST",
          mode: "no-cors",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: userData.n,
            roll: userData.r,
            dept: userData.dept || "",
            answers: JSON.stringify(answers),
            score,
            totalQuestions,
            submittedAt: new Date().toISOString(),
          }),
        })
        console.log("Data sent to Google Sheets successfully")
      } catch (error) {
        console.error("Error sending data to Google Sheets:", error)
      }
    }

    sendToGoogleSheets()
  }, [userData, score, totalQuestions, answers])

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 py-8 md:py-12 relative overflow-hidden tech-grid-pattern selection:bg-purple-500 selection:text-white">
      {/* Background Glows */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />

      <Card className="max-w-2xl w-full border-2 border-purple-500/30 shadow-2xl relative z-10 bg-card/95 overflow-hidden glow-purple">
        <div className="h-2 bg-gradient-to-r from-purple-600 via-amber-500 to-red-500" />

        <CardHeader className="text-center pb-3 pt-8">
          {/* Success Check Icon */}
          <div className="relative mx-auto mb-4">
            <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-purple-600 via-violet-600 to-amber-500 flex items-center justify-center shadow-lg text-white mx-auto">
              <Trophy className="w-10 h-10" />
            </div>
            <div className="absolute -bottom-1 -right-1 translate-x-3 translate-y-1 w-7 h-7 rounded-full bg-emerald-500 border-2 border-card text-white flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-400 text-xs font-bold uppercase tracking-wider mb-2">
            <Zap className="w-3.5 h-3.5" />
            Clash of Techies 2026
          </div>

          <CardTitle className="text-2xl sm:text-3xl font-black text-foreground">
            অভিনন্দন!
          </CardTitle>
          <p className="text-sm text-muted-foreground mt-1">
            আপনার কুইজ সাবমিশন সফলভাবে সম্পন্ন হয়েছে
          </p>
        </CardHeader>

        <CardContent className="space-y-6 pt-2 pb-8">
          {/* User Info Capsule */}
          <div className="bg-secondary/60 rounded-2xl p-4 border border-border/80 space-y-2">
            <div className="flex items-center justify-between text-xs sm:text-sm">
              <span className="text-muted-foreground flex items-center gap-1.5 font-medium">
                <User className="w-3.5 h-3.5 text-purple-500" /> নাম:
              </span>
              <span className="font-bold text-foreground">{userData.n}</span>
            </div>
            <div className="flex items-center justify-between text-xs sm:text-sm">
              <span className="text-muted-foreground flex items-center gap-1.5 font-medium">
                <Hash className="w-3.5 h-3.5 text-purple-500" /> রোল নম্বর:
              </span>
              <span className="font-bold font-mono text-foreground">{userData.r}</span>
            </div>
            {userData.dept && (
              <div className="flex items-center justify-between text-xs sm:text-sm">
                <span className="text-muted-foreground flex items-center gap-1.5 font-medium">
                  <Building className="w-3.5 h-3.5 text-purple-500" /> ইনস্টিটিউট:
                </span>
                <span className="font-bold text-foreground">{userData.dept}</span>
              </div>
            )}
          </div>

          {/* Score Showcase */}
          <div className="p-6 rounded-2xl bg-gradient-to-b from-purple-500/10 via-amber-500/5 to-transparent border border-purple-500/20 text-center relative overflow-hidden">
            <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-widest mb-1">
              <Sparkles className="w-4 h-4" /> আপনার ফলাফল
            </div>
            <div className="text-5xl sm:text-6xl font-black text-foreground tracking-tight my-2">
              <span className="text-purple-600 dark:text-purple-400">{score}</span>
              <span className="text-muted-foreground text-3xl sm:text-4xl"> / {totalQuestions}</span>
            </div>
            <div className="text-sm font-semibold text-muted-foreground">
              অ্যাক্যুরেসি রেট: <span className="text-foreground font-bold">{percentage}%</span>
            </div>

            {/* Score Progress Bar */}
            <div className="w-full h-3 bg-secondary rounded-full overflow-hidden mt-4 p-0.5">
              <div
                className="h-full bg-gradient-to-r from-purple-600 to-amber-500 rounded-full transition-all duration-1000 ease-out"
                style={{ width: `${percentage}%` }}
              />
            </div>
          </div>

          {/* Performance Feedback */}
          <div className="text-center p-4 rounded-xl bg-purple-500/10 border border-purple-500/20">
            <p className="text-sm font-semibold text-foreground">
              {percentage >= 80
                ? "🔥 অসাধারণ পারফরম্যান্স! আপনি দুর্দান্ত ফলাফল করেছেন।"
                : percentage >= 60
                ? "⚡ বেশ ভালো পারফরম্যান্স! টেকনোলজির আরও গভীর জ্ঞানে এগিয়ে যান।"
                : percentage >= 40
                ? "💡 ভালো চেষ্টা! নিয়মিত টেক প্র্যাকটিস ও অধ্যয়নে আরও উন্নতি সম্ভব।"
                : "🚀 অভিজ্ঞতা অর্জন সবচেয়ে বড় প্রাপ্তি! পরবর্তী প্রতিযোগিতায় আরও ভালো করার শুভকামনা রইলো।"}
            </p>
          </div>

          {/* 🎬 Sponsored / Promotional Video Ad Section */}
          <div className="rounded-3xl p-1 bg-gradient-to-r from-purple-500 via-amber-500 to-rose-500 shadow-xl glow-purple">
            <div className="rounded-[22px] bg-card p-4 sm:p-6 space-y-4">
              <div className="flex items-center justify-between gap-2 border-b border-border/80 pb-3">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />
                  <span className="text-xs font-black uppercase tracking-wider text-purple-600 dark:text-purple-400 flex items-center gap-1.5">
                    <Flame className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                    বিশেষ অফার
                  </span>
                </div>
                <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                  Featured
                </span>
              </div>

              {/* YouTube Video Embed with Autoplay and Sound ON (mute=0) */}
              <div className="relative w-full aspect-video rounded-2xl overflow-hidden shadow-lg border border-border/80 bg-black">
                <iframe
                  className="w-full h-full"
                  src="https://www.youtube.com/embed/2SXCR-43RjM?autoplay=1&mute=0&playsinline=1&loop=1&playlist=2SXCR-43RjM&rel=0&controls=1&enablejsapi=1"
                  title="Programming Hero Complete Course Details"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              </div>

              {/* CTA Button: View Course Details */}
              <div className="pt-1">
                <a
                  href="https://web.programming-hero.com/course-details"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full"
                >
                  <Button className="w-full h-13 sm:h-14 bg-gradient-to-r from-purple-600 via-violet-600 to-amber-500 hover:from-purple-700 hover:to-amber-600 text-white font-extrabold text-base sm:text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center gap-2.5 group">
                    <PlayCircle className="w-5 h-5 text-amber-300" />
                    <span>View Course Details</span>
                    <ExternalLink className="w-4 h-4 ml-1 group-hover:translate-x-1 group-hover:-translate-y-0.5 transition-transform" />
                  </Button>
                </a>
              </div>
            </div>
          </div>

          {/* Result Announcement Notice */}
          <div className="text-center space-y-1.5 text-xs text-muted-foreground pt-1">
            <p className="font-semibold text-foreground">
              🏆 বিজয়ীদের জন্য রয়েছে Mini UPS, Power Bank, Headphone এবং ChipkaChipki গিফট ভাউচার!
            </p>
            <p className="font-medium text-foreground">
              শীঘ্রই মেধা তালিকা ও বিজয়ীদের নাম অফিসিয়ালি ঘোষণা করা হবে।
            </p>
            <p>CPI Timeline এবং Polytechnic Coders অফিসিয়াল ফেসবুক পেজ/গ্রুপে চোখ রাখুন!</p>
          </div>

          {/* Organizers Credit */}
          <div className="pt-4 border-t border-border flex items-center justify-center gap-4">
            <div className="flex items-center gap-2">
              <div className="relative w-6 h-6 rounded-md overflow-hidden">
                <Image src="/polytechnic-coders-logo.png" alt="Polytechnic Coders" fill className="object-cover" />
              </div>
              <span className="text-xs font-bold text-foreground">Polytechnic Coders</span>
            </div>
            <span className="text-muted-foreground text-xs font-bold">×</span>
            <div className="flex items-center gap-2">
              <div className="relative w-6 h-6 rounded-md overflow-hidden">
                <Image src="/cpi-timeline-logo.png" alt="CPI Timeline" fill className="object-cover" />
              </div>
              <span className="text-xs font-bold text-foreground">CPI Timeline</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
