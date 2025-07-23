import { slugify } from '~/utils/string/slugify'
import { generateHashFromObject } from '~/utils/string/generate-hash-from-object'

interface UseListOptions {
    url?: MaybeRef<string>
    params?: MaybeRef<Record<string, unknown>>
}

export function useList(options: UseListOptions) {
    const itemBaseId = computed(() => {
        const parts: string[] = []

        if (options.url) {
            parts.push(slugify(toValue(options.url)))
        }

        if (options.params) {
            parts.push(generateHashFromObject(toValue(options.params)))
        }

        return parts.length ? parts.join('-') : 'default'
    })

    return { itemBaseId }
}
