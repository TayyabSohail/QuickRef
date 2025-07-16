'use client'
import { useQuery } from '@tanstack/react-query'
import { getSnippets } from '@/actions/snippet'
import SnippetCard from './SnippetCard'
import SnippetModal from './SnippetModal'
import { useState } from 'react'

export default function SnippetList() {
  const { data = [] } = useQuery({ queryKey: ['snippets'], queryFn: getSnippets })
  const [selected, setSelected] = useState<any>(null)

  return (
    <div className="grid gap-4">
      {data.map((snippet) => (
        <SnippetCard key={snippet.id} snippet={snippet} onView={setSelected} />
      ))}
      {selected && <SnippetModal snippet={selected} onClose={() => setSelected(null)} />}
    </div>
  )
}