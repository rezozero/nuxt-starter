export function useRoadizSiteName() {
    const commonContent = useCommonContent()

    return computed(() => commonContent.data.value?.head?.siteName || undefined)
}
