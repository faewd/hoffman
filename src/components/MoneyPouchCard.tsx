import { GiCoins, GiSwapBag, GiWeightCrush } from "react-icons/gi";
import { MoneyPouch } from "../types";
import { useEffect, useRef, useState } from "react";
import { calculateContainerValue, calculateContainerWeight, normalizeDecimal } from "../util";
import cx from "../cx";
import ContainerControls, { MoveCardFuncs } from "./ContainerControls";
import { AiOutlineFieldNumber } from "react-icons/ai";
import { Button } from "./Button";

type MoneyPouchProps = {
  pouch: MoneyPouch,
  saveInventory: () => void,
  moveCard: MoveCardFuncs
}

type Denom = keyof MoneyPouch["coins"]

export default function MoneyPouchCard({ pouch, saveInventory, moveCard }: MoneyPouchProps) {

  const [showPouchConfigModal, setShowPouchConfigModal] = useState(false)

  const [coins, setCoins] = useState(
    Object.fromEntries(
      Object.entries(pouch.coins)
            .map(([k, v]) => [k, v.toString()])
    ) as Record<Denom, string>
  )

  const entries = Object.entries(coins) as [Denom, string][]
  const totalCoins = entries.map(([_, n]) => +n).reduce((a, b) => a + b)

  function setCoin(denomination: Denom, value: string) {
    setCoins({
      ...coins,
      [denomination]: value
    })

    const intValue = parseInt(value, 10)

    pouch.coins = {
      ...pouch.coins,
      [denomination]: isNaN(intValue) ? 0 : intValue
    };
    saveInventory();
  }

  function normalizeCoin(denomination: Denom) {
    const intValue = parseInt(coins[denomination], 10)
    setCoins({
      ...coins,
      [denomination]: isNaN(intValue) ? 0 : intValue
    })
  }

  const denomColor: Record<Denom, string> = {
    cp: "text-amber-700",
    sp: "text-slate-400",
    ep: "text-amber-100",
    gp: "text-yellow-600",
    pp: "text-cyan-700",
  }

  return (
    <>
      <div className="flex pb-2 gap-2 items-center">
        <h4 className="text-lg font-semibold mr-auto">{pouch.name}</h4>
        <ContainerControls moveCard={moveCard} editCard={() => setShowPouchConfigModal(true)} />
        <GiSwapBag size="32" className="text-zinc-500" />
      </div>
      <div className="grid grid-cols-5 gap-2 xl:gap-4">
        {entries.map(([denomination, quantity]) => (
          <div className="relative w-full" key={denomination}>
            <input type="string" value={quantity} onChange={e => setCoin(denomination, e.currentTarget.value)} onBlur={() => normalizeCoin(denomination)} className="text-xl px-2 bg-zinc-900 rounded w-full" />
            <span className={cx("uppercase text-sm font-bold absolute right-1 bottom-px opacity-50", denomColor[denomination])}>{denomination}</span>
          </div>
        ))}
      </div>
      <div className="mt-2 flex gap-4 justify-end px-1 text-zinc-500">
        {totalCoins > pouch.capacity && (
          <div className="text-orange-900 mr-auto">This pouch is overflowing!</div>
        )}
        <div className="flex items-center">
          <AiOutlineFieldNumber className="mr-1" />
          <span className="font-bold">{totalCoins}</span>
        </div>
        <div className="flex items-center">
          <GiCoins className="mr-1" />
          <span className="font-bold">{normalizeDecimal(calculateContainerValue(pouch))}</span>
          <span className="ml-px text-xs text-zinc-600 mt-[2px]">gp</span>
        </div>
        <div className="flex items-center">
          <GiWeightCrush className="mr-1" />
          <span className="font-bold">{normalizeDecimal(calculateContainerWeight(pouch))}</span>
          <span className="ml-px text-xs text-zinc-600 mt-[2px]">lb</span>
        </div>
      </div>
      <PouchConfigModal pouch={pouch} saveInventory={saveInventory} show={showPouchConfigModal} onClose={() => setShowPouchConfigModal(false)} />
    </>
  )
}

type PouchConfigModalProps = {
  show: boolean
  pouch: MoneyPouch
  onClose: () => void
  saveInventory: () => void
}

function PouchConfigModal({ show, pouch, onClose, saveInventory }: PouchConfigModalProps) {
  
  const [name, setName] = useState(pouch.name)
  const [capacity, setCapacity] = useState(pouch.capacity + "")
  const [slots, setSlots] = useState(pouch.slots + "")

  const ref = useRef<HTMLDialogElement>(null);
  const open = () => ref.current?.showModal()
  const close = () => ref.current?.close()

  useEffect(() => {
    if (show) open()
    else close()
  }, [ref, show])

  function save() {
    pouch.name = name;
    const numCapacity = parseInt(capacity, 10)
    if (!isNaN(numCapacity)) pouch.capacity = numCapacity;
    const numSlots = parseFloat(slots)
    if (!isNaN(numSlots)) pouch.slots = numSlots;
    saveInventory()
    close()
  }

  return (
    <dialog ref={ref} className="rounded-xl bg-zinc-900 text-zinc-300 m-auto backdrop:bg-zinc-950/70 p-4" onClose={onClose}>
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
        <Button onClick={close} className="bg-zinc-800 hover:bg-zinc-700">Cancel</Button>
        <Button onClick={save}>Save</Button>
      </div>
    </dialog>
  )
}
