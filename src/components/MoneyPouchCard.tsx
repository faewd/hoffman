import { GiCoins, GiSwapBag, GiWeightCrush } from "react-icons/gi";
import { Denomination, MoneyPouch } from "../types";
import { useState } from "react";
import { calculateContainerValue, calculateContainerWeight, normalizeDecimal } from "../util";
import cx from "../cx";
import ContainerControls from "./ContainerControls";
import { AiOutlineFieldNumber } from "react-icons/ai";
import PouchConfigModal from "./PouchConfigModal";
import useModal from "../hooks/useModal";
import { useInventory } from "../hooks/useInventories";

type MoneyPouchProps = {
  pouch: MoneyPouch,
}

export default function MoneyPouchCard({ pouch }: MoneyPouchProps) {

  const configModal = useModal()

  const { saveInventory } = useInventory()

  const [coins, setCoins] = useState(
    Object.fromEntries(
      Object.entries(pouch.coins)
            .map(([k, v]) => [k, v.toString()])
    ) as Record<Denomination, string>
  )

  const entries = Object.entries(coins) as [Denomination, string][]
  const totalCoins = entries.map(([_, n]) => +n).reduce((a, b) => a + b)

  function setCoin(denomination: Denomination, value: string) {
    setCoins({
      ...coins,
      [denomination]: value
    })

    const intValue = parseInt(value, 10)

    pouch.coins = {
      ...pouch.coins,
      [denomination]: isNaN(intValue) ? 0 : intValue
    };

    saveInventory()
  }

  function normalizeCoin(denomination: Denomination) {
    const intValue = parseInt(coins[denomination], 10)
    setCoins({
      ...coins,
      [denomination]: isNaN(intValue) ? 0 : intValue
    })
    saveInventory()
  }

  const denomColor: Record<Denomination, string> = {
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
        <ContainerControls container={pouch} onEdit={configModal.open} />
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
      <PouchConfigModal {...configModal} pouch={pouch} />
    </>
  )
}
