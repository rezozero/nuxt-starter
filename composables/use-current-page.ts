import type { Page } from '~/composables/use-page'

export function useCurrentPage() {
    return useState<Page>('currentPage', () => ({}))
}
