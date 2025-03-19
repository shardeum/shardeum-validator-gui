import { ChevronLeftIcon, ChevronRightIcon, EllipsisHorizontalIcon } from '@heroicons/react/24/outline'
import { useState } from 'react'

type PaginationProps = {
  totalItems: number
  pageSize?: number
  startingPage?: number
  range?: number // number of pages on each side of current page that are clickable
  onPageClick: ((page: number) => Promise<void>) | ((page: number) => void)
}

export const Pagination = ({ totalItems, pageSize = 5, startingPage = 1, range = 2, onPageClick }: PaginationProps) => {
  const [curPage, setCurPage] = useState(startingPage)
  if (totalItems == 0) {
    return <></>
  }

  const totalPages = Math.ceil(totalItems / pageSize)
  const startingWindow = [Math.max(1, curPage - range), Math.min(totalPages, curPage + range)]

  const leftExpansionEnabled = startingWindow[0] > 1
  const rightExpansionEnabled = startingWindow[1] < totalPages

  const displayedPages: number[] = []
  for (let i = startingWindow[0]; i <= startingWindow[1]; i++) {
    displayedPages.push(i)
  }

  return (
    <div className="flex gap-x-3 items-center text-subtleFg z-10">
      <ChevronLeftIcon
        className={'h-4 w-4 ' + (curPage > 1 ? ' cursor-pointer' : 'text-gray-300')}
        onClick={async () => {
          if (curPage > 1) {
            await onPageClick(Math.max(curPage - 1, 1))
            setCurPage((prevState) => Math.max(1, prevState - 1))
          }
        }}
      />
      {leftExpansionEnabled && (
        <button
          className="px-2 py-1 text-xs rounded hover:bg-gray-300 ease-in-out duration-100"
          onClick={async () => {
            await onPageClick(1)
            setCurPage(1)
          }}
        >
          1
        </button>
      )}
      {curPage - range > 2 && <EllipsisHorizontalIcon className="h-3 w-3 stroke-2" />}
      {displayedPages.map((page: number) => {
        const isCurPage = page === curPage
        return (
          <button
            className={
              'px-2 py-1 text-xs rounded ease-in-out duration-100 ' +
              (isCurPage ? 'bg-primary text-white' : 'hover:bg-gray-300')
            }
            onClick={async () => {
              await onPageClick(page)
              setCurPage(page)
            }}
            key={page}
          >
            {page}
          </button>
        )
      })}
      {curPage + range < totalPages - 1 && <EllipsisHorizontalIcon className="h-3 w-3" />}
      {rightExpansionEnabled && (
        <button
          className="px-2 py-1 text-xs rounded hover:bg-gray-300 ease-in-out duration-100"
          onClick={async () => {
            await onPageClick(totalPages)
            setCurPage(totalPages)
          }}
        >
          {totalPages}
        </button>
      )}
      <ChevronRightIcon
        className={'h-4 w-4 ' + (curPage < totalPages ? 'cursor-pointer' : 'text-gray-300')}
        onClick={async () => {
          if (curPage < totalPages) {
            await onPageClick(Math.min(curPage + 1, totalPages))
            setCurPage((prevState) => Math.min(totalPages, prevState + 1))
          }
        }}
      />
    </div>
  )
}
