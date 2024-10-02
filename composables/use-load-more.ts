import type { HydraCollection, RoadizNodesSources, RoadizRequestParams } from '@roadiz/types'
import { isNavigationFailure, NavigationFailureType } from 'vue-router'
import type { Ref, ShallowRef } from 'vue'
import { hash } from 'ohash'
import { encodeUrlParams } from '~/utils/url'

export type UseLoadMoreOptions<ParamsT> = {
    url: string
    element: Ref<HTMLElement | undefined>
    params?: Ref<ParamsT> | ParamsT
}

const ITEMS_PER_PAGE = 12

type CacheTagsContainer<T> = T & { cacheTags?: string }

export function useLoadMore<
    ItemT extends RoadizNodesSources = RoadizNodesSources,
    ParamsT extends RoadizRequestParams = RoadizRequestParams,
>(options: UseLoadMoreOptions<ParamsT>) {
    const itemsPerPage = computed(() => toValue(options.params)?.itemsPerPage || ITEMS_PER_PAGE)
    const pages = ref<ShallowRef<HydraCollection<ItemT> | null>[]>([])
    const lastPageIndex = computed(() => Math.max(pages.value.length - 1, 0))
    const lastPage = computed(() => pages.value[lastPageIndex.value]?.value)

    const isPending = computed(() => lastPage.value === null)

    // ITEMS
    const items = computed(() => {
        const result: (ItemT | null)[] = []
        // if the last page is pending, don't show it, except if it's the only page
        const filteredPages = isPending.value && pages.value.length > 1 ? pages.value.slice(0, -1) : pages.value

        for (let i = 0, n = filteredPages.length; i < n; i++) {
            const page = filteredPages[i]?.value

            if (page?.['hydra:member']) {
                result.push(...page['hydra:member'])
            }
            else {
                result.push(...Array.from<null>({ length: itemsPerPage.value }).fill(null))
            }
        }

        return result
    })
    const totalItems = computed(() => {
        // Get the first totalItems from the last page.
        // During loading, the last page is null, so we need to go back in time.
        for (let i = pages.value.length - 1; i >= 0; i--) {
            const pageTotalItems = pages.value[i]?.value?.['hydra:totalItems']

            if (pageTotalItems) {
                return pageTotalItems
            }
        }

        return 0
    })
    const hasMoreItems = computed(() => totalItems.value && items.value.length < totalItems.value)

    watch(items, () => {
        if (import.meta.client && page.value > 1 && window.scrollY === 0) {
            scrollToCurrentPage()
        }
    })

    // PAGINATION
    const router = useRouter()
    const route = useRoute()
    const page = computed({
        get(): number {
            return parseFloat((route.query.page as string | null) || '') || toValue(options.params)?.page || 1
        },
        set(value: number) {
            router
                .replace({
                    path: route.path,
                    query: { ...route.query, page: value > 1 ? value.toString() : undefined },
                })
                .catch((error) => {
                    if (
                        !isNavigationFailure(error, NavigationFailureType.duplicated)
                        && !isNavigationFailure(error, NavigationFailureType.cancelled)
                    ) {
                        throw new Error(error)
                    }
                })
        },
    })

    // When the page changes, load the page.
    watch(page, () => {
        loadPage(page.value)
    })

    if (isRef(options.params)) {
        watch(options.params, (current, old) => {
            if (JSON.stringify(current) === JSON.stringify(old)) {
                return
            }

            pages.value = []
            loadPage(page.value)
        })
    }

    // LOAD PAGE
    const roadizFetch = useRoadizFetchFactory()

    async function loadPage(pageIndex: number) {
        if (pages.value[pageIndex - 1]) {
            return
        }

        const params = {
            ...toValue(options.params),
            page: pageIndex,
            itemsPerPage: itemsPerPage.value,
        }
        const key = hash(options.url + encodeUrlParams(params))
        const pageData = shallowRef<HydraCollection<ItemT> | null>(null)
        const newPages = pages.value?.slice()

        newPages[pageIndex - 1] = pageData
        pages.value = newPages

        if (import.meta.server) {
            const nuxtApp = useNuxtApp()
            const cacheTagsKey = useRuntimeConfig().public.cacheTags?.key
            const { data } = await useRoadizFetch<CacheTagsContainer<HydraCollection<ItemT>>, unknown>(options.url, {
                params,
                key,
                deep: false,
                onResponse({ response }) {
                    if (cacheTagsKey) {
                        // temp assign cacheTags to response._data for useCacheTags()
                        response._data.cacheTags = response.headers.get(cacheTagsKey)
                    }
                },
            })

            // keep Nuxt context for useCacheTags()
            nuxtApp.runWithContext(() => {
                useCacheTags(data.value?.cacheTags)
                delete data.value?.cacheTags // remove the temp cacheTags property
            })

            pageData.value = data.value
        }
        else {
            const { data } = useNuxtData<HydraCollection<ItemT>>(key)

            pageData.value
                = data.value
                || (await roadizFetch<HydraCollection<ItemT>>(options.url, {
                    params,
                }))
        }
    }

    let scrollDirection = 1
    let storedScrollY = 0
    const itemElements = ref<HTMLElement[]>([])

    onMounted(() => {
        storedScrollY = window.scrollY

        updateItemElements()

        if (page.value > 1 && window.scrollY === 0) {
            scrollToCurrentPage()
        }

        useMutationObserver(options.element, updateItemElements, { childList: true })

        useIntersectionObserver(itemElements, onIntersectionObserverChange, {
            threshold: Array(5)
                .fill(0)
                .map((_value, index) => (1 / 4) * index),
        })
    })

    function onIntersectionObserverChange(entries: IntersectionObserverEntry[]) {
        const scrollY = window.scrollY

        scrollDirection = scrollY === storedScrollY ? scrollDirection : scrollY < storedScrollY ? -1 : 1
        storedScrollY = scrollY

        entries.forEach((entry) => {
            if (!entry.isIntersecting) return

            const index = itemElements.value.indexOf(entry.target as HTMLElement)
            const itemPage = Math.ceil((index + 1) / itemsPerPage.value)

            loadPage(itemPage)

            if (
                (itemPage < page.value && scrollDirection === -1 && entry.intersectionRatio < 0.5)
                || (itemPage > page.value && scrollDirection === 1 && entry.intersectionRatio > 0.5)
            ) {
                page.value = itemPage
            }
        })
    }

    function updateItemElements() {
        itemElements.value = [...(options.element.value?.children || [])] as HTMLElement[]
    }

    function scrollToCurrentPage() {
        const element = itemElements.value[(page.value - 1) * itemsPerPage.value]

        if (!element) return

        element.scrollIntoView()
    }

    return { items, page, hasMoreItems, loadPage, isPending, totalItems }
}
