import { useEffect, useState } from 'react'
import { Inventory } from './types'
import InventoryView from './components/InventoryView'
import InventoryList from './components/InventoryList'

function App() {

  const [inventories, setInventories] = useState<Inventory[]>(() => JSON.parse(localStorage.getItem("hss-invs") ?? "[]"))
  const [selectedInv, setSelectedInv] = useState<Inventory | null>(null)

  const [showSidebar, setShowSidebar] = useState(true)

  useEffect(() => {
    if (inventories.length === 0) return;
    if (selectedInv === null) setSelectedInv(inventories[0])
    else setShowSidebar(false)
  }, [selectedInv, inventories])

  function saveInventory() {
    setInventories(structuredClone(inventories))
    localStorage.setItem("hss-invs", JSON.stringify(inventories))
  }

  function createInventory() {
    const name = prompt("Inventory name:");
    if (name === null) return;
    const inv = {
      name,
      strengthScore: 10,
      penalties: [],
      columns: [[], []]
    }
    inventories.push(inv)
    setSelectedInv(inv);
    saveInventory();
  }

  return (
    <div className="font-lora font-medium bg-zinc-900 text-zinc-300 h-full">
      <h1 className="text-3xl font-bold p-2 bg-zinc-950 shadow-lg h-min">Hoffman's Inventory Tracker</h1>
      <main className="flex h-[calc(100vh-52px)] w-screen">
        <InventoryList {...{ inventories, selectedInv, setSelectedInv, createInventory }} show={showSidebar} setShow={setShowSidebar} />
        <section className="p-4 pl-8 h-full overflow-y-hidden w-full">
          {selectedInv === null
            ? <p className="text-center italic text-zinc-400">No inventory selected.</p>
            : <InventoryView inventory={selectedInv} saveInventory={saveInventory} />
          }
        </section>
      </main>
    </div>
  )
}

export default App
