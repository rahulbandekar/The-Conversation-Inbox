import { useState, useEffect } from 'react'
import type { Conversation } from '../types'

interface UseConversationsResult {
  conversations: Conversation[]
  loading: boolean
  error: string | null
  refetch: () => void
}

export function useConversations(): UseConversationsResult {
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [fetchIndex, setFetchIndex] = useState(0)

  useEffect(() => {
    let cancelled = false

    async function fetchConversations() {
      setLoading(true)
      setError(null)

      try {
        const res = await fetch('/api/conversations')

        if (!res.ok) {
          throw new Error(`Server error: ${res.status}`)
        }

        const data: Conversation[] = await res.json() as Conversation[]

        if (!cancelled) {
          setConversations(data)
        }
      } catch (err) {
        if (!cancelled) {
          setError('Failed to load conversations. Please try again.')
        }
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    void fetchConversations()

    return () => {
      cancelled = true
    }
  }, [fetchIndex])

  const refetch = () => setFetchIndex((i) => i + 1)

  return { conversations, loading, error, refetch }
}