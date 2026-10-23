import { NextResponse } from "next/server"
import { QUIZ_CONFIG } from "@/lib/quiz-data"

export const dynamic = "force-dynamic"
export const revalidate = 0

export async function GET() {
  if (!QUIZ_CONFIG.googleScriptUrl) {
    return NextResponse.json({
      status: "error",
      message: "Google Script URL not configured",
      total: 0,
      leaderboard: [],
    })
  }

  try {
    const res = await fetch(QUIZ_CONFIG.googleScriptUrl, {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
      cache: "no-store",
    })

    const text = await res.text()

    // Try parsing JSON returned by Google Apps Script
    try {
      const data = JSON.parse(text)
      const rawList = Array.isArray(data.leaderboard) ? data.leaderboard : []

      // Helper to parse numeric percentage
      const parseNumericPercentage = (item: any) => {
        if (typeof item.percentage === "number") return item.percentage
        if (typeof item.percentage === "string") {
          const parsed = parseFloat(item.percentage.replace("%", "").trim())
          if (!isNaN(parsed)) return parsed
        }
        const s = Number(item.score) || 0
        const t = Number(item.totalQuestions) || 30
        return t > 0 ? (s / t) * 100 : 0
      }

      // Sort calculation: Score + Percentage
      const sortedLeaderboard = [...rawList].sort((a: any, b: any) => {
        const scoreA = Number(a.score) || 0
        const scoreB = Number(b.score) || 0
        if (scoreB !== scoreA) {
          return scoreB - scoreA
        }
        const bPerc = parseNumericPercentage(b)
        const aPerc = parseNumericPercentage(a)
        if (bPerc !== aPerc) {
          return bPerc - aPerc
        }
        const timeA = a.timestamp ? new Date(a.timestamp).getTime() : 0
        const timeB = b.timestamp ? new Date(b.timestamp).getTime() : 0
        return timeA - timeB
      })

      return NextResponse.json({
        status: data.status || "ok",
        total: sortedLeaderboard.length,
        leaderboard: sortedLeaderboard,
        updatedAt: data.updatedAt || new Date().toISOString(),
      })
    } catch {
      // If Apps Script returns HTML (e.g., doGet not found error in older deployment)
      const isDoGetMissing = text.includes("doGet")
      return NextResponse.json({
        status: "pending_deployment",
        isDoGetMissing,
        message: isDoGetMissing
          ? "Google Apps Script এ doGet ফাংশন পাওয়া যায়নি। Apps Script এ New Version ডিপ্লয় করতে হবে।"
          : "Google Apps Script থেকে HTML এসেছে।",
        total: 0,
        leaderboard: [],
      })
    }
  } catch (error: any) {
    return NextResponse.json({
      status: "error",
      message: error?.message || "Failed to fetch from Google Apps Script",
      total: 0,
      leaderboard: [],
    })
  }
}
