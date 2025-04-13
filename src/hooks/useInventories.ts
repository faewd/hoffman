import { useContext } from "react"
import { InventoryContext, InventoriesContext } from "../context/InventoryContext"

export function useInventory() {
    return useContext(InventoryContext)
}

export function useInventories() {
  return useContext(InventoriesContext)
}