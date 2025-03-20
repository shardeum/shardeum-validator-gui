import { RefObject } from 'react'

type TabButtonProps = {
  toRef: RefObject<HTMLElement>
  preClick?: () => void
  text?: string
}

export const TabButton = ({ toRef, preClick, text }: TabButtonProps) => {
  return (
    <button
      className="p-2 rounded hover:bg-gray-100 hover:font-semibold text-sm ease-in-out duration-200"
      onClick={() => {
        if (preClick) {
          preClick()
        }
        setTimeout(() => {
          if (toRef.current) {
            window.scrollTo({
              behavior: 'smooth',
              top: toRef.current.getBoundingClientRect().top - document.body.getBoundingClientRect().top - 120,
            })
          }
        }, 300)
      }}
    >
      {text}
    </button>
  )
}
