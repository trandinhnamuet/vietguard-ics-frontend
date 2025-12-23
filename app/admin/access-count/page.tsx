"use client"

import { useState, useEffect, useCallback } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from "@/components/ui/pagination"
import { 
  getAccessLogs, 
  getAccessCount, 
  recordAccess, 
  type AccessLog, 
  type GetAccessLogsParams 
} from "@/lib/api/accessLogService"
import { getClientIp } from "@/lib/api/scanService"
import { Search, ArrowUpDown, ArrowUp, ArrowDown, Users, Eye, Loader2 } from "lucide-react"

type SortBy = 'id' | 'ipv4' | 'ipv6' | 'email' | 'access_count' | 'last_access_time'
type SortOrder = 'ASC' | 'DESC'

export default function AccessCountPage() {
  const [accessLogs, setAccessLogs] = useState<AccessLog[]>([])
  const [loading, setLoading] = useState(true)
  const [totalPages, setTotalPages] = useState(1)
  const [total, setTotal] = useState(0)
  const [stats, setStats] = useState({ uniqueIPs: 0, totalAccessCount: 0 })
  
  // Query params
  const [page, setPage] = useState(1)
  const [limit] = useState(10)
  const [sortBy, setSortBy] = useState<SortBy>('last_access_time')
  const [sortOrder, setSortOrder] = useState<SortOrder>('DESC')
  const [search, setSearch] = useState('')
  const [searchInput, setSearchInput] = useState('')

  // Record access on page load
  useEffect(() => {
    const recordPageAccess = async () => {
      try {
        const ipData = await getClientIp()
        console.log('Client IP data:', ipData)
        
        if (!ipData.ipv4) {
          console.warn('Failed to get IPv4 address')
        }
        if (!ipData.ipv6) {
          console.warn('Failed to get IPv6 address')
        }
        
        await recordAccess({ 
          ipv4: ipData.ipv4 || undefined,
          ipv6: ipData.ipv6 || undefined
        })
      } catch (error) {
        console.warn('Failed to record access:', error)
      }
    }
    recordPageAccess()
  }, [])

  // Fetch data
  const fetchData = useCallback(async () => {
    setLoading(true)
    try {
      const params: GetAccessLogsParams = {
        page,
        limit,
        sortBy,
        sortOrder,
      }
      if (search) params.search = search

      const [logsResponse, countResponse] = await Promise.all([
        getAccessLogs(params),
        getAccessCount(),
      ])

      setAccessLogs(logsResponse.data)
      setTotalPages(logsResponse.totalPages)
      setTotal(logsResponse.total)
      setStats({
        uniqueIPs: countResponse.uniqueIPs,
        totalAccessCount: countResponse.totalAccessCount,
      })
    } catch (error) {
      console.error('Failed to fetch access logs:', error)
    } finally {
      setLoading(false)
    }
  }, [page, limit, sortBy, sortOrder, search])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  // Handle column header click for sorting
  const handleSort = (column: SortBy) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'ASC' ? 'DESC' : 'ASC')
    } else {
      setSortBy(column)
      setSortOrder('DESC')
    }
    setPage(1) // Reset to first page when sorting
  }

  // Handle search
  const handleSearch = () => {
    setSearch(searchInput)
    setPage(1) // Reset to first page when searching
  }

  // Handle search on Enter key
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch()
    }
  }

  // Render sort icon
  const renderSortIcon = (column: SortBy) => {
    if (sortBy !== column) {
      return <ArrowUpDown className="h-4 w-4 ml-1 opacity-50" />
    }
    return sortOrder === 'ASC' 
      ? <ArrowUp className="h-4 w-4 ml-1" /> 
      : <ArrowDown className="h-4 w-4 ml-1" />
  }

  // Format date to Vietnam timezone
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('vi-VN', {
      timeZone: 'Asia/Ho_Chi_Minh',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    })
  }

  // Generate pagination items
  const renderPaginationItems = () => {
    const items: React.ReactNode[] = []
    const maxVisiblePages = 5
    let startPage = Math.max(1, page - Math.floor(maxVisiblePages / 2))
    const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1)

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1)
    }

    if (startPage > 1) {
      items.push(
        <PaginationItem key="1">
          <PaginationLink href="#" onClick={(e) => { e.preventDefault(); setPage(1) }}>
            1
          </PaginationLink>
        </PaginationItem>
      )
      if (startPage > 2) {
        items.push(<PaginationEllipsis key="ellipsis-start" />)
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      items.push(
        <PaginationItem key={i}>
          <PaginationLink 
            href="#" 
            isActive={page === i}
            onClick={(e) => { e.preventDefault(); setPage(i) }}
          >
            {i}
          </PaginationLink>
        </PaginationItem>
      )
    }

    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        items.push(<PaginationEllipsis key="ellipsis-end" />)
      }
      items.push(
        <PaginationItem key={totalPages}>
          <PaginationLink href="#" onClick={(e) => { e.preventDefault(); setPage(totalPages) }}>
            {totalPages}
          </PaginationLink>
        </PaginationItem>
      )
    }

    return items
  }

  return (
    <div className="min-h-[calc(100vh-120px)]">
      {/* Title */}
      <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
        Access Count Statistics
      </h1>
      <p className="text-xl text-slate-300 mb-12">
        Monitor website access logs and visitor statistics
      </p>

      {/* Stats Cards */}
      <div className="grid md:grid-cols-2 gap-8 mb-12">
        <div className="bg-slate-800/40 backdrop-blur-sm border border-slate-700/50 rounded-xl p-8 hover:bg-slate-800/60 transition-all duration-200 hover:scale-105">
          <div className="flex items-center gap-6">
            <div className="p-4 bg-blue-600/20 rounded-xl">
              <Users className="w-10 h-10 text-blue-400" />
            </div>
            <div>
              <p className="text-slate-400 text-sm mb-2">Unique IPs</p>
              <p className="text-4xl font-bold text-white">{(typeof stats.uniqueIPs === 'number' ? stats.uniqueIPs : 0).toLocaleString('en-US')}</p>
            </div>
          </div>
        </div>

        <div className="bg-slate-800/40 backdrop-blur-sm border border-slate-700/50 rounded-xl p-8 hover:bg-slate-800/60 transition-all duration-200 hover:scale-105">
          <div className="flex items-center gap-6">
            <div className="p-4 bg-purple-600/20 rounded-xl">
              <Eye className="w-10 h-10 text-purple-400" />
            </div>
            <div>
              <p className="text-slate-400 text-sm mb-2">Total Accesses</p>
              <p className="text-4xl font-bold text-white">{(typeof stats.totalAccessCount === 'number' ? stats.totalAccessCount : 0).toLocaleString('en-US')}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Search Box */}
      <div className="flex gap-6 mb-8">
        <div className="relative flex-1 max-w-lg">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
          <Input
            placeholder="Search by IP or email..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyDown={handleKeyPress}
            className="pl-12 py-3 bg-slate-800/40 border-slate-700/50 text-white placeholder-slate-400 focus:bg-slate-800/60 transition-all duration-200"
          />
        </div>
        <Button 
          onClick={handleSearch}
          className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium transition-all duration-200 hover:scale-105"
        >
          Search
        </Button>
      </div>

      {/* Table */}
      <div className="bg-slate-800/40 backdrop-blur-sm border border-slate-700/50 rounded-xl overflow-hidden hover:bg-slate-800/50 transition-all duration-200">
        {loading ? (
          <div className="flex items-center justify-center py-24">
            <Loader2 className="h-10 w-10 animate-spin text-blue-400" />
            <span className="ml-4 text-slate-300 text-lg">Loading data...</span>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="border-slate-700/50 hover:bg-slate-700/30">
                <TableHead 
                  className="cursor-pointer select-none hover:bg-slate-700/40 transition-all duration-200 text-slate-300 font-semibold"
                  onClick={() => handleSort('id')}
                >
                  <div className="flex items-center hover:scale-105 transition-transform duration-200">
                    ID
                    {renderSortIcon('id')}
                  </div>
                </TableHead>
                <TableHead 
                  className="cursor-pointer select-none hover:bg-slate-700/40 transition-all duration-200 text-slate-300 font-semibold"
                  onClick={() => handleSort('ipv4')}
                >
                  <div className="flex items-center hover:scale-105 transition-transform duration-200">
                    IPv4
                    {renderSortIcon('ipv4')}
                  </div>
                </TableHead>
                <TableHead 
                  className="cursor-pointer select-none hover:bg-slate-700/40 transition-all duration-200 text-slate-300 font-semibold"
                  onClick={() => handleSort('ipv6')}
                >
                  <div className="flex items-center hover:scale-105 transition-transform duration-200">
                    IPv6
                    {renderSortIcon('ipv6')}
                  </div>
                </TableHead>
                <TableHead 
                  className="cursor-pointer select-none hover:bg-slate-700/40 transition-all duration-200 text-slate-300 font-semibold"
                  onClick={() => handleSort('email')}
                >
                  <div className="flex items-center hover:scale-105 transition-transform duration-200">
                    Email
                    {renderSortIcon('email')}
                  </div>
                </TableHead>
                <TableHead 
                  className="cursor-pointer select-none hover:bg-slate-700/40 transition-all duration-200 text-slate-300 font-semibold"
                  onClick={() => handleSort('access_count')}
                >
                  <div className="flex items-center hover:scale-105 transition-transform duration-200">
                    Count
                    {renderSortIcon('access_count')}
                  </div>
                </TableHead>
                <TableHead 
                  className="cursor-pointer select-none hover:bg-slate-700/40 transition-all duration-200 text-slate-300 font-semibold"
                  onClick={() => handleSort('last_access_time')}
                >
                  <div className="flex items-center hover:scale-105 transition-transform duration-200">
                    Last Access
                    {renderSortIcon('last_access_time')}
                  </div>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {accessLogs.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-16 text-slate-400">
                    No data
                  </TableCell>
                </TableRow>
              ) : (
                accessLogs.map((log, index) => (
                  <TableRow key={log.id} className={`border-slate-700/30 hover:bg-slate-700/20 transition-all duration-200 ${
                    index % 2 === 0 ? 'bg-slate-800/20' : 'bg-transparent'
                  }`}>
                    <TableCell className="font-medium text-white">{log.id}</TableCell>
                    <TableCell className="font-mono text-sm text-slate-300">{log.ipv4 || '-'}</TableCell>
                    <TableCell className="font-mono text-sm max-w-[200px] truncate text-slate-300" title={log.ipv6 || undefined}>
                      {log.ipv6 || '-'}
                    </TableCell>
                    <TableCell className="text-slate-300">{log.email || '-'}</TableCell>
                    <TableCell>
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-600/20 text-blue-400 border border-blue-600/30">
                        {log.access_count}
                      </span>
                    </TableCell>
                    <TableCell className="text-slate-400">
                      {formatDate(log.last_access_time)}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        )}
      </div>

      {/* Pagination */}
      {!loading && totalPages > 1 && (
        <div className="mt-8 flex items-center justify-between bg-slate-800/40 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
          <p className="text-slate-300">
            Showing {((page - 1) * limit) + 1} - {Math.min(page * limit, total)} of {total} records
          </p>
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious 
                  href="#" 
                  onClick={(e) => { e.preventDefault(); if (page > 1) setPage(page - 1) }}
                  className={`transition-all duration-200 hover:scale-105 ${page === 1 ? 'pointer-events-none opacity-50' : 'hover:bg-slate-700/50'}`}
                />
              </PaginationItem>
              {renderPaginationItems()}
              <PaginationItem>
                <PaginationNext 
                  href="#" 
                  onClick={(e) => { e.preventDefault(); if (page < totalPages) setPage(page + 1) }}
                  className={`transition-all duration-200 hover:scale-105 ${page === totalPages ? 'pointer-events-none opacity-50' : 'hover:bg-slate-700/50'}`}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  )
}
