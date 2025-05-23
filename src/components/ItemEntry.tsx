import { useEffect, useState } from "react"
import { ItemContainer, ItemStack } from "../types"
import { calculateStackSlots, normalizeDecimal } from "../util"
import { Button } from "./Button"
import { GiClothes } from "react-icons/gi"
import cx from "../cx"
import { IoEllipsisVerticalOutline, IoExit, IoRemoveCircleOutline, IoSettingsSharp, IoTrashSharp } from "react-icons/io5"
import ItemConfigModal from "./ItemEntryConfigModal"
import useModal from "../hooks/useModal"
import { useInventory } from "../hooks/useInventories"
import MoveItemModal from "./MoveItemModal"

type ItemEntryProps = {
  stack: ItemStack,
  container: ItemContainer,
  flagged: boolean
  toggleFlagged: () => void,
  isDragging: boolean,
  isDragTarget: boolean,
  startDragging: () => void,
}

export default function ItemEntry({ stack, container, flagged, toggleFlagged, isDragging, isDragTarget, startDragging }: ItemEntryProps) {

  const [quantity, setQuantity] = useState(stack.quantity + "")
  const [name, setName] = useState(stack.item.name)
  const [value, setValue] = useState(stack.item.value + "")
  const [weight, setWeight] = useState(stack.item.weight + "")

  const configModal = useModal()
  const moveModal = useModal()

  const { saveInventory } = useInventory()

  useEffect(() => {
    setQuantity(stack.quantity + "")
    setName(stack.item.name)
    setValue(stack.item.value + "")
    setWeight(stack.item.weight + "")
  }, [stack, configModal.show])

  function commit() {
    const numQuantity = parseInt(quantity, 10)
    const numValue = parseFloat(value)
    const trimmedName = name.trim()

    stack.quantity = isNaN(numQuantity) ? 0 : numQuantity;
    stack.item.name = trimmedName.length === 0 ? stack.item.name : trimmedName;
    stack.item.value = isNaN(numValue) ? 0 : numValue

    saveInventory()
  }

  function toggleEquipped() {
    stack.equipped = !stack.equipped
    saveInventory()
  }

  return (
    <li className={cx("group/item flex gap-1 mb-1 relative rounded-sm", { "opacity-50": isDragTarget })}>
      <div onMouseDown={startDragging} className={cx("absolute bg-zinc-900 -left-2 h-full rounded-l items-center hidden cursor-move", { "group-hover/item:flex": !isDragging })}>
        <IoEllipsisVerticalOutline className="-mr-3" />
        <IoEllipsisVerticalOutline className="-mr-1" />
      </div>
      <input type="text" value={quantity} onChange={e => setQuantity(e.currentTarget.value)} onBlur={commit} className={cx("w-10 min-w-10 rounded bg-zinc-900 text-center px-1", { "opacity-50 bg-rose-950 line-through": flagged }, { "cursor-grabbing!": isDragging })} />
      <input type="text" value={name} onChange={e => setName(e.currentTarget.value)} onBlur={commit} className={cx("flex-grow min-w-32 rounded bg-zinc-900 px-1", { "opacity-50 bg-rose-950 line-through": flagged }, { "cursor-grabbing!": isDragging })} />
      <input type="text" value={value} onChange={e => setValue(e.currentTarget.value)} onBlur={commit} className={cx("w-10 min-w-10 rounded bg-zinc-900 text-center px-1", { "opacity-50 bg-rose-950 line-through": flagged }, { "cursor-grabbing!": isDragging })} />
      <input type="text" value={weight} onChange={e => setWeight(e.currentTarget.value)} onBlur={commit} className={cx("w-10 min-w-10 rounded bg-zinc-900 text-center px-1", { "opacity-50 bg-rose-950 line-through": flagged }, { "cursor-grabbing!": isDragging })} />
      <output className={cx("w-10 min-w-10 rounded bg-zinc-900 text-center px-1 cursor-default select-none", { "opacity-50 bg-rose-950 line-through": flagged }, { "text-teal-4java has00 saturate-30": stack.item.slotOverride !== null }, { "cursor-grabbing!": isDragging })}>
        {normalizeDecimal(calculateStackSlots(stack))}
      </output>
      <div className="flex absolute right-33 h-full items-center">
        { stack.equipped && <div className="w-3 h-3 bg-teal-800 rounded-full mr-2 border-3 border-zinc-900"></div> }
        <div className={cx("hidden gap-1 h-full", { "group-hover/item:flex": !isDragging })}>
          <Button onClick={toggleEquipped} className={cx("flex items-center justify-center bg-zinc-800 hover:bg-zinc-700 h-full w-6 p-0 rounded-sm", { "bg-teal-950 text-teal-100 hover:bg-teal-900": stack.equipped })}>
            <GiClothes />
          </Button>
          <Button onClick={configModal.open} className="flex items-center justify-center bg-zinc-800 hover:bg-zinc-700 h-full w-6 p-0 rounded-sm">
            <IoSettingsSharp />
          </Button>
          <Button onClick={moveModal.open} className="flex items-center justify-center bg-zinc-800 hover:bg-zinc-700 h-full w-6 p-0 rounded-sm">
            <IoExit />
          </Button>
          <Button onClick={toggleFlagged} className="flex items-center justify-center bg-rose-950 hover:bg-rose-900 text-rose-100 h-full w-6 p-0 rounded-sm">
            {flagged ? <IoRemoveCircleOutline /> : <IoTrashSharp />}
          </Button>
        </div>
      </div>
      <ItemConfigModal {...configModal} stack={stack} saveInventory={saveInventory} />
      <MoveItemModal {...moveModal} stack={stack} currentContainer={container} />
    </li>
  )
}
