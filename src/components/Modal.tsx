import { ReactNode, useEffect, useRef } from "react";
import { ModalProps } from "../hooks/useModal";
import cx from "../cx";
import { IoClose } from "react-icons/io5";

export default function Modal({ show, close, children }: ModalProps & { children: ReactNode }) {

  const ref = useRef<HTMLDialogElement>(null)
  
  useEffect(() => {
    if (show) ref.current?.showModal()
    else ref.current?.close()
  }, [show])

  return (
    <dialog ref={ref} className="rounded-xl bg-zinc-900 text-zinc-300 m-auto backdrop:bg-zinc-950/70 p-4 relative" onClose={close}>
      <button onClick={close} className="absolute top-1 right-1 rounded-full text-zinc-600 cursor-pointer transition-colors hover:bg-zinc-800 hover:text-zinc-500"><IoClose size="24" /></button>
      {children}
    </dialog>
  )
}

Modal.Heading = function({ children, className }: { children: ReactNode, className?: string }) {
  return <h1 className={cx("font-bold text-3xl text-center mb-6 mt-2", className)}>{children}</h1>
}
