import MoneyPouchCard from "./MoneyPouchCard"
import Stat, { SplitStat } from "./Stat"
import { Inventory } from "../types"
import { calculateContainerSlots, calculateContainerValue, calculateContainerWeight, normalizeDecimal, sum } from "../util"
import { Button } from "./Button"
import { useState } from "react"
import AddContainerModal from "./AddContainerModal"
import { IoAddCircle, IoSettingsSharp } from "react-icons/io5"
import ItemStoreCard from "./ItemStoreCard"
import { MoveCardFuncs } from "./ContainerControls"
import useModal from "../hooks/useModal"
import InventoryConfigModal from "./InventoryConfigModal"

type InventoryViewProps = {
  inventory: Inventory,
  saveInventory: () => void
}

export default function InventoryView({ inventory, saveInventory }: InventoryViewProps) {

  const [showAddContainerModal, setShowAddContainerModal] = useState(false)
  const configModal = useModal()

  const containers = inventory!.columns.flat()
  const str = inventory!.strengthScore
  const totalPenalty = sum(inventory!.penalties.map(p => p.slots))
  const invCapactiy = str * 2 - totalPenalty
  const slotsUsed = sum(containers.map(calculateContainerSlots))
  const carriedWeight = sum(containers.map(calculateContainerWeight))
  const weightLimit = str * 10
  const totalWealth = sum(containers.map(calculateContainerValue))

  function addContainer(name: string, capacity: number) {
    inventory.columns[0].unshift({
      kind: "item-container",
      name,
      capacity,
      items: []
    })
    saveInventory();
    setShowAddContainerModal(false)
  }

  function addPouch(name: string, capacity: number, slots: number) {
    inventory.columns[0].unshift({
      kind: "money-pouch",
      name,
      capacity,
      slots,
      coins: { cp: 0, sp: 0, ep: 0, gp: 0, pp: 0 }
    })
    saveInventory();
    setShowAddContainerModal(false)
  }

  function moveCard(colIdx: number, cardIdx: number): MoveCardFuncs {
    return {
      left() {
        if (colIdx === 0) return;
        const col = inventory.columns[colIdx]
        const leftCol = inventory.columns[colIdx - 1]
        const [card] = col.splice(cardIdx, 1)
        leftCol.unshift(card)
        saveInventory()
      },
      right() {
        if (colIdx === 1) return;
        const col = inventory.columns[colIdx]
        const [card] = col.splice(cardIdx, 1)
        if (inventory.columns.length === 1) inventory.columns.push([])
        const rightCol = inventory.columns[colIdx + 1]
        rightCol.unshift(card)
        saveInventory()
      },
      up() {
        if (cardIdx === 0) return;
        const col = inventory.columns[colIdx]
        const [card] = col.splice(cardIdx, 1)
        col.splice(cardIdx - 1, 0, card)
        saveInventory()
      },
      down() {
        const col = inventory.columns[colIdx]
        if (cardIdx === col.length - 1) return;
        const [card] = col.splice(cardIdx, 1)
        col.splice(cardIdx + 1, 0, card)
        saveInventory()
      }
    }
  }

  function deleteCard(colIdx: number, cardIdx: number) {
    const col = inventory.columns[colIdx]
    col.splice(cardIdx, 1)
    saveInventory()
  }

  return (
    <div className="h-full overflow-y-auto pr-6 lg:flex lg:flex-row-reverse lg:gap-8" style={{ scrollbarGutter: "stable" }}>
      <div className="lg:basis-lg">
        <div className="mb-4 flex justify-between items-stretch">
          <h2 className="text-3xl font-bold lg:text-center">{inventory.name}</h2>
          <Button onClick={configModal.open} className="px-3 bg-primary-900"><IoSettingsSharp /></Button>
        </div>
        <div className="grid grid-cols-5 gap-4 lg:flex lg:flex-col">
          <Stat name="Strength" value={str} />
          <SplitStat name="Slots" top={normalizeDecimal(slotsUsed)} bottom={invCapactiy} />
          <Stat name="Slots Remaining" value={normalizeDecimal(Math.max(0, invCapactiy - slotsUsed))} />
          <SplitStat name="Carried Weight" top={normalizeDecimal(carriedWeight)} bottom={weightLimit} unit="lb" />
          <Stat name="Total Wealth" value={normalizeDecimal(totalWealth)} unit="gp" />
        </div>
      </div>

      <div className="mt-4 lg:mt-1 w-full">
          <div className="flex gap-4 items-center mb-4">
            <h3 className="font-bold text-2xl">Containers</h3>
            <Button onClick={() => setShowAddContainerModal(true)} className="px-2"><IoAddCircle /></Button>
          </div>
          <div className="grid grid-cols-2 gap-4 xl:gap-8">
            {inventory.columns.map((col, colIdx) => (
              <div key={colIdx} className="flex flex-col align-start gap-4 xl:gap-8">
                {col.map((container, cardIdx) => (
                  <article key={cardIdx + container.name} className="rounded-xl bg-zinc-950 p-4 py-2 group">
                    {container.kind === "money-pouch"
                      ? <MoneyPouchCard pouch={container} saveInventory={saveInventory} moveCard={moveCard(colIdx, cardIdx)} deleteCard={() => deleteCard(colIdx, cardIdx)} />
                      : <ItemStoreCard store={container} saveInventory={saveInventory} moveCard={moveCard(colIdx, cardIdx)} deleteCard={() => deleteCard(colIdx, cardIdx)}  />
                    }
                  </article>
                ))}
              </div>
            ))}
          </div>
        </div>

      <AddContainerModal show={showAddContainerModal} onClose={() => setShowAddContainerModal(false)} addPouch={addPouch} addContainer={addContainer} />
      <InventoryConfigModal {...configModal} inventory={inventory} saveInventory={saveInventory} />
    </div>
  )
}
