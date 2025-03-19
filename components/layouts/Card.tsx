import { ReactElement } from 'react'

type CardProps = {
  children: ReactElement
}

export const Card = ({ children }: CardProps) => {
  return <div className="w-full h-full bg-white shadow border border-gray-200 rounded">{children}</div>
}
