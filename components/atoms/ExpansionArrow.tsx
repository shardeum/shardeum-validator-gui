import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/outline'
import { useState } from 'react'

type ExpansionArrowProps = {
  className?: string
  isUp?: boolean
  onClick?: () => void
  toReverseDirection?: boolean
}

export const ExpansionArrow = ({ className, isUp = true, onClick, toReverseDirection = true }: ExpansionArrowProps) => {
  const [isUpward, setIsUpward] = useState(isUp)
  const handleClick = () => {
    if (toReverseDirection) {
      setIsUpward((prevState) => !prevState)
    }
    if (onClick) {
      onClick()
    }
  }

  return isUpward ? (
    <ChevronUpIcon onClick={handleClick} className={className || 'h-3 w-3 stroke-2 cursor-pointer'} />
  ) : (
    <ChevronDownIcon onClick={handleClick} className={className || 'h-3 w-3 stroke-2 cursor-pointer'} />
  )
}
