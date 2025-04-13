import { useEffect, useState } from 'react'
import InventoryView from './components/InventoryView'
import InventoryList from './components/InventoryList'
import { useInventories } from './hooks/useInventories'

function App() {

  const { inventories, selectedInventory, setSelectedInventory } = useInventories()

  const [showSidebar, setShowSidebar] = useState(true)

  useEffect(() => {
    if (inventories.length === 0) return;
    if (selectedInventory === null) setSelectedInventory(inventories[0])
    else setShowSidebar(false)
  }, [selectedInventory, inventories, setSelectedInventory])

  return (
    <div className="font-lora font-medium bg-zinc-900 text-zinc-300 h-full">
      <h1 className="text-3xl font-bold p-2 bg-zinc-950 shadow-lg h-min">Hoffman's Storage Solution</h1>
      <main className="flex h-[calc(100vh-52px)] w-screen">
        <InventoryList show={showSidebar} setShow={setShowSidebar} />
        <section className="p-4 pl-8 h-full overflow-y-hidden w-full">
          <InventoryView />
        </section>
      </main>
    </div>
  )
}

export default App
