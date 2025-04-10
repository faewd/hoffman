
export type Inventory = {
  name: string,
  strengthScore: number,
  penalties: Penalty[],
  columns: Container[][]
}

export type Penalty = {
  source: string,
  slots: number
}

export type Container = ItemContainer | MoneyPouch

export type MoneyPouch = {
  kind: "money-pouch",
  name: string,
  capacity: number,
  slots: number,
  coins: {
    cp: number
    sp: number
    ep: number
    gp: number
    pp: number
  }
}

export type Denomination = keyof MoneyPouch["coins"]

export type ItemContainer = {
  kind: "item-container",
  name: string,
  capacity: number,
  items: ItemStack[]
}

export type ItemStack = {
  item: Item
  quantity: number
  equipped: boolean,
}

export type Item = {
  name: string
  weight: number
  value: number
  slotOverride: number | null
  equippedSlots: number | null
}
