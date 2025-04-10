type StatProps = {
  name: string,
  value: string | number,
  unit?: string
}

export default function Stat({ name, value, unit }: StatProps) {
  return (
    <div className="h-full flex flex-col">
      <div className="rounded-t-lg bg-zinc-950 text-3xl p-2 text-zinc-400 flex-grow flex items-center justify-center">
        <div>
          {value}{unit && <span className="text-zinc-600 font-semibold text-xl ml-[2px]">{unit}</span>}
        </div>
      </div>
      <div className="rounded-b-lg bg-zinc-950 text-center text-lg font-bold py-1 px-4 leading-none flex items-center justify-center h-12">
        <span>{name}</span>
      </div>
    </div>
  )
}

type SplitStatProps = {
  name: string
  top: string | number
  bottom: string | number
  unit?: string
}

export function SplitStat({ name, top, bottom, unit }: SplitStatProps) {
  return (
    <div className="h-full flex flex-col">
      <div className="rounded-t-lg bg-zinc-950 text-3xl text-center p-2 px-4 text-zinc-400 flex flex-col items-center lg:flex-row justify-center">
        <div className="border-b-2 border-zinc-800 p-2 lg:border-none">{top}{unit && <span className="text-zinc-600 text-xl font-semibold ml-[2px]">{unit}</span>}</div>
        <div className="hidden lg:block mr-2 pt-1 text-4xl text-zinc-600">/</div>
        <div>{bottom}{unit && <span className="text-zinc-600 text-xl font-semibold ml-[2px]">{unit}</span>}</div>
      </div>
      <div className="rounded-b-lg bg-zinc-950 text-lg text-center font-bold py-1 px-4 leading-none flex items-center justify-center h-12">
        <span>{name}</span>
      </div>
    </div>
  )
}
