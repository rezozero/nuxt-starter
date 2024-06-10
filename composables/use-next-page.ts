import type { Page } from '~/composables/use-page'

export function useNextPage() {
    return useState<Page>('nextPage', () => ({}))
}
