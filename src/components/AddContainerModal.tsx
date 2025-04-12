import { ReactNode, useEffect, useState } from "react"
import { GiKnapsack, GiSwapBag } from "react-icons/gi";
import { Button } from "./Button";
import { IoArrowBack } from "react-icons/io5";
import Modal from "./Modal";
import { ModalProps } from "../hooks/useModal";

type AddContainerModalProps = ModalProps & {
  addPouch: (name: string, capacity: number, slots: number) => void
  addContainer: (name: string, capacity: number) => void
}

type Page = "select-type" | "config-pouch" | "config-item-store"

export default function AddContainerModal({ addPouch, addContainer, ...modal }: AddContainerModalProps) {

  const [page, setPage] = useState<Page>("select-type")
  
  useEffect(() => {
    setPage("select-type")
  }, [modal.show])

  return (
    <Modal {...modal}>
      <ModalPage {...{ page, setPage, addPouch, addContainer }} close={modal.close} />
    </Modal>
  )
}

type ModalPageProps = {
  page: Page;
  setPage: (page: Page) => void
  close: () => void
  addPouch: (name: string, capacity: number, slots: number) => void
  addContainer: (name: string, capacity: number) => void
}

function ModalPage(props: ModalPageProps) {
  switch(props.page) {
    case "select-type":
      return <TypeSelection {...props} />
    case "config-pouch":
      return <PouchConfig {...props} />
    case "config-item-store":
      return <ItemStoreConfig {...props} />
  }
}

function ModalContent({ title, children }: { title: string; children: ReactNode }) {
  return (
    <>
      <h1 className="font-bold text-3xl text-center my-6">{title}</h1>
      {children}
    </>
  )
}

function TypeSelection({ setPage }: ModalPageProps) {
  return (
    <ModalContent title="Add Container">
      <div className="flex gap-4">
        <Button onClick={() => setPage("config-pouch")} className="py-4 px-8 flex flex-col justify-end items-center">
          <GiSwapBag size="100" className="mb-2" />
          <div className="text-xl">Money Pouch</div>
        </Button>
        <Button onClick={() => setPage("config-item-store")} className="py-4 px-8 flex flex-col justify-end items-center">
          <GiKnapsack size="100" className="mb-2" />
          <div className="text-xl">Item Storage</div>
        </Button>
      </div>
    </ModalContent>
  )
}

function PouchConfig({ addPouch, setPage, close }: ModalPageProps) {

  const [name, setName] = useState("Coin Purse")
  const [capacity, setCapacity] = useState(100)
  const [slots, setSlots] = useState(1)

  return (
    <ModalContent title="Configure Money Pouch">
      <Button onClick={() => setPage("select-type")} className="flex gap-2 items-center p-0 underline absolute top-2 bg-zinc-900 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900">
        <IoArrowBack />
        Back
      </Button>
      <div className="text-lg grid grid-cols-[max-content_auto] gap-2 items-center">
        <label htmlFor="configMoneyPouchNameInput" className="font-semibold">Name:</label>
        <input id="configMoneyPouchNameInput" type="text" value={name} onChange={e => setName(e.target.value)} className="bg-zinc-950 rounded px-2 py-1 w-50" />
        
        <label htmlFor="configMoneyPouchCoinsInput" className="font-semibold">Max coins:</label>
        <input id="configMoneyPouchCoinsInput" type="number" min={1}  value={capacity} onChange={e => setCapacity(+e.target.value)} className="bg-zinc-950 rounded px-2 py-1 w-20" />
        
        <label htmlFor="configMoneyPouchSlotsInput" className="font-semibold">Slots:</label>
        <input id="configMoneyPouchSlotsInput" type="number" min={0.2}  value={slots} onChange={e => setSlots(+e.target.value)} step={0.2} className="bg-zinc-950 rounded px-2 py-1 w-20" />
      </div>
      <div className="text-lg text-zinc-400 mt-6">
        <p className="mt-2">A money pouch is used to hold coins of mixed denominations.</p>
        <p className="mt-2"><strong>Max coins</strong> is the maximum number of coins that a pouch can contain.</p>
        <p className="mt-2"><strong>Slots</strong> is the number of slots that the pouch will take up in the wearer's inventory.</p>
      </div>
      <div className="mt-4 flex justify-end gap-2">
        <Button onClick={close} className="bg-zinc-800 hover:bg-zinc-700">Cancel</Button>
        <Button onClick={() => addPouch(name, capacity, slots)}>Add</Button>
      </div>
    </ModalContent>
  )
}

function ItemStoreConfig({ addContainer, setPage, close }: ModalPageProps) {

  const [name, setName] = useState("Backpack")
  const [capacity, setCapacity] = useState(10)

  return (
    <ModalContent title="Configure Item Storage">
      <Button onClick={() => setPage("select-type")} className="flex gap-2 items-center p-0 underline absolute top-2 bg-zinc-900 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900">
        <IoArrowBack />
        Back
      </Button>
      <div className="text-lg grid grid-cols-[max-content_auto] gap-2 items-center">
        <label htmlFor="configMoneyPouchNameInput" className="font-semibold">Name:</label>
        <input id="configMoneyPouchNameInput" type="text" value={name} onChange={e => setName(e.target.value)} className="bg-zinc-950 rounded px-2 py-1 w-50" />
               
        <label htmlFor="configMoneyPouchSlotsInput" className="font-semibold">Capacity (slots):</label>
        <input id="configMoneyPouchSlotsInput" type="number" min={0.2}  value={capacity} onChange={e => setCapacity(+e.target.value)} step={0.2} className="bg-zinc-950 rounded px-2 py-1 w-20" />
      </div>
      <div className="text-lg text-zinc-400 mt-6 max-w-[50ch]">
        <p className="mt-2">An item store is a container for equipment items such as a bag, pouch, belt or case that can be equipped by a character.</p>
        <p className="mt-2"><strong>Capacity</strong> is the number of slots available in the container before it is considered full.</p>
      </div>
      <div className="mt-4 flex justify-end gap-2">
        <Button onClick={close} className="bg-zinc-800 hover:bg-zinc-700">Cancel</Button>
        <Button onClick={() => addContainer(name, capacity)}>Add</Button>
      </div>
    </ModalContent>
  )
}
