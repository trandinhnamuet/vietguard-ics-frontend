"use client"

import { useState, useEffect } from "react"
import { AlertCircle, Loader2, Users, Mail, Phone, Building, FileText, Download, File } from "lucide-react"

interface MemberVerification {
  id: number
  full_name: string
  phone: string
  company_name: string
  note: string
  member_email: string
  file_name: string
  file_size: number
  created_at: string
}

export default function MembersPage() {
  const [members, setMembers] = useState<MemberVerification[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [exporting, setExporting] = useState(false)

  useEffect(() => {
    fetchMembers()
  }, [])

  const fetchMembers = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/members/verifications')
      
      if (!response.ok) {
        throw new Error('Failed to fetch member verifications')
      }
      
      const data = await response.json()
      setMembers(data)
    } catch (err: any) {
      setError(err.message || 'Failed to load member verifications')
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const exportToExcel = async () => {
    try {
      setExporting(true)
      setError(null)

      // Helper function to escape CSV values
      const escapeCSV = (value: string | null | undefined): string => {
        if (!value) return ''
        // Convert to string and replace quotes with double quotes
        const str = String(value).replace(/"/g, '""')
        // If contains comma, quote, or newline, wrap in quotes
        if (str.includes(',') || str.includes('"') || str.includes('\n') || str.includes('\r')) {
          return `"${str}"`
        }
        return str
      }

      // Convert data to CSV format
      const headers = ['Full Name', 'Email', 'Phone', 'Company', 'Note', 'File Name', 'File Size (MB)', 'Created At']
      const csvData = [
        headers.join(','),
        ...members.map(member => [
          escapeCSV(member.full_name),
          escapeCSV(member.member_email),
          escapeCSV(member.phone),
          escapeCSV(member.company_name),
          escapeCSV(member.note),
          escapeCSV(member.file_name),
          escapeCSV(member.file_size?.toString()),
          escapeCSV(formatDate(member.created_at))
        ].join(','))
      ].join('\n')

      // Add BOM for proper UTF-8 encoding in Excel
      const BOM = '\uFEFF'
      const csvContent = BOM + csvData

      // Create and download file
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
      const link = document.createElement('a')
      const url = URL.createObjectURL(blob)
      link.setAttribute('href', url)
      link.setAttribute('download', `member-verifications-${new Date().toISOString().split('T')[0]}.csv`)
      link.style.visibility = 'hidden'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
    } catch (err: any) {
      setError(err.message || 'Failed to export data')
    } finally {
      setExporting(false)
    }
  }

  return (
    <>
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent flex items-center gap-3">
          <Users className="w-10 h-10 text-primary" />
          Member Verifications
        </h1>
        <p className="text-lg text-muted-foreground">
          Manage and view all verified member information
        </p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6 p-4 bg-destructive/10 border border-destructive rounded-lg flex gap-3 items-start">
          <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-destructive font-medium">{error}</p>
          </div>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="text-center py-12">
          <div className="bg-card border border-border rounded-xl p-8 shadow-lg inline-block">
            <Loader2 className="w-8 h-8 text-primary animate-spin mx-auto mb-4" />
            <p className="text-muted-foreground">Loading member verifications...</p>
          </div>
        </div>
      )}

      {/* Members Table */}
      {!loading && !error && (
        <div className="w-full">
          <div className="bg-card border border-border rounded-xl shadow-lg overflow-hidden">
            {/* Table Header */}
            <div className="bg-muted border-b border-border p-4 flex justify-between items-center">
              <h2 className="text-xl font-semibold text-foreground flex items-center gap-2">
                <Users className="w-5 h-5" />
                Members ({members.length})
              </h2>
              <button
                onClick={exportToExcel}
                disabled={exporting || members.length === 0}
                className="px-4 py-2 bg-white text-black rounded-lg hover:bg-gray-100 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-medium flex items-center gap-2"
              >
                {exporting && <Loader2 className="w-4 h-4 animate-spin" />}
                {exporting ? "Exporting..." : "Export Excel"}
                {!exporting && <Download className="w-4 h-4" />}
              </button>
            </div>

            {/* Table Content */}
            {members.length === 0 ? (
              <div className="p-12 text-center">
                <Users className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
                <p className="text-muted-foreground text-lg">No member verifications found</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-muted border-b border-border">
                      <th className="text-left px-4 py-3 text-foreground font-semibold">
                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4" />
                          Full Name
                        </div>
                      </th>
                      <th className="text-left px-4 py-3 text-foreground font-semibold">
                        <div className="flex items-center gap-2">
                          <Mail className="w-4 h-4" />
                          Email
                        </div>
                      </th>
                      <th className="text-left px-4 py-3 text-foreground font-semibold">
                        <div className="flex items-center gap-2">
                          <Phone className="w-4 h-4" />
                          Phone
                        </div>
                      </th>
                      <th className="text-left px-4 py-3 text-foreground font-semibold">
                        <div className="flex items-center gap-2">
                          <Building className="w-4 h-4" />
                          Company
                        </div>
                      </th>
                      <th className="text-left px-4 py-3 text-foreground font-semibold">
                        <div className="flex items-center gap-2">
                          <FileText className="w-4 h-4" />
                          Note
                        </div>
                      </th>
                      <th className="text-left px-4 py-3 text-foreground font-semibold">
                        <div className="flex items-center gap-2">
                          <File className="w-4 h-4" />
                          File Name
                        </div>
                      </th>
                      <th className="text-left px-4 py-3 text-foreground font-semibold">
                        <div className="flex items-center gap-2">
                          <File className="w-4 h-4" />
                          File Size (MB)
                        </div>
                      </th>
                      <th className="text-left px-4 py-3 text-foreground font-semibold">
                        Created At
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {members.map((member, index) => (
                      <tr
                        key={member.id}
                        className={`border-b border-border hover:bg-muted/50 transition-colors ${
                          index % 2 === 0 ? 'bg-muted/20' : 'bg-transparent'
                        }`}
                      >
                        <td className="px-4 py-3 text-foreground">
                          {member.full_name || '-'}
                        </td>
                        <td className="px-4 py-3 text-muted-foreground">
                          {member.member_email || '-'}
                        </td>
                        <td className="px-4 py-3 text-muted-foreground">
                          {member.phone || '-'}
                        </td>
                        <td className="px-4 py-3 text-muted-foreground">
                          {member.company_name || '-'}
                        </td>
                        <td className="px-4 py-3 text-muted-foreground">
                          {member.note ? (
                            <div className="whitespace-pre-wrap max-w-xs" title={member.note}>
                              {member.note}
                            </div>
                          ) : (
                            '-'
                          )}
                        </td>
                        <td className="px-4 py-3 text-muted-foreground">
                          {member.file_name ? (
                            <div className="break-all max-w-xs" title={member.file_name}>
                              {member.file_name}
                            </div>
                          ) : (
                            '-'
                          )}
                        </td>
                        <td className="px-4 py-3 text-muted-foreground">
                          {member.file_size ? `${member.file_size} MB` : '-'}
                        </td>
                        <td className="px-4 py-3 text-muted-foreground text-sm">
                          {formatDate(member.created_at)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )
}
