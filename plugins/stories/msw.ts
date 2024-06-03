export default defineNuxtPlugin(async () => {
    let msw

    if (import.meta.server) {
        const { server } = await import('assets/stories/mocks/node')

        server.listen({
            onUnhandledRequest: 'bypass',
        })

        msw = server
    } else if (import.meta.client) {
        const { worker } = await import('assets/stories/mocks/browser')

        worker.start({
            quiet: true,
            onUnhandledRequest: 'bypass',
        })

        msw = worker
    }

    return {
        provide: {
            msw,
        },
    }
})
