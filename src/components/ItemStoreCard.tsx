import { GiCoins, GiKnapsack, GiWeightCrush } from "react-icons/gi"
import { ItemContainer, ItemStack } from "../types"
import { calculateContainerSlots, calculateContainerValue, calculateContainerWeight, normalizeDecimal } from "../util"
import { FormEvent, useState } from "react"
import { AiOutlineFieldNumber } from "react-icons/ai"
import ContainerControls from "./ContainerControls"
import StoreConfigModal from "./StoreConfigModal"
import useModal from "../hooks/useModal"
import ItemEntry from "./ItemEntry"
import { useInventory } from "../hooks/useInventories"

type ItemStoreCardProps = {
  store: ItemContainer,
}

export default function ItemStoreCard({ store }: ItemStoreCardProps) {

  const [quantity, setQuantity] = useState("")
  const [name, setName] = useState("")
  const [weight, setWeight] = useState("")
  const [value, setValue] = useState("")
  const [slotsOR, setSlotsOR] = useState("")

  const [itemsToDelete, setItemsToDelete] = useState<number[]>([])

  const { saveInventory } = useInventory()

  const configModal = useModal()

  function addItem(e: FormEvent) {
    e.preventDefault()
    if (name.trim().length === 0) return;

    const numQuantity = parseInt(quantity, 10)
    const numValue = parseFloat(value)
    const numWeight = parseFloat(weight)
    const numSlotsOR = parseFloat(slotsOR)

    const stack: ItemStack = {
      quantity: isNaN(numQuantity) ? 1 : numQuantity,
      equipped: false,
      item: {
        name: name.trim(),
        value: isNaN(numValue) ? 0 : numValue,
        weight: isNaN(numWeight) ? 0 : numWeight,
        slotOverride: isNaN(numSlotsOR) ? null : numSlotsOR,
        equippedSlots: 0
      }
    }

    setQuantity("")
    setName("")
    setWeight("")
    setValue("")
    setSlotsOR("")
    store.items.push(stack)
    saveInventory()
  }

  function toggleFlagged(idx: number) {
    if (itemsToDelete.includes(idx)) setItemsToDelete(itemsToDelete.filter(i => i !== idx))
    else setItemsToDelete([...itemsToDelete, idx])
  }

  function clearSelectedItems() {
    setItemsToDelete([])
  }

  function deleteSelectedItems() {
    store.items = store.items.filter((_, i) => !itemsToDelete.includes(i))
    clearSelectedItems()
    saveInventory()
  }

  const totalSlots = calculateContainerSlots(store)

  return (
    <>
      <div className="flex pb-2 gap-2 items-center">
        <h4 className="text-lg font-semibold mr-auto">{store.name}</h4>
        <ContainerControls container={store} onEdit={configModal.open} />
        <GiKnapsack size="28" className="text-zinc-500 my-[2px]" />
      </div>
      {store.items.length === 0 && <p className="italic text-zinc-500 mb-3 text-center">This container is empty.</p>}
      <div className="flex gap-1 mb-1 items-center">
        <div className="w-10 min-w-10 flex justify-center px-1 text-zinc-400 text-lg"><AiOutlineFieldNumber /></div>
        <div className="flex-grow min-w-32 px-1 text-zinc-400 font-bold text-sm">Name</div>
        <div className="w-10 min-w-10 flex justify-center px-1 text-zinc-400 text-lg"><GiCoins /></div>
        <div className="w-10 min-w-10 flex justify-center px-1 text-zinc-400 text-lg"><GiWeightCrush /><span className="text-sm text-zinc-600">(lb)</span></div>
        <div className="w-10 min-w-10 flex justify-center px-1 text-zinc-400 text-sm">Slots</div>
      </div>
      <ul className="flex flex-col">
        {store.items.map((stack, i) => <ItemEntry key={i} stack={stack} flagged={itemsToDelete.includes(i)} toggleFlagged={() => toggleFlagged(i)} />)}
        <li>
          <hr className="my-2 border-zinc-600 border-0 border-b-2" />
          <form onSubmit={addItem}>
            <div className="flex gap-1">
              <input type="text" value={quantity} onChange={e => setQuantity(e.currentTarget.value)} className="w-10 min-w-10 rounded bg-zinc-900 text-center px-1" />
              <input type="text" value={name} onChange={e => setName(e.currentTarget.value)} className="flex-grow min-w-32 rounded bg-zinc-900 px-1" />
              <input type="text" value={value} onChange={e => setValue(e.currentTarget.value)} className="w-10 min-w-10 rounded bg-zinc-900 text-center px-1" />
              <input type="text" value={weight} onChange={e => setWeight(e.currentTarget.value)} className="w-10 min-w-10 rounded bg-zinc-900 text-center px-1" />
              <input type="text" value={slotsOR} onChange={e => setSlotsOR(e.currentTarget.value)} className="w-10 min-w-10 rounded bg-zinc-900 text-center px-1" />
            </div>
            <div className="flex justify-end mt-1 gap-1">
              {itemsToDelete.length > 0 && (
                <>
                  <button type="button" onClick={clearSelectedItems} className="rounded bg-zinc-800 px-2 py-px font-bold cursor-pointer transition-colors hover:bg-zinc-700">Clear</button>
                  <button type="button" onClick={deleteSelectedItems} className="rounded bg-rose-950 px-2 py-px font-bold cursor-pointer text-rose-100/90 transition-colors hover:bg-rose-900">Delete Selected</button>
                </>
              )}
              <button type="submit" className="rounded bg-zinc-800 px-2 py-px font-bold cursor-pointer transition-colors hover:bg-zinc-700 ml-2">Add</button>
            </div>
          </form>
        </li>
      </ul>
      <div className="mt-2 flex gap-4 justify-end px-1 text-zinc-500">
        {totalSlots > store.capacity && (
          <div className="text-orange-900 mr-auto">This container is full!</div>
        )}
        <div className="flex items-center">
          <span className="font-bold mr-1 text-sm">Slots:</span>
          <span className="font-semibold">{normalizeDecimal(totalSlots)}<span className="text-zinc-700">/{store.capacity}</span></span>
        </div>
        <div className="flex items-center">
          <GiCoins className="mr-1" />
          <span className="font-bold">{normalizeDecimal(calculateContainerValue(store))}</span>
          <span className="ml-px text-xs text-zinc-600 mt-[2px]">gp</span>
        </div>
        <div className="flex items-center">
          <GiWeightCrush className="mr-1" />
          <span className="font-bold">{normalizeDecimal(calculateContainerWeight(store))}</span>
          <span className="ml-px text-xs text-zinc-600 mt-[2px]">lb</span>
        </div>
      </div>
      <StoreConfigModal {...configModal} store={store} saveInventory={saveInventory} />
    </>
  )
}
