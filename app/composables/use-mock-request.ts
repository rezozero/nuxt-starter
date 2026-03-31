import type { RequestHandler } from 'msw'

export function useMockRequest(...handlers: RequestHandler[]) {
    const { $msw } = useNuxtApp()

    // TODO resolve : Property 'use' does not exist on type '{}'.
    $msw?.use(...handlers)

    const router = useRouter()
    const unwatchRouter = router.beforeEach((to, from) => {
        if (to.path == from.path) {
            // the route is the same, we don't want to reset the handlers
            return
        }

        $msw?.resetHandlers(...handlers)
        // maybe other handlers have been added in the meantime, then we filter them out
        const newHandlers = $msw?.listHandlers().filter((handler: RequestHandler) => !handlers.includes(handler))

        if (newHandlers) $msw?.resetHandlers(...newHandlers)

        unwatchRouter()
    })
}
