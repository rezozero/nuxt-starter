export default defineNuxtPlugin(async () => {
    let msw

    if (import.meta.server) {
        // TODO resolve : Cannot find module 'assets/stories/mocks/node' or its corresponding type declarations.
        const { server } = await import('assets/stories/mocks/node')

        server.listen({
            onUnhandledRequest: 'bypass',
        })

        msw = server
    }
    else if (import.meta.client) {
        // TODO resolve : Cannot find module 'assets/stories/mocks/browser' or its corresponding type declarations.
        const { worker } = await import('assets/stories/mocks/browser')

        await worker.start({
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
