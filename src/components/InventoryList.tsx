import { IoArrowBack, IoArrowForward } from "react-icons/io5"
import { Button } from "./Button"
import cx from "../cx"
import { useInventories } from "../hooks/useInventories"

type InventoryListProps = {
  show: boolean
  setShow: (show: boolean) => void
}

export default function InventoryList({ show, setShow}: InventoryListProps) {

  const { inventories, selectedInventory, setSelectedInventory, addInventory } = useInventories()

  function createInventory() {
    const name = prompt("Inventory name:")
    if (name === null) return;
    addInventory(name, 10)
  }

  function toggle() {
    setShow(!show)
  }

  return (
    <aside className={cx({ "min-w-52 pr-4": show, "w-0": !show }, "h-full relative after:block after:absolute after:h-9/10 after:top-1/20 after:right-0 after:border-r-2 after:border-zinc-700")}>
      {show && (
        <div>
          <h2 className="text-xl my-4 font-black text-center text-zinc-400">Inventories</h2>
          <ul className="px-4">
            {inventories.map((inv, i) => (
              <li key={i} className="mb-2">
                <Button onClick={() => setSelectedInventory(inv)} className={`block w-full text-left ${inv === selectedInventory ? "bg-zinc-800 text-zinc-100" : ""}`}>{inv.name}</Button>
              </li>
            ))}
          </ul>
          { inventories.length === 0 && <p className="text-center italic text-zinc-400">No inventories to show.</p> }
          <Button onClick={createInventory} className="block mx-auto mt-6 bg-teal-950 hover:bg-teal-900">
            New Inventory
          </Button>
        </div>
      )}
      <Button onClick={toggle} className={cx({"-right-4 bg-zinc-900": show, "ps-4 pe-1 -right-6": !show}, "absolute top-1/2 px-2 py-6 z-10")}>
        { show ? <IoArrowBack /> : <IoArrowForward /> }
      </Button>
    </aside>
  )
}
