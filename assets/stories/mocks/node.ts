import { setupServer } from 'msw/node'

// Provide the server-side API with the request handlers.
export const server = setupServer()
