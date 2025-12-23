/**
 * Access Log Service - API wrapper for VietGuardScan Access Logs
 * Handles all API calls for access log management
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api"

// ============= TYPE DEFINITIONS =============
export interface AccessLog {
  id: number
  ipv4: string | null
  ipv6: string | null
  email: string | null
  access_count: number
  last_access_time: string
}

export interface RecordAccessRequest {
  ipv4?: string
  ipv6?: string
}

export interface RecordAccessResponse {
  message: string
  accessLog: AccessLog
}

export interface GetAccessLogsResponse {
  data: AccessLog[]
  total: number
  page: number
  limit: number
  totalPages: number
}

export interface GetAccessLogsParams {
  page?: number
  limit?: number
  sortBy?: 'id' | 'ipv4' | 'ipv6' | 'email' | 'access_count' | 'last_access_time'
  sortOrder?: 'ASC' | 'DESC'
  search?: string
}

export interface GetAccessCountResponse {
  total: number
  uniqueIPs: number
  totalAccessCount: number
}

// ============= API FUNCTIONS =============

/**
 * Record access log (call when user visits the page)
 */
export async function recordAccess(request: RecordAccessRequest): Promise<RecordAccessResponse> {
  const response = await fetch(`${API_BASE_URL}/access-logs/record`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(request),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || 'Failed to record access')
  }

  return response.json()
}

/**
 * Get access logs with pagination, sorting, and search
 */
export async function getAccessLogs(params: GetAccessLogsParams = {}): Promise<GetAccessLogsResponse> {
  const searchParams = new URLSearchParams()
  
  if (params.page) searchParams.append('page', params.page.toString())
  if (params.limit) searchParams.append('limit', params.limit.toString())
  if (params.sortBy) searchParams.append('sortBy', params.sortBy)
  if (params.sortOrder) searchParams.append('sortOrder', params.sortOrder)
  if (params.search) searchParams.append('search', params.search)

  const url = `${API_BASE_URL}/access-logs?${searchParams.toString()}`
  
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || 'Failed to get access logs')
  }

  return response.json()
}

/**
 * Get total access count statistics
 */
export async function getAccessCount(): Promise<GetAccessCountResponse> {
  const response = await fetch(`${API_BASE_URL}/access-logs/count`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || 'Failed to get access count')
  }

  return response.json()
}
