import { useState } from "react"
import { useInventory } from "../hooks/useInventories"
import { ModalProps } from "../hooks/useModal"
import { ItemContainer, ItemStack } from "../types"
import Modal from "./Modal"
import { Button } from "./Button"

type MoveItemModalProps = ModalProps & {
  currentContainer: ItemContainer
  stack: ItemStack
}

export default function MoveItemModal({ stack, currentContainer, ...modal }: MoveItemModalProps) {

  const { inventory, saveInventory } = useInventory()
  const [split, setSplit] = useState(stack.quantity)

  if (inventory === null) return null;

  const otherContainers = inventory?.columns
    .flat()
    .filter(container => container.kind === "item-container" && container !== currentContainer) as ItemContainer[]

  function moveTo(otherContainer: ItemContainer) {
    stack.quantity -= split
    if (stack.quantity < 1) {
      const idx = currentContainer.items.indexOf(stack)
      currentContainer.items.splice(idx, 1)
    }
    otherContainer.items.push({ ...stack, quantity: split })
    saveInventory()
    modal.close()
  }

  return (
    <Modal {...modal}>
      <Modal.Heading>Move Item</Modal.Heading>
      {stack.quantity > 1 && (
        <div className="flex gap-2 items-center pb-4">
          <label htmlFor="moveModalSplitSlider">Split:</label>
          <input id="moveModalSplitSlider" type="range" min={1} max={stack.quantity} value={split} onChange={e => setSplit(+e.currentTarget.value)} className="flex-grow" />
        </div>
      )}
      <p className="text-lg pb-4">Move <span className="font-bold">{split}×</span> <span className="font-bold">{stack.item.name}</span> to...</p>
      <div className="flex gap-2 flex-col items-stretch">
        {otherContainers.map((container, i) => (
          <Button key={i} onClick={() => moveTo(container)}>{container.name}</Button>
        ))}
      </div>
    </Modal>
  )
}
