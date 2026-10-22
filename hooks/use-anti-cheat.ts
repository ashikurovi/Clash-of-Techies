"use client"

import { useEffect, useState, useCallback } from "react"

const MAX_TAB_SWITCHES = 2

export function useAntiCheat(isActive: boolean, onForceSubmit: () => void) {
  const [tabSwitchCount, setTabSwitchCount] = useState(0)

  const handleVisibilityChange = useCallback(() => {
    if (document.hidden && isActive) {
      setTabSwitchCount((prev) => {
        const newCount = prev + 1
        if (newCount >= MAX_TAB_SWITCHES) {
          alert("⚠️ সতর্কতা: আপনি ২ বারের বেশি ট্যাব পরিবর্তন করেছেন। আপনার কুইজ স্বয়ংক্রিয়ভাবে জমা হয়ে যাচ্ছে।")
          setTimeout(() => {
            onForceSubmit()
          }, 100)
        } else {
          alert(`⚠️ সতর্কতা: ট্যাব পরিবর্তন সনাক্ত হয়েছে! (${newCount}/${MAX_TAB_SWITCHES})\n\nদয়া করে কুইজ চলাকালীন অন্য ট্যাবে যাবেন না। আরও ${MAX_TAB_SWITCHES - newCount} বার করলে আপনার কুইজ স্বয়ংক্রিয়ভাবে জমা হয়ে যাবে।`)
        }
        return newCount
      })
    }
  }, [isActive, onForceSubmit])

  useEffect(() => {
    if (!isActive) return

    // Disable text selection
    document.body.style.userSelect = "none"
    document.body.style.webkitUserSelect = "none"

    // Disable right-click
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault()
      return false
    }

    // Disable copy-paste shortcuts
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl+C, Ctrl+V, Ctrl+X, Ctrl+A, Ctrl+U (view source)
      if (
        e.ctrlKey &&
        (e.key === "c" || e.key === "v" || e.key === "x" || e.key === "a" || e.key === "u")
      ) {
        e.preventDefault()
        return false
      }
      // F12 (dev tools)
      if (e.key === "F12") {
        e.preventDefault()
        return false
      }
      // Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+Shift+C (dev tools)
      if (e.ctrlKey && e.shiftKey && (e.key === "I" || e.key === "J" || e.key === "C")) {
        e.preventDefault()
        return false
      }
    }

    // Disable drag
    const handleDragStart = (e: DragEvent) => {
      e.preventDefault()
      return false
    }

    // Add event listeners
    document.addEventListener("contextmenu", handleContextMenu)
    document.addEventListener("keydown", handleKeyDown)
    document.addEventListener("dragstart", handleDragStart)
    document.addEventListener("visibilitychange", handleVisibilityChange)

    // Cleanup
    return () => {
      document.body.style.userSelect = ""
      document.body.style.webkitUserSelect = ""
      document.removeEventListener("contextmenu", handleContextMenu)
      document.removeEventListener("keydown", handleKeyDown)
      document.removeEventListener("dragstart", handleDragStart)
      document.removeEventListener("visibilitychange", handleVisibilityChange)
    }
  }, [isActive, handleVisibilityChange])

  return { tabSwitchCount }
}
