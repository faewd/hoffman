import { useState } from "react"
import { ModalProps } from "../hooks/useModal"
import { ItemContainer } from "../types"
import { Button } from "./Button"
import Modal from "./Modal"

type StoreConfigModalProps = ModalProps & {
  store: ItemContainer
  saveInventory: () => void
}

export default function StoreConfigModal({ store, saveInventory, ...modal }: StoreConfigModalProps) {
  
  const [name, setName] = useState(store.name)
  const [capacity, setCapacity] = useState(store.capacity + "")

  function save() {
    store.name = name;
    const numCapacity = parseInt(capacity)
    if (!isNaN(numCapacity)) store.capacity = numCapacity;
    saveInventory()
    modal.close()
  }

  return (
    <Modal {...modal}>
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
        <Button onClick={modal.close} className="bg-zinc-800 hover:bg-zinc-700">Cancel</Button>
        <Button onClick={save}>Save</Button>
      </div>
    </Modal>
  )
}
