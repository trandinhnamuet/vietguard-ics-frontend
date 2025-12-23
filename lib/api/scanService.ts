/**
 * Scan Service - API wrapper for VietGuardScan Backend
 * Handles all API calls for member management and app scanning
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api"

// ============= TYPE DEFINITIONS =============
export interface SendOtpRequest {
  email: string
}

export interface SendOtpResponse {
  message: string
}

export interface VerifyOtpRequest {
  email: string
  otp: string
  ipv4?: string
  ipv6?: string
}

export interface VerifyOtpResponse {
  verified: boolean
  message?: string
}

export interface SubmitUserInfoRequest {
  email: string
  otp: string
  full_name: string
  company_name: string
  phone: string
  note?: string
  file_name?: string
  file_size?: number
}

export interface SubmitUserInfoResponse {
  message: string
}

export interface ServiceType {
  serviceType: number // 4 = AppTotalGo
}

export interface CreateMemberWithServiceRequest {
  email: string
  services: ServiceType[]
}

export interface CreateMemberWithServiceResponse {
  member: {
    id: string
    email: string
    services: any[]
  }
  message?: string
}

export interface CreateScanTaskRequest {
  memberName: string
  clientIp: string
  file: File
}

export interface CreateScanTaskResponse {
  code?: string
  message?: string
  data?: {
    id: string
  }
  // Legacy fields for backward compatibility
  taskId?: string
  status?: string
}

export interface ScanStatusResponse {
  code?: string
  message?: string
  data?: {
    id: string
    status: "pending" | "processing" | "completed" | "failed" | "Success" | "InProgress" | "Pending"
  }
  // Legacy fields for backward compatibility
  taskId?: string
  status?: "pending" | "processing" | "completed" | "failed" | "Success" | "InProgress" | "Pending"
  progress?: number
  result?: {
    riskLevel?: string
    detectedThreats?: string[]
    appName?: string
    packageName?: string
    permissions?: string[]
    [key: string]: any
  }
  error?: string
}

// ============= API FUNCTIONS =============

/**
 * 1. Send OTP to email
 */
export async function sendOtp(email: string): Promise<SendOtpResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/members/send-otp`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || "Failed to send OTP")
    }

    return await response.json()
  } catch (error) {
    console.error("Send OTP error:", error)
    throw error
  }
}

/**
 * 2. Verify OTP
 */
export async function verifyOtp(email: string, otp: string, ipv4?: string, ipv6?: string): Promise<VerifyOtpResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/members/verify-otp`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, otp, ipv4, ipv6 }),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || "Failed to verify OTP")
    }

    return await response.json()
  } catch (error) {
    console.error("Verify OTP error:", error)
    throw error
  }
}

/**
 * 3. Submit user information
 */
export async function submitUserInfo(
  request: SubmitUserInfoRequest
): Promise<SubmitUserInfoResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/members/submit-info`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(request),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || "Failed to submit user info")
    }

    return await response.json()
  } catch (error) {
    console.error("Submit user info error:", error)
    throw error
  }
}

/**
 * 4. Create member with service
 */
export async function createMemberWithService(
  request: CreateMemberWithServiceRequest
): Promise<CreateMemberWithServiceResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/members/create-with-service`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(request),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || "Failed to create member with service")
    }

    return await response.json()
  } catch (error) {
    console.error("Create member with service error:", error)
    throw error
  }
}

/**
 * 5. Create scan task - Upload APK and start scanning
 */
export async function createScanTask(
  memberName: string,
  file: File,
  clientIp: string = ""
): Promise<CreateScanTaskResponse> {
  try {
    const formData = new FormData()
    formData.append("memberName", memberName)
    formData.append("file", file)
    if (clientIp) {
      formData.append("clientIp", clientIp)
    }

    const response = await fetch(`${API_BASE_URL}/service/app-total-go`, {
      method: "POST",
      body: formData,
      // Don't set Content-Type header - browser will set it automatically
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || "Failed to create scan task")
    }

    return await response.json()
  } catch (error) {
    console.error("Create scan task error:", error)
    throw error
  }
}

/**
 * 6. Get scan task status
 */
export async function getScanStatus(taskId: string): Promise<ScanStatusResponse> {
  try {
    const response = await fetch(
      `${API_BASE_URL}/service/app-total-go/status/${taskId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    )

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || "Failed to get scan status")
    }

    const responseData = await response.json()
    // Return full response structure: { code, message, data: { id, status } }
    return responseData as ScanStatusResponse
  } catch (error) {
    console.error("Get scan status error:", error)
    throw error
  }
}

/**
 * 7. Download scan report file
 */
export async function downloadReport(taskId: string): Promise<void> {
  try {
    const response = await fetch(
      `${API_BASE_URL}/service/app-total-go/files/${taskId}`,
      {
        method: "GET",
      }
    )

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || "Failed to download report")
    }

    // Create blob from response
    const blob = await response.blob()

    // Extract filename from Content-Disposition header
    let downloadFileName = `analysis-result-${taskId}`
    const contentDisposition = response.headers.get('content-disposition')
    if (contentDisposition) {
      const filenameMatch = contentDisposition.match(/filename=([^;]+)/)
      if (filenameMatch && filenameMatch[1]) {
        downloadFileName = filenameMatch[1].replace(/"/g, '').trim()
      }
    }

    // Create temporary download link
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = downloadFileName
    document.body.appendChild(a)
    a.click()
    window.URL.revokeObjectURL(url)
    document.body.removeChild(a)
  } catch (error) {
    console.error("Download report error:", error)
    throw error
  }
}

/**
 * 8. Get member details by email
 */
export async function getMemberByEmail(email: string) {
  try {
    const response = await fetch(`${API_BASE_URL}/members/${email}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || "Failed to get member details")
    }

    return await response.json()
  } catch (error) {
    console.error("Get member details error:", error)
    throw error
  }
}

/**
 * Get client IP address (both IPv4 and IPv6)
 */
export async function getClientIp(): Promise<{ ipv4?: string; ipv6?: string }> {
  const result: { ipv4?: string; ipv6?: string } = {}
  
  try {
    // Get IPv4
    try {
      const response = await fetch("https://api.ipify.org?format=json", {
        signal: AbortSignal.timeout(5000)
      })
      const data = await response.json()
      result.ipv4 = data.ip || ""
      console.log('IPv4 fetched:', result.ipv4)
    } catch (error) {
      console.warn("Failed to get IPv4:", error)
      result.ipv4 = ""
    }
    
    // Get IPv6
    try {
      const response = await fetch("https://api64.ipify.org?format=json", {
        signal: AbortSignal.timeout(5000)
      })
      const data = await response.json()
      result.ipv6 = data.ip || ""
      console.log('IPv6 fetched:', result.ipv6)
    } catch (error) {
      console.warn("Failed to get IPv6:", error)
      result.ipv6 = ""
    }
    
    return result
  } catch (error) {
    console.error("Error in getClientIp:", error)
    return { ipv4: "", ipv6: "" }
  }
}
