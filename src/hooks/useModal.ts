import { useState } from "react"

export type ModalProps = {
  show: boolean
  open: () => void
  close: () => void
}

export default function useModal() {
  const [show, setShow] = useState(false)

  const open = () => setShow(true)
  const close = () => setShow(false)

  return { show, open, close }
}
