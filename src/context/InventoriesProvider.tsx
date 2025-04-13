import { ReactNode, useMemo, useState } from "react";
import { Container, Inventory } from "../types";
import { InventoriesContext, InventoryContext } from "./InventoryContext";

export function InventoriesProvider({ children }: { children: ReactNode }) {
  const [inventories, setInventories] = useState(() =>
    JSON.parse(localStorage.getItem("hss-invs") ?? "[]")
  );
  const [selectedInventory, setSelectedInventory] = useState<Inventory | null>(
    null
  );

  const [inventoriesValue, inventoryValue] = useMemo(() => {
    function saveInventories() {
      setInventories([ ...inventories ]);
      console.log(inventories)
      localStorage.setItem("hss-invs", JSON.stringify(inventories));
    }

    function addInventory(name: string, strengthScore: number) {
      const inv = {
        name,
        strengthScore,
        penalties: [],
        columns: [[], []],
      };
      inventories.push(inv);
      setSelectedInventory(inv);
      saveInventories();
    }
  
    const inventoriesValue = {
      inventories,
      selectedInventory,
      setSelectedInventory,
      addInventory,
    };
  
    function addContainer(name: string, capacity: number) {
      if (selectedInventory === null) return;
      selectedInventory.columns[0].unshift({
        kind: "item-container",
        name,
        capacity,
        items: []
      })
      saveInventories();
    }
  
    function addPouch(name: string, capacity: number, slots: number) {
      if (selectedInventory === null) return;
      selectedInventory.columns[0].unshift({
        kind: "money-pouch",
        name,
        capacity,
        slots,
        coins: { cp: 0, sp: 0, ep: 0, gp: 0, pp: 0 }
      })
      saveInventories();
    }
  
    function moveContainer(container: Container) {
      const inv = selectedInventory;
      const colIdx = inv?.columns.findIndex(col => col.includes(container))
      const col = inv?.columns[colIdx ?? 0]
      const cardIdx = col?.indexOf(container)
  
      const skip = inv === null || col === undefined || cardIdx === undefined || colIdx === undefined
  
      return {
        left() {
          if (skip || colIdx === 0) return;
          col.splice(cardIdx, 1)
          const leftCol = inv.columns[colIdx - 1]
          leftCol.unshift(container)
          saveInventories()
        },
        right() {
          if (skip || colIdx === 1) return;
          col.splice(cardIdx, 1)
          const rightCol = inv.columns[colIdx + 1]
          rightCol.unshift(container)
          saveInventories()
        },
        up() {
          if (skip || cardIdx === 0) return;
          col.splice(cardIdx, 1)
          col.splice(cardIdx - 1, 0, container)
          saveInventories()
        },
        down() {
          if (skip || cardIdx === col.length - 1) return;
          col.splice(cardIdx, 1)
          col.splice(cardIdx + 1, 0, container)
          saveInventories()
        }
      }
    }
  
    function deleteContainer(container: Container) {
      const inv = selectedInventory;
      const colIdx = inv?.columns.findIndex(col => col.includes(container))
      const col = inv?.columns[colIdx ?? 0]
      const cardIdx = col?.indexOf(container)
  
      const skip = inv === null || col === undefined || cardIdx === undefined || colIdx === undefined
      if (skip) return;
      
      col.splice(cardIdx, 1)
      saveInventories()
    }
  
    const inventoryValue = {
      inventory: selectedInventory,
      saveInventory: saveInventories,
      addContainer,
      addPouch,
      moveContainer,
      deleteContainer
    };

    return [inventoriesValue, inventoryValue]
  }, [inventories, selectedInventory])

  return (
    <InventoriesContext.Provider value={inventoriesValue}>
      <InventoryContext.Provider value={inventoryValue}>
        {children}
      </InventoryContext.Provider>
    </InventoriesContext.Provider>
  );
}
