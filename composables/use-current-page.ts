import type { Page } from '~/composables/use-page'

export function useCurrentPage(page?: Page) {
    const currentPage = useState<Page>('currentPage', () => ({}))

    if (page) currentPage.value = page

    return currentPage
}
