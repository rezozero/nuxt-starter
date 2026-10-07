// commonContent and currentPage need to be set before calling this composable

interface UsePageTitleOptions {
    title?: MaybeRefOrGetter<string | undefined>
    siteName?: MaybeRefOrGetter<string | undefined>
}

export function usePageTitle(options: UsePageTitleOptions = {}) {
    const runtimeConfig = useRuntimeConfig()
    const internalSiteName = computed(() =>
        toValue(options.siteName) || runtimeConfig?.public?.site?.name)

    function getPageTitle(title: string | undefined) {
        if (!title) {
            return internalSiteName.value
        }

        if (!internalSiteName.value) {
            return title
        }

        return `${title} — ${internalSiteName.value}`
    }

    return {
        getPageTitle,
        plainTitle: computed(() => getPageTitle(toValue(options.title))),
    }
}
