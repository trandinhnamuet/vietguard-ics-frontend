"use client"

import { useState } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { FileUpload } from "@/components/file-upload"
import { OTPFormModal } from "@/components/otp-form-modal"
import { useLanguage } from "@/components/language-provider"
import { CheckCircle } from "lucide-react"
import { StatsCharts } from "@/components/stats-charts"

export default function Home() {
  const { t } = useLanguage()
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isUploaded, setIsUploaded] = useState(false)

  const handleFileSelect = (file: File) => {
    setSelectedFile(file)
  }

  const handleScan = () => {
    if (selectedFile) {
      setIsModalOpen(true)
    }
  }

  const handleFormSubmit = (data: any) => {
    console.log("Form submitted:", data)
    setIsUploaded(true)
    setSelectedFile(null)
  }

  return (
    <div className="min-h-screen flex flex-col wave-animation">
      <Header />

      <main className="container mx-auto px-4 py-16 flex-1">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold mb-4 text-white drop-shadow-lg">
            {t("home.title")}
          </h1>
          <p className="text-xl text-white/90 mb-8 drop-shadow">{t("home.subtitle")}</p>
        </div>

        {/* Upload Section */}
        <div className="mb-12">
          {!isUploaded ? (
            <>
              <FileUpload onFileSelect={handleFileSelect} onScan={handleScan} />
              <p className="text-center text-sm text-white/80 mt-4 drop-shadow">{t("home.reportNote")}</p>
            </>
          ) : (
            <div className="max-w-2xl mx-auto">
              <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-12 text-center shadow-2xl">
                <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
                <h2 className="text-2xl font-bold mb-2 text-white">{t("success.message")}</h2>
                <p className="text-white/80 mb-6">{t("home.reportNote")}</p>
                <button
                  onClick={() => setIsUploaded(false)}
                  className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/80 transition-colors font-medium"
                >
                  {t("success.uploadAnother")}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Features Section */}
        <div className="grid md:grid-cols-3 gap-8 mt-20 mb-20">
          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6 hover:shadow-2xl hover:bg-white/15 transition-all duration-300">
            <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center mb-4">
              <span className="text-2xl">🔒</span>
            </div>
            <h3 className="text-lg font-semibold mb-2 text-white">Advanced Security</h3>
            <p className="text-white/80 text-sm">Comprehensive APK analysis with advanced security scanning</p>
          </div>

          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6 hover:shadow-2xl hover:bg-white/15 transition-all duration-300">
            <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center mb-4">
              <span className="text-2xl">⚡</span>
            </div>
            <h3 className="text-lg font-semibold mb-2 text-white">Fast Analysis</h3>
            <p className="text-white/80 text-sm">Quick and efficient scanning with detailed reports</p>
          </div>

          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6 hover:shadow-2xl hover:bg-white/15 transition-all duration-300">
            <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center mb-4">
              <span className="text-2xl">📊</span>
            </div>
            <h3 className="text-lg font-semibold mb-2 text-white">Detailed Reports</h3>
            <p className="text-white/80 text-sm">Comprehensive security assessment and recommendations</p>
          </div>
        </div>

        <div className="py-12">
          <StatsCharts />
        </div>
      </main>

      {/* OTP Form Modal */}
      <OTPFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleFormSubmit}
        fileName={selectedFile?.name || ""}
      />

      <Footer />
    </div>
  )
}
