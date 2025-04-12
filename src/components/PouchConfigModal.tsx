import { useState } from "react"
import { ModalProps } from "../hooks/useModal"
import { MoneyPouch } from "../types"
import { Button } from "./Button"
import Modal from "./Modal"

type PouchConfigModalProps = ModalProps & {
  pouch: MoneyPouch
  saveInventory: () => void
}

export default function PouchConfigModal({ pouch, saveInventory, ...modal }: PouchConfigModalProps) {
  
  const [name, setName] = useState(pouch.name)
  const [capacity, setCapacity] = useState(pouch.capacity + "")
  const [slots, setSlots] = useState(pouch.slots + "")

  function save() {
    pouch.name = name;
    const numCapacity = parseInt(capacity, 10)
    if (!isNaN(numCapacity)) pouch.capacity = numCapacity;
    const numSlots = parseFloat(slots)
    if (!isNaN(numSlots)) pouch.slots = numSlots;
    saveInventory()
    modal.close()
  }

  return (
    <Modal {...modal}>
      <h1 className="font-bold text-3xl text-center my-6">Configure Money Pouch</h1>
      <div className="text-lg grid grid-cols-[max-content_auto] gap-2 items-center">
        <label htmlFor="configMoneyPouchNameInput" className="font-semibold">Name:</label>
        <input id="configMoneyPouchNameInput" type="text" value={name} onChange={e => setName(e.target.value)} className="bg-zinc-950 rounded px-2 py-1 w-50" />
               
        <label htmlFor="configMoneyPouchSlotsInput" className="font-semibold">Capacity (slots):</label>
        <input id="configMoneyPouchSlotsInput" type="number" min={0.2}  value={capacity} onChange={e => setCapacity(e.target.value)} step={0.2} className="bg-zinc-950 rounded px-2 py-1 w-20" />
      
        <label htmlFor="configMoneyPouchSlotsInput" className="font-semibold">Slots:</label>
        <input id="configMoneyPouchSlotsInput" type="number" min={0.2}  value={slots} onChange={e => setSlots(e.target.value)} step={0.2} className="bg-zinc-950 rounded px-2 py-1 w-20" />
      </div>
      <div className="text-lg text-zinc-400 mt-6">
        <p className="mt-2">A money pouch is used to hold coins of mixed denominations.</p>
        <p className="mt-2"><strong>Max coins</strong> is the maximum number of coins that a pouch can contain.</p>
        <p className="mt-2"><strong>Slots</strong> is the number of slots that the pouch will take up in the wearer's inventory.</p>
      </div>
      <div className="mt-4 flex justify-end gap-2">
        <Button onClick={modal.close} className="bg-zinc-800 hover:bg-zinc-700">Cancel</Button>
        <Button onClick={save}>Save</Button>
      </div>
    </Modal>
  )
}
