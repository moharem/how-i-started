import type { ReactNode } from 'react'

/**
 * One labeled value in a grid of key numbers (inside a <dl>). `wide` takes the full row
 * of a two-column grid.
 */
export function Fact({
  label,
  wide,
  children,
}: {
  label: string
  wide?: boolean
  children: ReactNode
}) {
  return (
    <div className={`rounded-xl bg-paper p-2 ${wide ? 'col-span-2' : ''}`}>
      <dt className="text-ink/60">{label}</dt>
      <dd className="font-semibold">{children}</dd>
    </div>
  )
}
