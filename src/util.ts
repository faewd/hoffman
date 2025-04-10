import { Container, Denomination, Item, ItemStack } from "./types"

export function sum(arr: number[]): number {
  return arr.reduce((a, b) => a + b, 0)
}

export function weightToSlots(weight: number) {
  return Math.max(0.2, Math.round(weight / 5))
}

export function resolveItemSlots(item: Item, equipped: boolean = false) {
  return equipped
    ? (item.equippedSlots ?? 0)
    : (item.slotOverride ?? weightToSlots(item.weight))
}

export function calculateStackSlots(stack: ItemStack) {
  return stack.quantity * resolveItemSlots(stack.item, stack.equipped)
}

export function calculateStackWeight(stack: ItemStack) {
  return stack.quantity * stack.item.weight
}

export function calculateContainerSlots(container: Container) {
  if (container.kind === "money-pouch") return container.slots
  return sum(container.items.map(calculateStackSlots))
}

export function calculateContainerWeight(container: Container) {
  if (container.kind === "money-pouch") return 0.02 * sum(Object.values(container.coins))
  return sum(container.items.map(calculateStackWeight))
}

export function calculateContainerValue(container: Container) {
  if (container.kind === "money-pouch") {
    const coins = Object.entries(container.coins) as [Denomination, number][]
    return sum(coins.map(coin => calculateCoinValue(...coin)))
  }

  return sum(container.items.map(stack => stack.quantity * stack.item.value))
}

const conversionRates: Record<Denomination, number> = {
  cp: 0.01,
  sp: 0.1,
  ep: 0.5,
  gp: 1,
  pp: 10
}

export function calculateCoinValue(denomination: Denomination, count: number): number {
  return conversionRates[denomination] * count
}

export function normalizeDecimal(d: number) {
  return d.toFixed(d % 1 < 0.1 ? 0 : 1)
}
