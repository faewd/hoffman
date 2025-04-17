import { gql, useQuery } from "@apollo/client";
import { ModalProps } from "../hooks/useModal";
import Modal from "./Modal";
import { Item as ApiItem } from "../api/types";
import { IoAddSharp, IoSearchSharp } from "react-icons/io5";
import { ItemStack } from "../types";
import { calculateCoinValue } from "../util";
import { Button } from "./Button";
import { useEffect, useState } from "react";


type GetItemsResult = {
  items: Array<ApiItem>
}

const GET_ITEMS = gql`

  fragment ItemData on Item {
    kind
    id
    name
    weight
    cost {
      currency
      amount
    }
  }

  query GetItems {
    items {
      ...ItemData
      ... on PackItem {
        contents {
          quantity
          item {
            ...ItemData
          }
        }
      }
      ... on StackItem {
        quantity
        item {
          ...ItemData
        }
      }
    }
  }
`

type SearchItemModalProps = ModalProps & {
  addItems: (stacks: ItemStack[]) => void
}

function apiItemToStacks(item: ApiItem): ItemStack[] {
  if (item.kind === "pack") {
    return item.contents.flatMap(packItem => {
      const stacks = apiItemToStacks(packItem.item)
      return stacks.map(stack => ({ ...stack, quantity: packItem.quantity * stack.quantity }))
    })
  }

  if (item.kind === "stack") {
    return apiItemToStacks(item.item).map(stack => ({ ...stack, quantity: item.quantity * stack.quantity }))
  }

  return [{
    quantity: 1,
    equipped: false,
    item: {
      name: item.name,
      weight: item.weight,
      value: calculateCoinValue(item.cost.currency, item.cost.amount),
      slotOverride: null,
      equippedSlots: 0
    }
  }]
}

export default function SearchItemModal({ addItems, ...modal }: SearchItemModalProps) {

  const { loading, error, data } = useQuery<GetItemsResult>(GET_ITEMS)
  const [searchQuery, setSearchQuery] = useState("")
  const [items, setItems] = useState<ApiItem[]>([])

  useEffect(() => {
    if (data === undefined) return;
    const q = searchQuery.trim().toUpperCase()
    if (q.length === 0) setItems(data.items)
    else setItems(data.items.filter(item => item.name.toUpperCase().includes(q)))
  }, [data, searchQuery])

  function handleAddItem(item: ApiItem) {
    const stacks = apiItemToStacks(item)
    addItems(stacks)
  }

  return (
    <Modal {...modal}>
      <Modal.Heading>Find Item</Modal.Heading>
      { loading ? <p>Loading...</p>
        : error ? <p>Error: {error.message}</p>
        : data === undefined ? <p>No data found.</p>
        : (
          <>
            <div className="px-4 mb-4 relative">
              <IoSearchSharp className="absolute left-6 h-full text-teal-800" size="20" />
              <input type="text" value={searchQuery} onChange={e => setSearchQuery(e.currentTarget.value)} className="rounded-md bg-zinc-950 w-full py-1 ps-9" placeholder="Search..." />
            </div>
            <div className="max-h-64 w-96 overflow-x-hidden overflow-y-auto px-3">
              <div className="grid grid-cols-[1fr_repeat(3,max-content)] gap-y-1 px-1">
                {items.map(item => (
                  <button className="contents group/item text-left cursor-pointer" onClick={() => handleAddItem(item)}>
                    <div className="rounded-l-md ps-2 py-1 bg-zinc-950 group-hover/item:bg-zinc-800 transition-colors font-semibold">{item.name}</div>
                    <div className="text-right px-2 py-1 bg-zinc-950 group-hover/item:bg-zinc-800 transition-colors">
                      {item.cost.amount}
                      <span className="text-sm text-zinc-500 ml-px">{item.cost.currency}</span>
                    </div>
                    <div className="text-right bg-zinc-950 rounded-r-md pr-2 py-1 bg-zinc-950 group-hover/item:bg-zinc-800 transition-colors">
                      {item.weight}
                      <span className="text-sm text-zinc-500 ml-px">lb</span>
                    </div>
                    <div className="bg-teal-950 hover:bg-teal-900 transition-colors p-0 px-1 ml-1 rounded-md flex items-center justify-center"><IoAddSharp size={24} /></div>
                  </button>
                ))}
              </div>
            </div>
          </>
        )
      }
      <div className="mt-4 flex justify-end gap-2">
        <Button onClick={modal.close} className="bg-zinc-800 hover:bg-zinc-700">Cancel</Button>
      </div>
    </Modal>
  )
}
