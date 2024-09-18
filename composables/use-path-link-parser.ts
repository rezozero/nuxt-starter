import type { LocationAsRelativeRaw, _RouteRecordBase } from 'vue-router'

export type PossibleRoutePath = string | undefined | null | LocationAsRelativeRaw | _RouteRecordBase

export function usePathLinkParser(path: PossibleRoutePath) {
    const siteUrl = useRuntimeConfig().public?.site.url
    const router = useRouter()

    const url = computed(() => {
        if (!path) return
        else if (typeof path === 'object' && 'name' in path)
            return router.hasRoute(path.name as string) ? router.resolve(path)?.fullPath : undefined
        else if (typeof path === 'object') return router.resolve(path)?.fullPath
        else return path
    })

    const isRelative = computed(() => {
        const firstChar = toValue(url)?.charAt(0)
        if (!firstChar) return

        return firstChar === '/' || firstChar === '#' || (siteUrl && toValue(url)?.startsWith(siteUrl))
    })

    const isExternal = computed(() => !isRelative.value && toValue(url))

    return { isRelative, isExternal, url }
}
