"use client"

import { useState, useRef, useEffect } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { FileUpload } from "@/components/file-upload"
import { OTPFormModal, type OTPFormData } from "@/components/otp-form-modal"
import { useLanguage } from "@/components/language-provider"
import { CheckCircle, AlertCircle, Download, Loader2, RotateCcw } from "lucide-react"
import { StatsCharts } from "@/components/stats-charts"
import { createScanTask, getClientIp } from "@/lib/api/scanService"
import { startScanPolling, calculateScanProgress, formatStatusText, type ScanStatusResponse } from "@/lib/utils/pollingScan"

export default function Home() {
  const { t } = useLanguage()
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isScanning, setIsScanning] = useState(false)
  const [scanProgress, setScanProgress] = useState(0)
  const [scanStatus, setScanStatus] = useState<string>("")
  const [taskId, setTaskId] = useState<string | null>(null)
  const [scanResult, setScanResult] = useState<ScanStatusResponse | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [memberEmail, setMemberEmail] = useState<string | null>(null)
  const pollingCleanupRef = useRef<(() => void) | null>(null)

  // Cleanup polling on unmount
  useEffect(() => {
    return () => {
      if (pollingCleanupRef.current) {
        pollingCleanupRef.current()
      }
    }
  }, [])

  const handleFileSelect = (file: File) => {
    setSelectedFile(file)
    setError(null)
  }

  const handleScan = () => {
    if (selectedFile) {
      setIsModalOpen(true)
    }
  }

  const handleFormSubmit = async (data: OTPFormData) => {
    if (!selectedFile || !data.memberEmail) {
      setError("Missing file or member email")
      return
    }

    setIsScanning(true)
    setError(null)
    setScanStatus("Starting scan...")
    setScanProgress(10)
    setMemberEmail(data.memberEmail)

    try {
      // Get client IP
      const clientIp = await getClientIp()

      // Upload file and create scan task
      const result = await createScanTask(data.email, selectedFile, clientIp)
      console.log("Scan task created:", result)
      const externalTaskId = result.data?.id || result.taskId
      console.log("Using task ID:", externalTaskId)
      console.log(result.data)
      
      if (!externalTaskId) {
        throw new Error("Failed to get task ID from scan response")
      }
      
      setTaskId(externalTaskId)
      setScanProgress(20)
      setScanStatus("Upload completed, starting analysis...")

      // Start polling for status
      if (pollingCleanupRef.current) {
        pollingCleanupRef.current()
      }

      const cleanup = startScanPolling({
        taskId: externalTaskId,
        onStatusUpdate: (status: ScanStatusResponse) => {
          const currentStatus = status.data?.status || status.status || "pending"
          setScanStatus(formatStatusText(currentStatus))
          setScanProgress(calculateScanProgress(currentStatus))
        },
        onSuccess: (result: ScanStatusResponse) => {
          setScanResult(result)
          setScanProgress(100)
          setScanStatus("Scan completed successfully!")
          setIsScanning(false)
          setSelectedFile(null)
        },
        onError: (err: Error) => {
          // Check if it's a rate limit error
          const errorMessage = err.message || "Scan failed"
          if (errorMessage.includes("too frequently") || errorMessage.includes("9004") || errorMessage.includes("Uploading too frequently")) {
            setError("Bạn đã scan quá nhiều lần. Hãy thử scan lại sau hoặc liên hệ với chúng tôi.")
          } else {
            setError(errorMessage)
          }
          setIsScanning(false)
        },
      })

      pollingCleanupRef.current = cleanup
    } catch (err: any) {
      // Check if it's a rate limit error
      const errorMessage = err.message || "Failed to start scan"
      if (errorMessage.includes("too frequently") || errorMessage.includes("9004") || errorMessage.includes("Uploading too frequently")) {
        setError("Bạn đã scan quá nhiều lần. Hãy thử scan lại sau hoặc liên hệ với chúng tôi.")
      } else {
        setError(errorMessage)
      }
      setIsScanning(false)
    }
  }

  const handleDownloadReport = async () => {
    if (!taskId) {
      setError("No task ID available")
      return
    }

    try {
      // Import downloadReport to avoid circular dependency
      const { downloadReport } = await import("@/lib/api/scanService")
      // Don't pass fixed filename - let backend decide based on actual file type
      await downloadReport(taskId)
    } catch (err: any) {
      setError(err.message || "Failed to download report")
    }
  }

  const handleReset = () => {
    setSelectedFile(null)
    setIsScanning(false)
    setScanProgress(0)
    setScanStatus("")
    setTaskId(null)
    setScanResult(null)
    setError(null)
    setMemberEmail(null)
    if (pollingCleanupRef.current) {
      pollingCleanupRef.current()
      pollingCleanupRef.current = null
    }
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

        {/* Error Banner */}
        {error && (
          <div className="max-w-2xl mx-auto mb-6 p-4 bg-destructive/10 border border-destructive rounded-lg flex gap-3 items-start">
            <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-destructive font-medium">{error}</p>
            </div>
          </div>
        )}

        {/* Upload Section */}
        <div className="mb-12">
          {!isScanning && !scanResult ? (
            <>
              <FileUpload onFileSelect={handleFileSelect} onScan={handleScan} />
              <p className="text-center text-sm text-white/80 mt-4 drop-shadow">{t("home.reportNote")}</p>
            </>
          ) : isScanning ? (
            // Scanning Progress Section
            <div className="max-w-2xl mx-auto">
              <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-8 shadow-2xl">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-white">Scanning App...</h2>
                  <Loader2 className="w-6 h-6 text-primary animate-spin" />
                </div>

                {/* Always show status message, never show progress bar */}
                <div className="bg-blue-500/20 border border-blue-400/50 rounded-lg p-4 text-center">
                  <p className="text-white/90 font-medium mb-2">Quét ứng dụng đang diễn ra...</p>
                  <p className="text-white/80 text-sm">Bạn có thể thoát khỏi trang này. Báo cáo sẽ được gửi về email của bạn sau 10-30 phút.</p>
                </div>
              </div>
            </div>
          ) : scanResult ? (
            // Result Section
            <div className="max-w-2xl mx-auto space-y-4">
              {/* Success Message */}
              <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-8 shadow-2xl">
                <div className="flex items-center gap-3 mb-4">
                  <CheckCircle className="w-8 h-8 text-success" />
                  <h2 className="text-2xl font-bold text-white">Scan Completed!</h2>
                </div>
                <p className="text-white/80">{t("home.reportNote")}</p>
              </div>

              {/* Result Details */}
              {scanResult.result && (
                <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6 shadow-xl">
                  <h3 className="text-lg font-semibold text-white mb-4">Scan Results</h3>
                  <div className="space-y-3">
                    {scanResult.result.riskLevel && (
                      <div className="flex justify-between items-center">
                        <span className="text-white/80">Risk Level:</span>
                        <span className={`font-semibold ${
                          scanResult.result.riskLevel === "HIGH" ? "text-destructive" :
                          scanResult.result.riskLevel === "MEDIUM" ? "text-yellow-500" :
                          "text-success"
                        }`}>
                          {scanResult.result.riskLevel}
                        </span>
                      </div>
                    )}
                    {scanResult.result.appName && (
                      <div className="flex justify-between items-center">
                        <span className="text-white/80">App Name:</span>
                        <span className="text-white">{scanResult.result.appName}</span>
                      </div>
                    )}
                    {scanResult.result.packageName && (
                      <div className="flex justify-between items-center">
                        <span className="text-white/80">Package:</span>
                        <span className="text-white text-sm">{scanResult.result.packageName}</span>
                      </div>
                    )}
                    {scanResult.result.detectedThreats && scanResult.result.detectedThreats.length > 0 && (
                      <div>
                        <span className="text-white/80 block mb-2">Detected Threats:</span>
                        <div className="flex flex-wrap gap-2">
                          {scanResult.result.detectedThreats.map((threat: string, idx: number) => (
                            <span key={idx} className="px-2 py-1 bg-destructive/20 text-destructive rounded text-xs">
                              {threat}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={handleDownloadReport}
                  className="flex-1 px-4 py-3 bg-white text-black rounded-lg hover:bg-gray-100 transition-colors font-medium flex items-center justify-center gap-2"
                >
                  <Download className="w-5 h-5" />
                  Download Report
                </button>
                <button
                  onClick={handleReset}
                  className="flex-1 px-4 py-3 border border-border rounded-lg hover:bg-white/5 transition-colors font-medium flex items-center justify-center gap-2"
                >
                  <RotateCcw className="w-5 h-5" />
                  Scan Another
                </button>
              </div>
            </div>
          ) : null}
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
