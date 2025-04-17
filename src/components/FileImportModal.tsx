import { useEffect, useState } from "react";
import { ModalProps } from "../hooks/useModal";
import Modal from "./Modal";
import { Inventory } from "../types";
import { useInventories } from "../hooks/useInventories";
import { IoPushOutline } from "react-icons/io5";

type ImportedInventory = 
  | { file: string; valid: false }
  | { file: string; valid: true } & Inventory

type Having<K extends string> = {
  [key in K]: unknown
}

function has<K extends string>(obj: object, key: K): obj is Having<K> {
  return Object.hasOwn(obj, key)
}

function isValidInventory(data: unknown) {
  if (typeof data !== "object" || data === null) return false;
  return has(data, "name") && typeof data.name === "string"
    && has(data, "strengthScore") && typeof data.strengthScore === "number"
    && has(data, "columns") && typeof data.columns === "object"
    && Array.isArray(data.columns) && data.columns.length == 2
}

export default function FileImportModal(modal: ModalProps) {

  const [fileSelected, setFileSelected] = useState(false)
  const [invs, setInvs] = useState<ImportedInventory[]>([])

  const { inventories, saveInventories } = useInventories();

  useEffect(() => {
    setFileSelected(false)
    setInvs([])
  }, [modal.show])

  function readFile(files: FileList | null) {
    if (files === null) return;
    const readAll = Promise.all<ImportedInventory>([...files].map(file => {
      return new Promise((resolve) => {
        const reader = new FileReader()
        reader.onload = () => {
          try {
            const data = JSON.parse(reader.result as string)
            resolve({ ...data, file: file.name, valid: isValidInventory(data) })
          } catch (err) {
            console.error(err);
            resolve({ file: file.name, valid: false })
          }
        }
        reader.readAsText(file)
      })
    }))

    readAll.then(invs => {
      setFileSelected(true)
      setInvs(invs)
    })
  }

  function addInventories() {
    inventories.push(...invs
      .filter(inv => inv.valid)
      .map(({ valid, file, ...inv }) => inv)
    )
    saveInventories()
    modal.close()
  }

  return (
    <Modal {...modal}>
      <Modal.Heading>Import Inventory</Modal.Heading>

      <div className="mb-2 relative">
        <IoPushOutline className="absolute top-2 left-2 text-zinc-300" size={20} />
        <input type="file" onChange={e => readFile(e.target.files)} className="w-full bg-zinc-950 text-zinc-400 pr-3 max-w-96 rounded-md cursor-pointer file:bg-zinc-800 file:text-zinc-300 file:font-semibold hover:file:bg-zinc-700 file:transition-colors file:py-1 file:px-2 file:pl-10 file:mr-3" />
      </div>

      {!fileSelected
        ? <p>Select a file to import.</p>
        : invs.map((inv, i) => (
          <div key={i} className="bg-zinc-950 p-2 rounded-md mt-2">
            {inv.valid
              ? <div className="flex justify-between text-zinc-400">
                  <div><span className="font-bold text-zinc-300">Name:</span> {inv.name}</div>
                  <div><span className="font-bold text-zinc-300">Str:</span> {inv.strengthScore}</div>
                  <div><span className="font-bold text-zinc-300">Containers:</span> {inv.columns.flat().length}</div>
                </div>
              : <p className="text-rose-900">Invalid.</p>
            }
            <div className="text-sm italic text-zinc-500 text-right">{inv.file}</div>
          </div>
        ))
      }

      <div className="flex justify-end gap-2 mt-4">
        <button onClick={modal.close} className="bg-zinc-800 rounded px-4 py-1 font-bold hover:bg-zinc-700 cursor-pointer transition-colors">Cancel</button>
        <button onClick={addInventories} disabled={!fileSelected || invs.length === 0} className="bg-teal-950 rounded px-4 py-1 font-bold hover:bg-teal-900 cursor-pointer transition-colors disabled:bg-zinc-700 disabled:text-zinc-400 disabled:cursor-not-allowed">Add</button>
      </div>
    </Modal>
  )
}
