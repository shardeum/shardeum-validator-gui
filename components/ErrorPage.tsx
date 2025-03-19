import { PropsWithChildren } from 'react'
import { useRouter } from 'next/router'

export default function ErrorPage({ children }: PropsWithChildren) {
  const router = useRouter()

  const handleGoHome = () => {
    router.replace('/dashboard')
  }

  return (
    <div className="px-16 flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <div className="flex flex-col items-center gap-y-6 bg-white shadow border border-gray-200 rounded px-8 py-12">
        <span className="text-4xl font-semibold text-red-600">Oops, something went wrong!</span>
        <span className="text-gray-600 text-center text-base">
          We're sorry, but an unexpected error has occurred. Please try again later or return to the dashboard.
        </span>
        <button onClick={handleGoHome} className="text-white bg-primary text-sm px-3 py-2 rounded">
          Return to Home
        </button>
      </div>
    </div>
  )
}
