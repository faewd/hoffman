import { IoArrowBack, IoArrowDown, IoArrowForward, IoArrowUp, IoSettingsSharp, IoTrashSharp } from "react-icons/io5";
import { Button } from "./Button";

type ContainerControlsProps = {
  moveCard: MoveCardFuncs
  editCard: () => void
  deleteCard: () => void
}

export type MoveCardFuncs = {
  left: () => void;
  right: () => void;
  up: () => void;
  down: () => void;
}

export default function ContainerControls({ moveCard, editCard, deleteCard }: ContainerControlsProps) {

  function handleDelete() {
    if (confirm("Are you sure you want to delete this container?\n\nAll contents will be permenantly lost.")) {
      deleteCard()
    }
  }

  return (
    <div className="hidden group-hover:flex gap-1 flex-grow">
      <Button onClick={editCard} className="px-2"><IoSettingsSharp /></Button>
      <Button onClick={handleDelete} className="px-2 mr-auto text-rose-300 hover:text-rose-300 hover:bg-rose-950"><IoTrashSharp /></Button>
      <Button onClick={moveCard.left} className="px-2"><IoArrowBack /></Button>
      <Button onClick={moveCard.up} className="px-2"><IoArrowUp /></Button>
      <Button onClick={moveCard.down} className="px-2"><IoArrowDown /></Button>
      <Button onClick={moveCard.right} className="px-2"><IoArrowForward /></Button>
    </div>
  )
}
