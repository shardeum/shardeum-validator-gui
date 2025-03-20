import { createContext, ReactNode, useState } from 'react'

export type ConfirmModalConfig = { modalBody: ReactNode; header: string; onConfirm?: () => void; onCancel?: () => void }

export const ConfirmModalContext = createContext<{
  openModal: (config: ConfirmModalConfig) => void
}>({
  openModal: () => {},
})

export default function ConfirmModalContextProvider({ children }: { children: ReactNode }) {
  const [config, setConfig] = useState<ConfirmModalConfig>()
  const [open, setOpen] = useState<boolean>(false)

  function openModal(_config: ConfirmModalConfig) {
    setConfig(_config)
    toggleOpen()
  }

  function toggleOpen() {
    setOpen(!open)
  }

  return (
    <>
      <ConfirmModalContext.Provider value={{ openModal: openModal }}>{children}</ConfirmModalContext.Provider>

      <input type="checkbox" id="confirm-modal" className="modal-toggle" checked={open} readOnly />
      <div className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">{config?.header}</h3>
          <p className="py-4">{config?.modalBody}</p>
          <div className="modal-action">
            <label
              className="btn btn-outline"
              onClick={() => {
                toggleOpen()
                config?.onCancel?.()
              }}
            >
              Cancel
            </label>
            <label
              className="btn btn-primary"
              onClick={() => {
                toggleOpen()
                config?.onConfirm?.()
              }}
            >
              Confirm
            </label>
          </div>
        </div>
      </div>
    </>
  )
}
