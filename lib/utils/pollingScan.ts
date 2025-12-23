import { getScanStatus, type ScanStatusResponse } from "@/lib/api/scanService"

export type { ScanStatusResponse }

export interface PollingOptions {
  taskId: string
  onStatusUpdate: (status: ScanStatusResponse) => void
  onSuccess: (result: ScanStatusResponse) => void
  onError: (error: Error) => void
  intervalMs?: number
  maxAttempts?: number
}

/**
 * Start polling for scan status
 * Returns a cleanup function to stop polling
 */
export function startScanPolling({
  taskId,
  onStatusUpdate,
  onSuccess,
  onError,
  intervalMs = 30000, // 30 seconds interval
  maxAttempts = 120, // Max 60 minutes with 30s interval (120 * 30s = 3600s = 60 minutes)
}: PollingOptions): () => void {
  let attempts = 0
  let isActive = true

  const poll = async () => {
    if (!isActive || attempts >= maxAttempts) {
      if (attempts >= maxAttempts) {
        onError(new Error("Scan polling timeout after 60 minutes"))
      }
      return
    }

    attempts++

    try {
      const statusResponse = await getScanStatus(taskId)
      onStatusUpdate(statusResponse)

      // Check status from data.status (new format) or status (legacy)
      const currentStatus = (statusResponse.data?.status || statusResponse.status)?.toLowerCase()
      
      if (currentStatus === "completed" || currentStatus === "success" || currentStatus === "failed") {
        isActive = false
        if (currentStatus === "completed" || currentStatus === "success") {
          onSuccess(statusResponse)
        } else if (currentStatus === "failed") {
          onError(new Error("Đã có lỗi xảy ra. File apk của bạn sai cấu trúc hoặc chưa có chữ kí."))
        } else {
          onError(new Error(statusResponse.error || "Scan failed"))
        }
      } else {
        // Continue polling for InProgress, Pending, processing, pending
        setTimeout(poll, intervalMs)
      }
    } catch (error) {
      isActive = false
      onError(error instanceof Error ? error : new Error("Polling error"))
    }
  }

  // Start first poll immediately
  poll()

  // Return cleanup function
  return () => {
    isActive = false
  }
}

/**
 * Calculate progress based on status
 */
export function calculateScanProgress(status: string): number {
  switch (status) {
    case "pending":
      return 20
    case "processing":
      return 60
    case "completed":
      return 100
    case "failed":
      return 100
    case "Failed":
      return 100
    default:
      return 0
  }
}

/**
 * Format status text for display
 */
export function formatStatusText(status: string): string {
  const statusMap: Record<string, string> = {
    pending: "Waiting to start...",
    processing: "Scanning app...",
    completed: "Scan completed",
    failed: "Scan failed",
    Failed: "Scan failed",
  }
  return statusMap[status] || status
}
