// commonContent and currentPage need to be set before calling this composable

export function useRoadizPageTitle(title?: MaybeRefOrGetter<string>) {
    const commonContent = useCommonContent()
    const siteName = computed(() => commonContent.data.value?.head?.siteName || useRuntimeConfig().public.site.name)

    const { searchParamsLabel } = useCurrentPageSearchParams()

    function getPageTitle(title: string | undefined) {
        if (!title) {
            return siteName.value || null
        }

        const firstPart = [title, searchParamsLabel.value].filter(s => !!s).join(', ')

        if (!siteName.value || title.trim() === siteName.value.trim()) {
            return firstPart
        }

        return `${firstPart} — ${siteName.value}`
    }

    return {
        getPageTitle,
        plainTitle: computed(() => getPageTitle(toValue(title))),
    }
}
