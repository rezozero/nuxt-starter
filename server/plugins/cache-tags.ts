export default defineNitroPlugin((nitroApp) => {
    nitroApp.hooks.hook('render:response', (_response, { event }) => {
        if (event.context?.cacheTags) {
            const headerName = useRuntimeConfig().public.cacheTags?.key

            if (typeof headerName === 'string') setResponseHeader(event, headerName, event.context.cacheTags)
        }
    })
})
