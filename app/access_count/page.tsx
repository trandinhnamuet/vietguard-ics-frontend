"use client"

import { useState, useEffect, useCallback } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
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
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-background via-background to-primary/5 transition-all duration-300">
      <Header />

      <main className="container mx-auto px-4 py-8 flex-1">
        <div className="max-w-6xl mx-auto">
          {/* Title */}
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Thống kê lượt truy cập
          </h1>
          <p className="text-lg text-muted-foreground mb-8">
            Theo dõi số lượt truy cập vào trang web
          </p>

          {/* Stats Cards */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="bg-card border border-border rounded-xl p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-primary/10 rounded-lg">
                  <Users className="w-8 h-8 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">IP duy nhất</p>
                  <p className="text-3xl font-bold">{(typeof stats.uniqueIPs === 'number' ? stats.uniqueIPs : 0).toLocaleString('vi-VN')}</p>
                </div>
              </div>
            </div>

            <div className="bg-card border border-border rounded-xl p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-secondary/10 rounded-lg">
                  <Eye className="w-8 h-8 text-secondary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Tổng lượt truy cập</p>
                  <p className="text-3xl font-bold">{(typeof stats.totalAccessCount === 'number' ? stats.totalAccessCount : 0).toLocaleString('vi-VN')}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Search Box */}
          <div className="flex gap-4 mb-6">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Tìm kiếm theo IP hoặc email..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onKeyDown={handleKeyPress}
                className="pl-10"
              />
            </div>
            <Button onClick={handleSearch}>
              Tìm kiếm
            </Button>
          </div>

          {/* Table */}
          <div className="bg-card border border-border rounded-xl overflow-hidden">
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <span className="ml-3 text-muted-foreground">Đang tải dữ liệu...</span>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead 
                      className="cursor-pointer select-none hover:bg-muted/50"
                      onClick={() => handleSort('id')}
                    >
                      <div className="flex items-center">
                        ID
                        {renderSortIcon('id')}
                      </div>
                    </TableHead>
                    <TableHead 
                      className="cursor-pointer select-none hover:bg-muted/50"
                      onClick={() => handleSort('ipv4')}
                    >
                      <div className="flex items-center">
                        IPv4
                        {renderSortIcon('ipv4')}
                      </div>
                    </TableHead>
                    <TableHead 
                      className="cursor-pointer select-none hover:bg-muted/50"
                      onClick={() => handleSort('ipv6')}
                    >
                      <div className="flex items-center">
                        IPv6
                        {renderSortIcon('ipv6')}
                      </div>
                    </TableHead>
                    <TableHead 
                      className="cursor-pointer select-none hover:bg-muted/50"
                      onClick={() => handleSort('email')}
                    >
                      <div className="flex items-center">
                        Email
                        {renderSortIcon('email')}
                      </div>
                    </TableHead>
                    <TableHead 
                      className="cursor-pointer select-none hover:bg-muted/50"
                      onClick={() => handleSort('access_count')}
                    >
                      <div className="flex items-center">
                        Số lượt
                        {renderSortIcon('access_count')}
                      </div>
                    </TableHead>
                    <TableHead 
                      className="cursor-pointer select-none hover:bg-muted/50"
                      onClick={() => handleSort('last_access_time')}
                    >
                      <div className="flex items-center">
                        Lần truy cập cuối
                        {renderSortIcon('last_access_time')}
                      </div>
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {accessLogs.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-10 text-muted-foreground">
                        Không có dữ liệu
                      </TableCell>
                    </TableRow>
                  ) : (
                    accessLogs.map((log) => (
                      <TableRow key={log.id}>
                        <TableCell className="font-medium">{log.id}</TableCell>
                        <TableCell className="font-mono text-sm">{log.ipv4 || '-'}</TableCell>
                        <TableCell className="font-mono text-sm max-w-[200px] truncate" title={log.ipv6 || undefined}>
                          {log.ipv6 || '-'}
                        </TableCell>
                        <TableCell>{log.email || '-'}</TableCell>
                        <TableCell>
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
                            {log.access_count}
                          </span>
                        </TableCell>
                        <TableCell className="text-muted-foreground">
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
            <div className="mt-6 flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                Hiển thị {((page - 1) * limit) + 1} - {Math.min(page * limit, total)} trong tổng số {total} bản ghi
              </p>
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious 
                      href="#" 
                      onClick={(e) => { e.preventDefault(); if (page > 1) setPage(page - 1) }}
                      className={page === 1 ? 'pointer-events-none opacity-50' : ''}
                    />
                  </PaginationItem>
                  {renderPaginationItems()}
                  <PaginationItem>
                    <PaginationNext 
                      href="#" 
                      onClick={(e) => { e.preventDefault(); if (page < totalPages) setPage(page + 1) }}
                      className={page === totalPages ? 'pointer-events-none opacity-50' : ''}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}
