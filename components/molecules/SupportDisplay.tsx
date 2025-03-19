import { SupportOptions } from './SupportOptions'

type SupportDisplayProps = {
  isVisible: boolean
  onClose: () => void
}

export const SupportDisplay = ({ isVisible, onClose }: SupportDisplayProps) => {
  return (
    <>
      {isVisible && (
        <div className="absolute bottom-full -ml-80 bg-white border rounded shadow-xl">
          <SupportOptions onClose={onClose} />
        </div>
      )}
    </>
  )
}
