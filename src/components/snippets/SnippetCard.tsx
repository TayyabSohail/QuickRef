import { Button } from '@/components/ui/button'

export default function SnippetCard({ snippet, onView }: any) {
  return (
    <div className="border rounded-lg p-4 space-y-2">
      <h3 className="text-lg font-bold">{snippet.title}</h3>
      <p className="text-sm text-muted-foreground">Lang: {snippet.language} • {snippet.username}</p>
      <p className="text-xs text-muted-foreground">{snippet.description}</p>
      <Button onClick={() => onView(snippet)}>View</Button>
    </div>
  )
}