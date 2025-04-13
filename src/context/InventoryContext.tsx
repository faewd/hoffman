import { createContext } from "react";
import { Container, Inventory } from "../types";

type InventoriesContextValue = {
  inventories: Inventory[];
  saveInventories(): void;
  selectedInventory: Inventory | null;
  setSelectedInventory(inventory: Inventory): void;
  addInventory(name: string, strengthScore: number): void;
}

const InventoriesContext = createContext<InventoriesContextValue>({
  inventories: [],
  saveInventories() {},
  selectedInventory: null,
  addInventory(_name, _str) {},
  setSelectedInventory(_inv) {}
})

type InventoryContextValue = {
  inventory: Inventory | null;
  saveInventory(): void;
  addPouch(name: string, capacity: number, slots: number): void;
  addContainer(name: string, capacity: number): void;
  moveContainer(container: Container): {
    left(): void;
    right(): void;
    up(): void;
    down(): void;
  }
  deleteContainer(container: Container): void

}

const InventoryContext = createContext<InventoryContextValue>({
  inventory: null,
  saveInventory() {},
  addPouch() {},
  addContainer() {},
  moveContainer() {
    return {
      left() {},
      right() {},
      up() {},
      down() {},
    }
  },
  deleteContainer() {},
})

export {
  InventoriesContext,
  InventoryContext
}
