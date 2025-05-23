import { useEffect, useState } from "react";
import { ModalProps } from "../hooks/useModal";
import Modal from "./Modal";
import { Button } from "./Button";
import { useInventory } from "../hooks/useInventories";

export default function InventoryConfigModal(modal: ModalProps) {

  const { inventory, saveInventory } = useInventory()

  const [name, setName] = useState(inventory?.name ?? "")
  const [str, setStr] = useState((inventory?.strengthScore ?? 10) + "")

  useEffect(() => {
    setName(inventory?.name ?? "")
    setStr((inventory?.strengthScore ?? 10) + "")
  }, [inventory, modal.show])

  function save() {
    if (inventory === null) return;
    inventory.name = name;

    const numStr = parseInt(str, 10);
    inventory.strengthScore = isNaN(numStr) ? 10 : numStr;

    saveInventory()
    modal.close()
  }

  return (
    <Modal {...modal}>
      <Modal.Heading>Configure Inventory</Modal.Heading>
      <div className="text-lg grid grid-cols-[max-content_auto] gap-2 items-center">
        <label htmlFor="configInvName" className="font-semibold">Name:</label>
        <input id="configInvName" type="text" value={name} onChange={e => setName(e.target.value)} className="bg-zinc-950 rounded px-2 py-1 w-50" />
        
        <label htmlFor="configInvStr" className="font-semibold">Strength Score:</label>
        <input id="configInvStr" type="number" min={0} value={str} onChange={e => setStr(e.target.value)} className="bg-zinc-950 rounded px-2 py-1 w-20" />
      </div>
      <div className="mt-4 flex justify-end gap-2">
        <Button onClick={modal.close} className="bg-zinc-800 hover:bg-zinc-700">Cancel</Button>
        <Button onClick={save}>Save</Button>
      </div>
    </Modal>
  )
}
