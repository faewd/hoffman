import { IoArrowBack, IoArrowDown, IoArrowForward, IoArrowUp } from "react-icons/io5";
import { Button } from "./Button";

type ContainerControlsProps = {
  moveCard: MoveCardFuncs
}

export type MoveCardFuncs = {
  left: () => void;
  right: () => void;
  up: () => void;
  down: () => void;
}

export default function ContainerControls({ moveCard }: ContainerControlsProps) {

  return (
    <div className="hidden group-hover:flex gap-1">
      <Button onClick={moveCard.left} className="px-2"><IoArrowBack /></Button>
      <Button onClick={moveCard.up} className="px-2"><IoArrowUp /></Button>
      <Button onClick={moveCard.down} className="px-2"><IoArrowDown /></Button>
      <Button onClick={moveCard.right} className="px-2"><IoArrowForward /></Button>
    </div>
  )
}
