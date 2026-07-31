import { useMemo, useState, type ReactNode } from "react"
import {
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  PackageSearch,
  Search,
} from "lucide-react"

import { EmptyState } from "#components/catalog/EmptyState"
import { Input } from "#components/ui/input"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "#components/ui/pagination"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "#components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "#components/ui/table"
import { cn } from "#lib/utils"

export interface DataTableColumn<T> {
  key: string
  header: string
  cell: (row: T) => ReactNode
  sortValue?: (row: T) => string | number
  className?: string
}

export interface DataTableFilter<T> {
  key: string
  label: string
  options: { value: string; label: string }[]
  match: (row: T, value: string) => boolean
}

interface DataTableProps<T> {
  data: T[]
  columns: DataTableColumn<T>[]
  searchPlaceholder?: string
  searchText?: (row: T) => string
  filters?: DataTableFilter<T>[]
  pageSize?: number
  toolbarAction?: ReactNode
  rowActions?: (row: T) => ReactNode
  emptyTitle?: string
  emptyDescription?: string
}

type SortDirection = "asc" | "desc"

const ALL = "__all__"

export function DataTable<T>({
  data,
  columns,
  searchPlaceholder = "Search…",
  searchText,
  filters = [],
  pageSize = 8,
  toolbarAction,
  rowActions,
  emptyTitle = "Nothing found",
  emptyDescription = "Try adjusting your search or filters.",
}: DataTableProps<T>) {
  const [search, setSearch] = useState("")
  const [filterValues, setFilterValues] = useState<Record<string, string>>({})
  const [sortKey, setSortKey] = useState<string | null>(null)
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc")
  const [page, setPage] = useState(1)

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase()
    return data.filter((row) => {
      if (
        query &&
        searchText &&
        !searchText(row).toLowerCase().includes(query)
      ) {
        return false
      }
      return filters.every((filter) => {
        const value = filterValues[filter.key]
        return !value || value === ALL || filter.match(row, value)
      })
    })
  }, [data, search, searchText, filters, filterValues])

  const sorted = useMemo(() => {
    if (!sortKey) return filtered
    const column = columns.find((col) => col.key === sortKey)
    if (!column?.sortValue) return filtered
    const direction = sortDirection === "asc" ? 1 : -1
    return [...filtered].sort((a, b) => {
      const aValue = column.sortValue!(a)
      const bValue = column.sortValue!(b)
      if (aValue < bValue) return -1 * direction
      if (aValue > bValue) return 1 * direction
      return 0
    })
  }, [filtered, columns, sortKey, sortDirection])

  const pageCount = Math.max(1, Math.ceil(sorted.length / pageSize))
  const currentPage = Math.min(page, pageCount)
  const pageRows = sorted.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  )

  const toggleSort = (key: string) => {
    if (sortKey === key) {
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"))
    } else {
      setSortKey(key)
      setSortDirection("asc")
    }
  }

  const hasToolbar = searchText !== undefined || filters.length > 0

  return (
    <div className="flex flex-col gap-4">
      {hasToolbar && (
        <div className="flex flex-wrap items-center gap-3">
          {searchText && (
            <div className="relative w-full max-w-xs">
              <Search className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="search"
                value={search}
                onChange={(event) => {
                  setSearch(event.target.value)
                  setPage(1)
                }}
                placeholder={searchPlaceholder}
                aria-label={searchPlaceholder}
                className="pl-8"
              />
            </div>
          )}
          {filters.map((filter) => (
            <Select
              key={filter.key}
              value={filterValues[filter.key] ?? ALL}
              onValueChange={(value) => {
                setFilterValues((prev) => ({
                  ...prev,
                  [filter.key]: value ?? ALL,
                }))
                setPage(1)
              }}
            >
              <SelectTrigger
                className="w-44"
                aria-label={`Filter by ${filter.label}`}
              >
                <SelectValue placeholder={filter.label} />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value={ALL}>All {filter.label}</SelectItem>
                  {filter.options.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          ))}
          {toolbarAction && <div className="ml-auto">{toolbarAction}</div>}
        </div>
      )}

      {pageRows.length === 0 ? (
        <EmptyState
          icon={PackageSearch}
          title={emptyTitle}
          description={emptyDescription}
        />
      ) : (
        <div className="rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                {columns.map((column) => (
                  <TableHead key={column.key} className={column.className}>
                    {column.sortValue ? (
                      <button
                        type="button"
                        onClick={() => toggleSort(column.key)}
                        className="flex items-center gap-1.5 font-medium hover:text-foreground/80"
                      >
                        {column.header}
                        {sortKey === column.key ? (
                          sortDirection === "asc" ? (
                            <ArrowUp className="size-3.5" />
                          ) : (
                            <ArrowDown className="size-3.5" />
                          )
                        ) : (
                          <ArrowUpDown className="size-3.5 text-muted-foreground" />
                        )}
                      </button>
                    ) : (
                      column.header
                    )}
                  </TableHead>
                ))}
                {rowActions && (
                  <TableHead className="w-24 text-right">Actions</TableHead>
                )}
              </TableRow>
            </TableHeader>
            <TableBody>
              {pageRows.map((row, rowIndex) => (
                <TableRow key={rowIndex}>
                  {columns.map((column) => (
                    <TableCell
                      key={column.key}
                      className={cn("whitespace-normal", column.className)}
                    >
                      {column.cell(row)}
                    </TableCell>
                  ))}
                  {rowActions && (
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        {rowActions(row)}
                      </div>
                    </TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {pageCount > 1 && (
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                aria-disabled={currentPage === 1}
                className={cn(
                  currentPage === 1 && "pointer-events-none opacity-50"
                )}
                onClick={(event) => {
                  event.preventDefault()
                  setPage((prev) => Math.max(1, prev - 1))
                }}
              />
            </PaginationItem>
            {Array.from({ length: pageCount }, (_, index) => index + 1).map(
              (pageNumber) => (
                <PaginationItem key={pageNumber}>
                  <PaginationLink
                    isActive={pageNumber === currentPage}
                    onClick={(event) => {
                      event.preventDefault()
                      setPage(pageNumber)
                    }}
                  >
                    {pageNumber}
                  </PaginationLink>
                </PaginationItem>
              )
            )}
            <PaginationItem>
              <PaginationNext
                aria-disabled={currentPage === pageCount}
                className={cn(
                  currentPage === pageCount && "pointer-events-none opacity-50"
                )}
                onClick={(event) => {
                  event.preventDefault()
                  setPage((prev) => Math.min(pageCount, prev + 1))
                }}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  )
}
