import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "#components/ui/pagination"
import { cn } from "#lib/utils"

interface CatalogPaginationProps {
  page: number
  totalPages: number
  onPageChange: (page: number) => void
  className?: string
}

export function CatalogPagination({
  page,
  totalPages,
  onPageChange,
  className,
}: CatalogPaginationProps) {
  if (totalPages <= 1) return null

  return (
    <Pagination className={cn(className)}>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            href="#"
            aria-disabled={page <= 1}
            className={cn(page <= 1 && "pointer-events-none opacity-50")}
            onClick={(event) => {
              event.preventDefault()
              if (page > 1) onPageChange(page - 1)
            }}
          />
        </PaginationItem>
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
          <PaginationItem key={p}>
            <PaginationLink
              href="#"
              isActive={p === page}
              onClick={(event) => {
                event.preventDefault()
                onPageChange(p)
              }}
            >
              {p}
            </PaginationLink>
          </PaginationItem>
        ))}
        <PaginationItem>
          <PaginationNext
            href="#"
            aria-disabled={page >= totalPages}
            className={cn(
              page >= totalPages && "pointer-events-none opacity-50",
            )}
            onClick={(event) => {
              event.preventDefault()
              if (page < totalPages) onPageChange(page + 1)
            }}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  )
}
