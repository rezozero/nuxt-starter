import type { RouteLocationRaw } from 'vue-router'

export type PossibleRoute = undefined | null | RouteLocationRaw | string

export function useRouteHref(route: PossibleRoute) {
    const router = useRouter()

    const url = computed(() => {
        if (!route) return
        else if (typeof route === 'object' && 'name' in route)
            return router.hasRoute(route.name as string) ? router.resolve(route)?.fullPath : undefined
        else if (typeof route === 'object') return router.resolve(route)?.fullPath
        else return route
    })

    const siteUrl = useRuntimeConfig().public?.site.url
    const includeSiteUrl = computed(() => siteUrl && url.value?.startsWith(siteUrl))

    const isRelative = computed(() => {
        const firstChar = url.value?.charAt(0)
        if (!firstChar) return

        return firstChar === '/' || firstChar === '#'
    })

    const isExternal = computed(() => !!url.value?.startsWith('http'))

    // If absolute url include site url format href as relative link
    const href = computed(() => {
        if (isExternal.value && includeSiteUrl.value) return url.value?.replace(siteUrl, '')

        return url.value
    })

    return { isRelative, isExternal, href }
}
