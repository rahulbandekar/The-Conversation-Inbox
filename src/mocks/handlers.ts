import { http, HttpResponse, delay } from 'msw'
import { mockConversations } from './data'
import type { Conversation } from '../types'

let conversations: Conversation[] = [...mockConversations]

const randomDelay = () => delay(Math.floor(Math.random() * 300) + 200)

const shouldFail = () => Math.random() < 0.2

export const handlers = [
  // GET all conversations
  http.get('/api/conversations', async () => {
    await randomDelay()
    return HttpResponse.json(conversations)
  }),

  // POST assign conversation to current agent
  http.post('/api/conversations/:id/assign', async ({ params }) => {
    await randomDelay()

    if (shouldFail()) {
      return HttpResponse.json(
        { error: 'Failed to assign conversation. Please try again.' },
        { status: 500 }
      )
    }

    const id = params['id']
    conversations = conversations.map((c) =>
      c.id === id
        ? { ...c, assignedTo: 'You', status: 'open', updatedAt: new Date().toISOString() }
        : c
    )

    const updated = conversations.find((c) => c.id === id)
    return HttpResponse.json(updated)
  }),

  // POST resolve conversation
  http.post('/api/conversations/:id/resolve', async ({ params }) => {
    await randomDelay()

    if (shouldFail()) {
      return HttpResponse.json(
        { error: 'Failed to resolve conversation. Please try again.' },
        { status: 500 }
      )
    }

    const id = params['id']
    conversations = conversations.map((c) =>
      c.id === id
        ? { ...c, status: 'resolved', updatedAt: new Date().toISOString() }
        : c
    )

    const updated = conversations.find((c) => c.id === id)
    return HttpResponse.json(updated)
  }),
]