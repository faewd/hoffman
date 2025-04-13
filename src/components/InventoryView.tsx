import MoneyPouchCard from "./MoneyPouchCard"
import Stat, { SplitStat } from "./Stat"
import { calculateContainerSlots, calculateContainerValue, calculateContainerWeight, normalizeDecimal, sum } from "../util"
import { Button } from "./Button"
import AddContainerModal from "./AddContainerModal"
import { IoAddCircle, IoCodeDownloadSharp, IoSettingsSharp } from "react-icons/io5"
import ItemStoreCard from "./ItemStoreCard"
import useModal from "../hooks/useModal"
import InventoryConfigModal from "./InventoryConfigModal"
import { useInventory } from "../hooks/useInventories"

export default function InventoryView() {

  const addContainerModal = useModal()
  const configModal = useModal()

  const { inventory: maybeInv } = useInventory()
  if (maybeInv === null) return <p className="text-center italic text-zinc-400">No inventory selected.</p>
  const inventory = maybeInv

  const containers = inventory!.columns.flat()
  const str = inventory!.strengthScore
  const totalPenalty = sum(inventory!.penalties.map(p => p.slots))
  const invCapactiy = str * 2 - totalPenalty
  const slotsUsed = sum(containers.map(calculateContainerSlots))
  const carriedWeight = sum(containers.map(calculateContainerWeight))
  const weightLimit = str * 10
  const totalWealth = sum(containers.map(calculateContainerValue))

  function downloadJson() {
    const blob = new Blob([JSON.stringify(inventory, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.setAttribute("href", url)
    a.setAttribute("download", `${inventory.name}.json`)
    a.click()
  }

  return (
    <div className="h-full overflow-y-auto pr-6 lg:flex lg:flex-row-reverse lg:gap-8" style={{ scrollbarGutter: "stable" }}>
      <div className="lg:basis-lg">
        <div className="mb-4 flex items-stretch">
          <h2 className="text-3xl font-bold lg:text-center mr-auto">{inventory.name}</h2>
          <Button onClick={downloadJson} className="px-2 bg-primary-900"><IoCodeDownloadSharp size={22} className="ml-px mt-px" /></Button>
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
            <Button onClick={addContainerModal.open} className="px-2"><IoAddCircle /></Button>
          </div>
          <div className="grid grid-cols-2 gap-4 xl:gap-8">
            {inventory.columns.map((col, colIdx) => (
              <div key={colIdx} className="flex flex-col align-start gap-4 xl:gap-8">
                {col.map((container, cardIdx) => (
                  <article key={cardIdx + container.name} className="rounded-xl bg-zinc-950 p-4 py-2 group">
                    {container.kind === "money-pouch"
                      ? <MoneyPouchCard pouch={container} />
                      : <ItemStoreCard store={container} />
                    }
                  </article>
                ))}
              </div>
            ))}
          </div>
        </div>

      <AddContainerModal {...addContainerModal} />
      <InventoryConfigModal {...configModal} />
    </div>
  )
}
