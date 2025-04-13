import { useEffect, useState } from "react";
import { ModalProps } from "../hooks/useModal";
import Modal from "./Modal";
import { Inventory } from "../types";
import { useInventories } from "../hooks/useInventories";

type UploadedInventory = 
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

export default function FileUploadModal(modal: ModalProps) {

  const [fileSelected, setFileSelected] = useState(false)
  const [invs, setInvs] = useState<UploadedInventory[]>([])

  const { inventories, saveInventories } = useInventories();

  useEffect(() => {
    setFileSelected(false)
    setInvs([])
  }, [modal.show])

  function readFile(files: FileList | null) {
    if (files === null) return;
    const readAll = Promise.all<UploadedInventory>([...files].map(file => {
      console.log(file.name)
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
      <Modal.Heading>Upload Inventory from JSON</Modal.Heading>
      <input type="file" onChange={e => readFile(e.target.files)} className="mb-2" />

      {!fileSelected
        ? <p>Select a file to upload.</p>
        : invs.map((inv, i) => (
          <div key={i} className="bg-zinc-950 p-2 rounded-md mt-2">
            {inv.valid
              ? <div className="flex justify-between text">
                  <div><span className="font-bold">Name:</span> {inv.name}</div>
                  <div><span className="font-bold">Str:</span> {inv.strengthScore}</div>
                  <div><span className="font-bold">Containers:</span> {inv.columns.flat().length}</div>
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
