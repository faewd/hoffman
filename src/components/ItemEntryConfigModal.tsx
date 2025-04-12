import { FormEvent, useState } from "react"
import { normalizeDecimal, weightToSlots } from "../util"
import Modal from "./Modal"
import Stat from "./Stat"
import { ItemStack } from "../types"
import { ModalProps } from "../hooks/useModal"

type ItemConfigModalProps = ModalProps & {
  stack: ItemStack
  saveInventory: () => void
}

export default function ItemConfigModal({ stack, saveInventory, ...modal }: ItemConfigModalProps) {

  const [quantity, setQuantity] = useState(stack.quantity + "")
  const [name, setName] = useState(stack.item.name)
  const [value, setValue] = useState(stack.item.value + "")
  const [weight, setWeight] = useState(stack.item.weight + "")
  const [useOR, setUseOR] = useState(stack.item.slotOverride !== null)
  const [slotsOR, setSlotsOR] = useState((stack.item.slotOverride ?? weightToSlots(stack.item.weight)) + "")
  const [useES, setUseES] = useState(!!stack.item.equippedSlots)
  const [equippedSlots, setEquippedSlots] = useState(stack.item.equippedSlots + "")

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
    modal.close()
  }

  return (
    <Modal {...modal}>
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
          <Stat name="Total Value" value={normalizeDecimal(+value * +quantity)} unit="gp" />
          <Stat name="Total Weight" value={normalizeDecimal(+weight * +quantity)} unit="lb" />
          <Stat name="Total Slots" value={normalizeDecimal((useOR ? +slotsOR : weightToSlots(+weight)) * +quantity)} />
        </div>
        <div className="flex justify-end gap-2 mt-4">
          <button type="button" onClick={modal.close} className="bg-zinc-800 rounded px-4 py-1 font-bold hover:bg-zinc-700 cursor-pointer transition-colors">Cancel</button>
          <button type="submit" className="bg-teal-950 rounded px-4 py-1 font-bold hover:bg-teal-900 cursor-pointer transition-colors">Save</button>
        </div>
      </form>
    </Modal>
  )
}
