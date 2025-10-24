"use client"

import type React from "react"
import { useState } from "react"
import { X, Loader2 } from "lucide-react"
import { useLanguage } from "./language-provider"

interface OTPFormModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: FormData) => void
  fileName: string
}

interface FormData {
  email: string
  otp: string
  fullName: string
  company: string
  phone: string
  notes: string
  requirements: string
}

export function OTPFormModal({ isOpen, onClose, onSubmit, fileName }: OTPFormModalProps) {
  const { t } = useLanguage()
  const [formData, setFormData] = useState<FormData>({
    email: "",
    otp: "",
    fullName: "",
    company: "",
    phone: "",
    notes: "",
    requirements: "",
  })
  const [otpSent, setOtpSent] = useState(false)
  const [otpVerified, setOtpVerified] = useState(false)
  const [loading, setLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, email: e.target.value })
  }

  const handleSendOTP = async () => {
    if (!formData.email) return
    setLoading(true)
    // Simulate OTP sending
    setTimeout(() => {
      setOtpSent(true)
      setLoading(false)
    }, 1000)
  }

  const handleVerifyOTP = () => {
    if (formData.otp.length === 6) {
      setOtpVerified(true)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!otpVerified) return

    setSubmitting(true)
    // Simulate API call
    setTimeout(() => {
      onSubmit(formData)
      setSubmitting(false)
      setFormData({
        email: "",
        otp: "",
        fullName: "",
        company: "",
        phone: "",
        notes: "",
        requirements: "",
      })
      setOtpSent(false)
      setOtpVerified(false)
      onClose()
    }, 1000)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-[#0A2C3D] border border-border rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border sticky top-0 bg-[#0A2C3D] text-white">
          <h2 className="text-xl font-bold">{t("form.scanInfo")}</h2>
          <button onClick={onClose} className="p-1 hover:bg-muted rounded-lg transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-white">
          {/* Email with OTP */}
          <div>
            <label className="block text-sm font-medium mb-2">{t("form.email")}</label>
            <div className="flex gap-2">
              <input
                type="email"
                value={formData.email}
                onChange={handleEmailChange}
                disabled={otpSent}
                className="flex-1 px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary disabled:bg-muted"
                placeholder="your@email.com"
              />
              <button
                type="button"
                onClick={handleSendOTP}
                disabled={!formData.email || otpSent || loading}
                className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark disabled:bg-muted disabled:text-muted-foreground transition-colors flex items-center gap-2"
              >
                {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                {t("form.sendOtp")}
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
                  }}
                  maxLength={6}
                  className="flex-1 px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-center text-lg tracking-widest"
                  placeholder="000000"
                />
                <button
                  type="button"
                  onClick={handleVerifyOTP}
                  disabled={formData.otp.length !== 6}
                  className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark disabled:bg-muted disabled:text-muted-foreground transition-colors"
                >
                  {t("form.verifyOtp")}
                </button>
              </div>
            </div>
          )}

          {/* OTP Verified Badge */}
          {otpVerified && (
            <div className="p-3 bg-success/10 border border-success rounded-lg text-sm text-success font-medium">
              ✓ {t("form.emailVerified")}
            </div>
          )}

          {/* Other Fields */}
          {otpVerified && (
            <>
              <div>
                <label className="block text-sm font-medium mb-2">{t("form.fullname")}</label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Nguyễn Văn A"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">{t("form.company")}</label>
                <input
                  type="text"
                  name="company"
                  value={formData.company}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Công ty ABC"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">{t("form.phone")}</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="+84 123 456 789"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">{t("form.notes")}</label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                  rows={3}
                  placeholder="Ghi chú thêm..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">{t("form.requirements")}</label>
                <input
                  type="text"
                  name="requirements"
                  value={formData.requirements}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Nhu cầu của bạn"
                />
              </div>

              {/* Submit Buttons */}
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 px-4 py-2 border border-border rounded-lg hover:bg-muted transition-colors font-medium"
                >
                  {t("form.cancel")}
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-primary to-secondary text-white rounded-lg hover:shadow-lg disabled:opacity-50 transition-all font-medium flex items-center justify-center gap-2"
                >
                  {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
                  {t("form.submit")}
                </button>
              </div>
            </>
          )}
        </form>
      </div>
    </div>
  )
}
