"use client"

import type React from "react"
import { useState } from "react"
import { X, Loader2, AlertCircle, CheckCircle } from "lucide-react"
import { useLanguage } from "./language-provider"
import {
  sendOtp,
  verifyOtp,
  submitUserInfo,
  createMemberWithService,
  getClientIp,
} from "@/lib/api/scanService"

interface OTPFormModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: OTPFormData) => void
  fileName: string
  fileSize?: number
}

export interface OTPFormData {
  email: string
  otp: string
  fullName: string
  company: string
  phone: string
  notes: string
  memberEmail?: string
  fileName?: string
  fileSize?: number
}

export function OTPFormModal({ isOpen, onClose, onSubmit, fileName, fileSize }: OTPFormModalProps) {
  const { t } = useLanguage()
  const [formData, setFormData] = useState<OTPFormData>({
    email: "",
    otp: "",
    fullName: "",
    company: "",
    phone: "",
    notes: "",
  })
  const [otpSent, setOtpSent] = useState(false)
  const [otpVerified, setOtpVerified] = useState(false)
  const [loading, setLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, email: e.target.value })
    setError(null)
  }

  const handleSendOTP = async () => {
    if (!formData.email) {
      setError("Please enter email address")
      return
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email)) {
      setError("Invalid email address")
      return
    }

    setLoading(true)
    setError(null)
    try {
      await sendOtp(formData.email)
      setOtpSent(true)
      setSuccessMessage("OTP sent successfully to your email")
      setTimeout(() => setSuccessMessage(null), 3000)
    } catch (err: any) {
      setError(err.message || "Failed to send OTP")
    } finally {
      setLoading(false)
    }
  }

  const handleVerifyOTP = async () => {
    if (formData.otp.length !== 6) {
      setError("OTP must be 6 digits")
      return
    }

    setLoading(true)
    setError(null)
    try {
      // Get client IP to update access log with email
      const ipData = await getClientIp()
      console.log('Client IP data in OTP verify:', ipData)
      const result = await verifyOtp(formData.email, formData.otp, ipData.ipv4, ipData.ipv6)
      if (result.verified) {
        setOtpVerified(true)
        setSuccessMessage("OTP verified successfully")
        setTimeout(() => setSuccessMessage(null), 2000)
      } else {
        setError("OTP verification failed")
      }
    } catch (err: any) {
      setError(err.message || "Failed to verify OTP")
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
    setError(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!otpVerified) {
      setError("Please verify OTP first")
      return
    }

    if (!formData.fullName || !formData.company || !formData.phone) {
      setError("Please fill in all required fields")
      return
    }

    setSubmitting(true)
    setError(null)
    try {
      // Step 1: Submit user info
      await submitUserInfo({
        email: formData.email,
        otp: formData.otp,
        full_name: formData.fullName,
        company_name: formData.company,
        phone: formData.phone,
        note: formData.notes,
        file_name: fileName,
        file_size: fileSize,
      })

      // Step 2: Create member with service (AppTotalGo)
      await createMemberWithService({
        email: formData.email,
        services: [{ serviceType: 4 }], // 4 = AppTotalGo
      })

      // Call parent's onSubmit with member email for later use
      formData.memberEmail = formData.email
      onSubmit(formData)

      // Reset form
      setFormData({
        email: "",
        otp: "",
        fullName: "",
        company: "",
        phone: "",
        notes: "",
      })
      setOtpSent(false)
      setOtpVerified(false)

      // Close modal
      setTimeout(() => {
        onClose()
      }, 500)
    } catch (err: any) {
      setError(err.message || "Failed to submit form. Please try again.")
    } finally {
      setSubmitting(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-[#0A2C3D] border border-border rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border sticky top-0 bg-[#0A2C3D] text-white">
          <h2 className="text-xl font-bold">{t("form.scanInfo")}</h2>
          <button
            onClick={onClose}
            disabled={loading || submitting}
            className="p-1 hover:bg-muted rounded-lg transition-colors disabled:opacity-50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-white">
          {/* Error Message */}
          {error && (
            <div className="p-3 bg-destructive/10 border border-destructive rounded-lg flex gap-2 items-start text-sm text-destructive">
              <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <p>{error}</p>
            </div>
          )}

          {/* Success Message */}
          {successMessage && (
            <div className="p-3 bg-success/10 border border-success rounded-lg flex gap-2 items-start text-sm text-success">
              <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <p>{successMessage}</p>
            </div>
          )}

          {/* Email with OTP */}
          <div>
            <label className="block text-sm font-medium mb-2">{t("form.email")}</label>
            <div className="flex gap-2">
              <input
                type="email"
                value={formData.email}
                onChange={handleEmailChange}
                disabled={otpSent || submitting}
                className="flex-1 px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary disabled:bg-muted disabled:opacity-50"
                placeholder="your@email.com"
              />
              <button
                type="button"
                onClick={handleSendOTP}
                disabled={!formData.email || otpSent || loading || submitting}
                className="px-4 py-2 bg-white text-black rounded-lg hover:bg-gray-100 disabled:bg-muted disabled:text-muted-foreground transition-colors flex items-center gap-2 whitespace-nowrap"
              >
                {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                {otpSent ? "Sent" : t("form.sendOtp")}
              </button>
            </div>
          </div>

          {/* OTP Input */}
          {otpSent && !otpVerified && (
            <div>
              <label className="block text-sm font-medium mb-2">{t("form.otp")}</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={formData.otp}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, "").slice(0, 6)
                    setFormData({ ...formData, otp: value })
                    setError(null)
                  }}
                  maxLength={6}
                  disabled={submitting}
                  className="flex-1 px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-center text-lg tracking-widest disabled:bg-muted disabled:opacity-50"
                  placeholder="000000"
                  autoComplete="off"
                />
                <button
                  type="button"
                  onClick={handleVerifyOTP}
                  disabled={formData.otp.length !== 6 || loading || submitting}
                  className="px-4 py-2 bg-white text-black rounded-lg hover:bg-gray-100 disabled:bg-muted disabled:text-muted-foreground transition-colors flex items-center gap-2 whitespace-nowrap"
                >
                  {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                  {t("form.verifyOtp")}
                </button>
              </div>
            </div>
          )}

          {/* OTP Verified Badge */}
          {otpVerified && (
            <div className="p-3 bg-success/10 border border-success rounded-lg text-sm text-success font-medium flex gap-2 items-center">
              <CheckCircle className="w-4 h-4" />✓ {t("form.emailVerified")}
            </div>
          )}

          {/* User Info Fields */}
          {otpVerified && (
            <>
              <div>
                <label className="block text-sm font-medium mb-2">
                  {t("form.fullname")} <span className="text-destructive">*</span>
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  disabled={submitting}
                  className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary disabled:bg-muted disabled:opacity-50"
                  placeholder="Nguyễn Văn A"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  {t("form.company")} <span className="text-destructive">*</span>
                </label>
                <input
                  type="text"
                  name="company"
                  value={formData.company}
                  onChange={handleInputChange}
                  disabled={submitting}
                  className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary disabled:bg-muted disabled:opacity-50"
                  placeholder="Công ty ABC"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  {t("form.phone")} <span className="text-destructive">*</span>
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  disabled={submitting}
                  className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary disabled:bg-muted disabled:opacity-50"
                  placeholder="+84 123 456 789"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">{t("form.notes")}</label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  disabled={submitting}
                  className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary resize-none disabled:bg-muted disabled:opacity-50"
                  rows={2}
                  placeholder="Ghi chú thêm..."
                />
              </div>

              {/* Submit Buttons */}
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={submitting}
                  className="flex-1 px-4 py-2 border border-border rounded-lg hover:bg-muted transition-colors font-medium disabled:opacity-50"
                >
                  {t("form.cancel")}
                </button>
                <button
                  type="submit"
                  disabled={submitting || loading}
                  className="flex-1 px-4 py-2 bg-white text-black rounded-lg hover:bg-gray-100 disabled:opacity-50 transition-all font-medium flex items-center justify-center gap-2"
                >
                  {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
                  {submitting ? "Submitting..." : t("form.submit")}
                </button>
              </div>
            </>
          )}
        </form>
      </div>
    </div>
  )
}
