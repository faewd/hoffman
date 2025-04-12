import { GiClothes, GiCoins, GiKnapsack, GiWeightCrush } from "react-icons/gi"
import { ItemContainer, ItemStack } from "../types"
import { calculateContainerSlots, calculateContainerValue, calculateContainerWeight, calculateStackSlots, normalizeDecimal, weightToSlots } from "../util"
import { FormEvent, useEffect, useRef, useState } from "react"
import { AiOutlineFieldNumber } from "react-icons/ai"
import ContainerControls, { MoveCardFuncs } from "./ContainerControls"
import { Button } from "./Button"
import { IoSettingsSharp, IoRemoveCircleOutline, IoTrashSharp } from "react-icons/io5"
import cx from "../cx"
import Stat from "./Stat"

type ItemStoreCardProps = {
  store: ItemContainer,
  saveInventory: () => void,
  moveCard: MoveCardFuncs,
  deleteCard: () => void
}

export default function ItemStoreCard({ store, saveInventory, moveCard, deleteCard }: ItemStoreCardProps) {

  const [quantity, setQuantity] = useState("")
  const [name, setName] = useState("")
  const [weight, setWeight] = useState("")
  const [value, setValue] = useState("")
  const [slotsOR, setSlotsOR] = useState("")

  const [itemsToDelete, setItemsToDelete] = useState<number[]>([])

  const [showStoreConfigModal, setShowStoreConfigModal] = useState(false)

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
    saveInventory()
  }

  const totalSlots = calculateContainerSlots(store)

  return (
    <>
      <div className="flex pb-2 gap-2 items-center">
        <h4 className="text-lg font-semibold mr-auto">{store.name}</h4>
        <ContainerControls moveCard={moveCard} editCard={() => setShowStoreConfigModal(true)} deleteCard={deleteCard} />
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
        {store.items.map((stack, i) => <ItemEntry key={i} stack={stack} saveInventory={saveInventory} flagged={itemsToDelete.includes(i)} toggleFlagged={() => toggleFlagged(i)} />)}
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
      <StoreConfigModal store={store} saveInventory={saveInventory} show={showStoreConfigModal} onClose={() => setShowStoreConfigModal(false)} />
    </>
  )
}

type ItemEntryProps = {
  stack: ItemStack,
  saveInventory: () => void
  flagged: boolean
  toggleFlagged: () => void
}

function ItemEntry({ stack, saveInventory, flagged, toggleFlagged }: ItemEntryProps) {

  const [quantity, setQuantity] = useState(stack.quantity + "")
  const [name, setName] = useState(stack.item.name)
  const [value, setValue] = useState(stack.item.value + "")
  const [weight, setWeight] = useState(stack.item.weight + "")

  const [showConfigModal, setShowConfigModal] = useState(false)

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

  function configureStack() {
    setShowConfigModal(true)
  }

  return (
    <li className="group/item flex gap-1 mb-1 relative rounded-sm">
      <input type="text" value={quantity} onChange={e => setQuantity(e.currentTarget.value)} onBlur={commit} className={cx("w-10 min-w-10 rounded bg-zinc-900 text-center px-1", { "opacity-50 bg-rose-950 line-through": flagged })} />
      <input type="text" value={name} onChange={e => setName(e.currentTarget.value)} onBlur={commit} className={cx("flex-grow min-w-32 rounded bg-zinc-900 px-1", { "opacity-50 bg-rose-950 line-through": flagged })} />
      <input type="text" value={value} onChange={e => setValue(e.currentTarget.value)} onBlur={commit} className={cx("w-10 min-w-10 rounded bg-zinc-900 text-center px-1", { "opacity-50 bg-rose-950 line-through": flagged })} />
      <input type="text" value={weight} onChange={e => setWeight(e.currentTarget.value)} onBlur={commit} className={cx("w-10 min-w-10 rounded bg-zinc-900 text-center px-1", { "opacity-50 bg-rose-950 line-through": flagged })} />
      <output title="Configure Slot Count" className={cx("w-10 min-w-10 rounded bg-zinc-900 text-center px-1 cursor-default", { "opacity-50 bg-rose-950 line-through": flagged }, { "text-teal-4java has00 saturate-30": stack.item.slotOverride !== null })}>
        {normalizeDecimal(calculateStackSlots(stack))}
      </output>
      <div className="flex absolute right-33 h-full items-center">
        { stack.equipped && <div className="w-3 h-3 bg-teal-800 rounded-full mr-2 border-3 border-zinc-900"></div> }
        <div className="hidden group-hover/item:flex gap-1 h-full">
          <Button onClick={toggleEquipped} className={cx("flex items-center justify-center bg-zinc-800 hover:bg-zinc-700 h-full w-8 p-0 rounded-sm", { "bg-teal-950 text-teal-100 hover:bg-teal-900": stack.equipped })}>
            <GiClothes />
          </Button>
          <Button onClick={configureStack} className="flex items-center justify-center bg-zinc-800 hover:bg-zinc-700 h-full w-8 p-0 rounded-sm">
            <IoSettingsSharp />
          </Button>
          <Button onClick={toggleFlagged} className="flex items-center justify-center bg-rose-950 hover:bg-rose-900 text-rose-100 h-full w-8 p-0 rounded-sm">
            {flagged ? <IoRemoveCircleOutline /> : <IoTrashSharp />}
          </Button>
        </div>
      </div>
      <ItemConfigModal show={showConfigModal} stack={stack} onClose={() => setShowConfigModal(false)} saveInventory={saveInventory} />
    </li>
  )
}

type ItemConfigModalProps = {
  show: boolean
  stack: ItemStack
  onClose: () => void
  saveInventory: () => void
}

function ItemConfigModal({ show, stack, onClose, saveInventory }: ItemConfigModalProps) {

  const [quantity, setQuantity] = useState(stack.quantity + "")
  const [name, setName] = useState(stack.item.name)
  const [value, setValue] = useState(stack.item.value + "")
  const [weight, setWeight] = useState(stack.item.weight + "")
  const [useOR, setUseOR] = useState(stack.item.slotOverride !== null)
  const [slotsOR, setSlotsOR] = useState((stack.item.slotOverride ?? weightToSlots(stack.item.weight)) + "")
  const [useES, setUseES] = useState(!!stack.item.equippedSlots)
  const [equippedSlots, setEquippedSlots] = useState(stack.item.equippedSlots + "")

  const ref = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    if (show) ref.current?.showModal();
    else ref.current?.close()
  }, [show])

  function commit(e: FormEvent) {
    e.preventDefault()

    const numQuantity = parseInt(quantity, 10)
    const numValue = parseFloat(value)
    const numSlotsOR = parseFloat(slotsOR)
    const numES = parseFloat(equippedSlots)
    const trimmedName = name.trim()

    stack.quantity = isNaN(numQuantity) ? 0 : numQuantity;
    stack.item.name = trimmedName.length === 0 ? stack.item.name : trimmedName;
    stack.item.value = isNaN(numValue) ? 0 : numValue
    stack.item.slotOverride = useOR ? (isNaN(numSlotsOR) ? 0 : numSlotsOR) : null
    stack.item.equippedSlots = useES && !isNaN(numES) ? numES : 0

    saveInventory()
    onClose()
  }

  return (
    <dialog ref={ref} onClose={onClose} className="rounded-xl bg-zinc-900 text-zinc-300 m-auto backdrop:bg-zinc-950/70 p-4">
      <h1 className="font-bold text-2xl text-center mb-3">Configure Entry</h1>
      <form onSubmit={commit}>
        <div className="grid grid-cols-[max-content_1fr] gap-2">
          <label htmlFor="configModalName" className="font-bold w-full">Item Name:</label>
          <input id="configModalName" type="text" value={name} min={1} onChange={e => setName(e.currentTarget.value)} className="w-48 min-w-10 rounded bg-zinc-950 px-1" />

          <label htmlFor="configModalQuantity" className="font-bold w-full">Quantity:</label>
          <input id="configModalQuantity" type="number" value={quantity} min={1} onChange={e => setQuantity(e.currentTarget.value)} className="w-16 min-w-10 rounded bg-zinc-950 px-1" />

          <label htmlFor="configModalValue" className="font-bold w-full">Value <span className="text-zinc-400 font-semibold">(gp/each)</span>:</label>
          <input id="configModalValue" type="number" value={value} min={0} step={0.01} onChange={e => setValue(e.currentTarget.value)} className="w-16 min-w-10 rounded bg-zinc-950 px-1" />

          <label htmlFor="configModalWeight" className="font-bold w-full">Weight <span className="text-zinc-400 font-semibold">(lb/each)</span>:</label>
          <input id="configModalWeight" type="number" value={weight} min={0} step={0.01} onChange={e => setWeight(e.currentTarget.value)} className="w-16 min-w-10 rounded bg-zinc-950 px-1" />
        </div>
        <div>
          <h2 className="text-xl font-bold mt-4 mb-1">Slots</h2>
          <p className="mb-2">
            This item weighs <span className="font-bold">{weight}</span><span className="text-sm ps-px text-zinc-400">lb</span>,
            so will take up <span className="font-bold">{weightToSlots(+weight)}</span> slots unless overidden.
          </p>
          <div className="flex w-full justify-between">
            <div className="flex gap-4">
              <label htmlFor="configModalName" className="font-bold">Override?</label>
              <input type="checkbox" checked={useOR} onChange={e => setUseOR(e.currentTarget.checked)} className="appearance-none block w-10 bg-zinc-950 h-6 rounded-full relative cursor-pointer after:absolute after:block after:w-4 after:h-4 after:bg-teal-800 after:rounded-full after:top-1 after:left-1 checked:after:left-5 after:transition-all checked:bg-teal-950" />
            </div>
            {useOR && (
              <div className="flex gap-2">
                <label htmlFor="configModalSlotsOR" className="font-bold">Slots <span className="text-zinc-400 font-semibold">(each)</span>:</label>
                <input id="configModalSlotsOR" type="number" value={slotsOR} min={0} step={0.1} onChange={e => setSlotsOR(e.currentTarget.value)} className="w-16 min-w-10 rounded bg-zinc-950 px-1" />
              </div>
            )} 
          </div>
          <div className="flex w-full justify-between">
            <div className="flex gap-4">
              <label htmlFor="configModalName" className="font-bold">Uses slots while equipped?</label>
              <input type="checkbox" checked={useES} onChange={e => setUseES(e.currentTarget.checked)} className="appearance-none block w-10 bg-zinc-950 h-6 rounded-full relative cursor-pointer after:absolute after:block after:w-4 after:h-4 after:bg-teal-800 after:rounded-full after:top-1 after:left-1 checked:after:left-5 after:transition-all checked:bg-teal-950" />
            </div>
            {useES && (
              <div className="flex gap-2">
                <label htmlFor="configModalSlotsOR" className="font-bold">Slots <span className="text-zinc-400 font-semibold">(each)</span>:</label>
                <input id="configModalSlotsOR" type="number" value={equippedSlots} min={0} step={0.1} onChange={e => setEquippedSlots(e.currentTarget.value)} className="w-16 min-w-10 rounded bg-zinc-950 px-1" />
              </div>
            )} 
          </div>
        </div>
        <div className="grid grid-cols-3 gap-2 mt-4">
          <Stat name="Total Value" value={+value * +quantity} unit="gp" />
          <Stat name="Total Weight" value={+weight * +quantity} unit="lb" />
          <Stat name="Total Slots" value={(useOR ? +slotsOR : weightToSlots(+weight)) * +quantity} />
        </div>
        <div className="flex justify-end gap-2 mt-4">
          <button type="button" onClick={onClose} className="bg-zinc-800 rounded px-4 py-1 font-bold hover:bg-zinc-700 cursor-pointer transition-colors">Cancel</button>
          <button type="submit" className="bg-teal-950 rounded px-4 py-1 font-bold hover:bg-teal-900 cursor-pointer transition-colors">Save</button>
        </div>
      </form>
    </dialog>
  )
}


type StoreConfigModalProps = {
  show: boolean
  store: ItemContainer
  onClose: () => void
  saveInventory: () => void
}

function StoreConfigModal({ show, store, onClose, saveInventory }: StoreConfigModalProps) {
  
  const [name, setName] = useState(store.name)
  const [capacity, setCapacity] = useState(store.capacity + "")

  const ref = useRef<HTMLDialogElement>(null);
  const open = () => ref.current?.showModal()
  const close = () => ref.current?.close()

  useEffect(() => {
    if (show) open()
    else close()
  }, [ref, show])

  function save() {
    store.name = name;
    const numCapacity = parseInt(capacity)
    if (!isNaN(numCapacity)) store.capacity = numCapacity;
    saveInventory()
    close()
  }

  return (
    <dialog ref={ref} className="rounded-xl bg-zinc-900 text-zinc-300 m-auto backdrop:bg-zinc-950/70 p-4" onClose={onClose}>
      <h1 className="font-bold text-3xl text-center my-6">Configure Container</h1>
      <div className="text-lg grid grid-cols-[max-content_auto] gap-2 items-center">
        <label htmlFor="configMoneyPouchNameInput" className="font-semibold">Name:</label>
        <input id="configMoneyPouchNameInput" type="text" value={name} onChange={e => setName(e.target.value)} className="bg-zinc-950 rounded px-2 py-1 w-50" />
               
        <label htmlFor="configMoneyPouchSlotsInput" className="font-semibold">Capacity (slots):</label>
        <input id="configMoneyPouchSlotsInput" type="number" min={0.2}  value={capacity} onChange={e => setCapacity(e.target.value)} step={0.2} className="bg-zinc-950 rounded px-2 py-1 w-20" />
      </div>
      <div className="text-lg text-zinc-400 mt-6 max-w-[50ch]">
        <p className="mt-2">An item store is a container for equipment items such as a bag, pouch, belt or case that can be equipped by a character.</p>
        <p className="mt-2"><strong>Capacity</strong> is the number of slots available in the container before it is considered full.</p>
      </div>
      <div className="mt-4 flex justify-end gap-2">
        <Button onClick={close} className="bg-zinc-800 hover:bg-zinc-700">Cancel</Button>
        <Button onClick={save}>Save</Button>
      </div>
    </dialog>
  )
}
