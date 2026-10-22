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
      return NextResponse.json({
        status: data.status || "ok",
        total: Array.isArray(data.leaderboard) ? data.leaderboard.length : 0,
        leaderboard: Array.isArray(data.leaderboard) ? data.leaderboard : [],
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
