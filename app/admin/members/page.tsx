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
    <div className="min-h-[calc(100vh-120px)]">
      {/* Page Header */}
      <div className="mb-12">
        <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent flex items-center gap-4">
          <Users className="w-12 h-12 text-purple-400" />
          Member Verifications
        </h1>
        <p className="text-xl text-slate-300">
          Manage and view all verified member information
        </p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-8 p-6 bg-red-900/20 border border-red-600/30 rounded-xl flex gap-4 items-start">
          <AlertCircle className="w-6 h-6 text-red-400 flex-shrink-0 mt-1" />
          <div>
            <p className="text-red-400 font-medium text-lg">{error}</p>
          </div>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="text-center py-24">
          <div className="bg-slate-800/40 backdrop-blur-sm border border-slate-700/50 rounded-xl p-12 shadow-lg inline-block">
            <Loader2 className="w-12 h-12 text-purple-400 animate-spin mx-auto mb-6" />
            <p className="text-slate-300 text-lg">Loading member verifications...</p>
          </div>
        </div>
      )}

      {/* Members Table */}
      {!loading && !error && (
        <div className="w-full">
          <div className="bg-slate-800/40 backdrop-blur-sm border border-slate-700/50 rounded-xl shadow-lg overflow-hidden">
            {/* Table Header */}
            <div className="bg-slate-800/60 border-b border-slate-700/50 p-6 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                <Users className="w-6 h-6 text-purple-400" />
                Members ({members.length})
              </h2>
              <button
                onClick={exportToExcel}
                disabled={exporting || members.length === 0}
                className="px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-lg disabled:bg-slate-600 disabled:cursor-not-allowed transition-all duration-200 hover:scale-105 font-medium flex items-center gap-3 shadow-lg"
              >
                {exporting && <Loader2 className="w-5 h-5 animate-spin" />}
                {exporting ? "Exporting..." : "Export Excel"}
                {!exporting && <Download className="w-5 h-5" />}
              </button>
            </div>

            {/* Table Content */}
            {members.length === 0 ? (
              <div className="p-24 text-center">
                <Users className="w-20 h-20 text-slate-600 mx-auto mb-6" />
                <p className="text-slate-400 text-xl">No member verifications found</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-slate-800/60 border-b border-slate-700/50">
                      <th className="text-left px-6 py-4 text-slate-300 font-bold">
                        <div className="flex items-center gap-3">
                          <Users className="w-5 h-5" />
                          Full Name
                        </div>
                      </th>
                      <th className="text-left px-6 py-4 text-slate-300 font-bold">
                        <div className="flex items-center gap-3">
                          <Mail className="w-5 h-5" />
                          Email
                        </div>
                      </th>
                      <th className="text-left px-6 py-4 text-slate-300 font-bold">
                        <div className="flex items-center gap-3">
                          <Phone className="w-5 h-5" />
                          Phone
                        </div>
                      </th>
                      <th className="text-left px-6 py-4 text-slate-300 font-bold">
                        <div className="flex items-center gap-3">
                          <Building className="w-5 h-5" />
                          Company
                        </div>
                      </th>
                      <th className="text-left px-6 py-4 text-slate-300 font-bold">
                        <div className="flex items-center gap-3">
                          <FileText className="w-5 h-5" />
                          Note
                        </div>
                      </th>
                      <th className="text-left px-6 py-4 text-slate-300 font-bold">
                        <div className="flex items-center gap-3">
                          <File className="w-5 h-5" />
                          File Name
                        </div>
                      </th>
                      <th className="text-left px-6 py-4 text-slate-300 font-bold">
                        <div className="flex items-center gap-3">
                          <File className="w-5 h-5" />
                          File Size (MB)
                        </div>
                      </th>
                      <th className="text-left px-6 py-4 text-slate-300 font-bold">
                        Created At
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {members.map((member, index) => (
                      <tr
                        key={member.id}
                        className={`border-b border-slate-700/30 hover:bg-slate-700/20 transition-all duration-200 ${
                          index % 2 === 0 ? 'bg-slate-800/20' : 'bg-transparent'
                        }`}
                      >
                        <td className="px-6 py-4 text-white font-medium">
                          {member.full_name || '-'}
                        </td>
                        <td className="px-6 py-4 text-slate-300">
                          {member.member_email || '-'}
                        </td>
                        <td className="px-6 py-4 text-slate-300">
                          {member.phone || '-'}
                        </td>
                        <td className="px-6 py-4 text-slate-300">
                          {member.company_name || '-'}
                        </td>
                        <td className="px-6 py-4 text-slate-300">
                          {member.note ? (
                            <div className="whitespace-pre-wrap max-w-xs" title={member.note}>
                              {member.note}
                            </div>
                          ) : (
                            '-'
                          )}
                        </td>
                        <td className="px-6 py-4 text-slate-300">
                          {member.file_name ? (
                            <div className="break-all max-w-xs" title={member.file_name}>
                              {member.file_name}
                            </div>
                          ) : (
                            '-'
                          )}
                        </td>
                        <td className="px-6 py-4 text-slate-300">
                          {member.file_size ? `${member.file_size} MB` : '-'}
                        </td>
                        <td className="px-6 py-4 text-slate-400 text-sm">
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
    </div>
  )
}
