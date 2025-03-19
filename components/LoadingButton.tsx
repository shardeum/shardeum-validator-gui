import React from 'react'

interface LoadingButtonProps {
  isLoading: boolean
}

export default function LoadingButton({
  isLoading,
  children,
  ...props
}: React.DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement> & LoadingButtonProps) {
  return (
    <>
      {isLoading && (
        <button className="btn loading disabled:text-stone-500 capitalize" disabled>
          Loading
        </button>
      )}
      {!isLoading && <button {...props}>{children}</button>}
    </>
  )
}
