import type { ImageOptions } from '@nuxt/image'
import type { RoadizDocument } from '@roadiz/types'

export function useRoadizResolvedImage() {
    const img = useImage()
    const nuxtApp = useNuxtApp()

    async function resolveImageUrl(
        document: RoadizDocument | null | undefined,
        modifiers: Parameters<typeof img>[1] = {},
    ): Promise<string | undefined> {
        if (!document?.relativePath) return undefined

        // On the server, nuxtApp.runWithContext() always wraps its callback's return value in a
        // Promise (unctx's callAsync is declared `async`), even though this callback is synchronous.
        // Without awaiting it, the unresolved Promise ends up as the image `url`, which renders as
        // "[object Promise]" (or `{}` after JSON.stringify) instead of the actual URL.
        return await nuxtApp.runWithContext(() =>
            img(document.relativePath!, modifiers, { provider: 'interventionRequest' } as unknown as ImageOptions)) as string | undefined
    }

    return { resolveImageUrl }
}
