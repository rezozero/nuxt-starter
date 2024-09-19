import type { RequestHandler } from 'msw'

export function useMockRequest(...handlers: RequestHandler[]) {
    const { $msw } = useNuxtApp()

    $msw?.use(...handlers)

    const router = useRouter()
    const unwatchRouter = router.beforeEach(() => {
        // maybe other handlers have been added in the meantime, then we filter them out
        const newHandlers = $msw?.listHandlers().filter(handler => !handlers.includes(handler))

        if (newHandlers) $msw?.resetHandlers(...newHandlers)

        unwatchRouter()
    })
}
