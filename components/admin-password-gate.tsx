"use client"

import { useState, useEffect, useCallback } from "react"
import { Lock, Eye, EyeOff, ShieldAlert } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

const COOKIE_NAME = "admin_password"
const COOKIE_MAX_AGE = 60 * 60 * 8 // 8 hours

function getPasswordCookie(): string | null {
  if (typeof document === "undefined") return null
  const match = document.cookie
    .split("; ")
    .find((row) => row.startsWith(`${COOKIE_NAME}=`))
  return match ? decodeURIComponent(match.split("=")[1]) : null
}

function setPasswordCookie(password: string) {
  document.cookie = `${COOKIE_NAME}=${encodeURIComponent(password)}; path=/; max-age=${COOKIE_MAX_AGE}; SameSite=Strict`
}

function clearPasswordCookie() {
  document.cookie = `${COOKIE_NAME}=; path=/; max-age=0`
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api"

async function verifyPasswordWithBackend(password: string): Promise<boolean> {
  try {
    const res = await fetch(`${API_BASE_URL}/admin/verify-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    })
    return res.ok
  } catch {
    return false
  }
}

interface AdminPasswordGateProps {
  children: React.ReactNode
}

export function AdminPasswordGate({ children }: AdminPasswordGateProps) {
  const [authenticated, setAuthenticated] = useState(false)
  const [checking, setChecking] = useState(true)
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // On mount: check if there is already a saved password cookie and verify it
  const checkSavedPassword = useCallback(async () => {
    const saved = getPasswordCookie()
    if (saved) {
      const valid = await verifyPasswordWithBackend(saved)
      if (valid) {
        setAuthenticated(true)
        setChecking(false)
        return
      }
      // Saved password is wrong (e.g. password changed) — clear it
      clearPasswordCookie()
    }
    setChecking(false)
  }, [])

  useEffect(() => {
    checkSavedPassword()
  }, [checkSavedPassword])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!password.trim()) return

    setLoading(true)
    setError(null)

    const valid = await verifyPasswordWithBackend(password)

    if (valid) {
      setPasswordCookie(password)
      setAuthenticated(true)
    } else {
      setError("Mật khẩu không đúng. Vui lòng thử lại.")
      setPassword("")
    }

    setLoading(false)
  }

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <div className="flex items-center gap-3 text-slate-400">
          <div className="w-5 h-5 border-2 border-slate-400 border-t-transparent rounded-full animate-spin" />
          <span>Đang kiểm tra...</span>
        </div>
      </div>
    )
  }

  if (!authenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4">
        <div className="bg-slate-800/60 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-8 w-full max-w-sm shadow-2xl">
          {/* Icon */}
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-primary/10 border border-primary/30 rounded-full flex items-center justify-center">
              <Lock className="w-8 h-8 text-primary" />
            </div>
          </div>

          {/* Title */}
          <h1 className="text-2xl font-bold text-white text-center mb-1">Admin Panel</h1>
          <p className="text-slate-400 text-center text-sm mb-6">
            Nhập mật khẩu để truy cập khu vực quản trị
          </p>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="Nhập mật khẩu..."
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value)
                  setError(null)
                }}
                className="bg-slate-900/50 border-slate-600 text-white placeholder:text-slate-500 pr-10 focus:border-primary"
                autoFocus
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 transition-colors"
                tabIndex={-1}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            {error && (
              <div className="flex items-center gap-2 text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
                <ShieldAlert className="w-4 h-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <Button
              type="submit"
              className="w-full"
              disabled={loading || !password.trim()}
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Đang xác thực...
                </span>
              ) : (
                "Đăng nhập"
              )}
            </Button>
          </form>
        </div>
      </div>
    )
  }

  return <>{children}</>
}

export { getPasswordCookie, clearPasswordCookie }
