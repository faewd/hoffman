import { IoArrowBack, IoArrowDown, IoArrowForward, IoArrowUp, IoSettingsSharp, IoTrashSharp } from "react-icons/io5";
import { Button } from "./Button";
import { Container } from "../types";
import { useInventory } from "../hooks/useInventories";

type ContainerControlsProps = {
  container: Container
  onEdit: () => void
}

export default function ContainerControls({ container, onEdit }: ContainerControlsProps) {

  const { deleteContainer, moveContainer } = useInventory()

  function onDelete() {
    if (confirm("Are you sure you want to delete this container?\n\nAll contents will be permenantly lost.")) {
      deleteContainer(container)
    }
  }

  const move = moveContainer(container)

  return (
    <div className="hidden group-hover:flex gap-1 flex-grow">
      <Button onClick={onEdit} className="px-2"><IoSettingsSharp /></Button>
      <Button onClick={onDelete} className="px-2 mr-auto text-rose-300 hover:text-rose-300 hover:bg-rose-950"><IoTrashSharp /></Button>
      <Button onClick={move.left} className="px-2"><IoArrowBack /></Button>
      <Button onClick={move.up} className="px-2"><IoArrowUp /></Button>
      <Button onClick={move.down} className="px-2"><IoArrowDown /></Button>
      <Button onClick={move.right} className="px-2"><IoArrowForward /></Button>
    </div>
  )
}
