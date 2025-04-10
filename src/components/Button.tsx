import { ReactNode } from "react"
import cx from "../cx"

type ButtonProps = {
  onClick: React.MouseEventHandler<HTMLButtonElement>
  children: ReactNode
  className?: string
}

export function Button({ children, onClick, className }: ButtonProps) {
  return (
    <button onClick={onClick} className={cx("bg-zinc-950 rounded-lg py-2 px-6 font-bold cursor-pointer transition-colors hover:text-zinc-100 hover:bg-zinc-800", className)}>
      {children}
    </button>
  )
}
