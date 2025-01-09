import type { RoadizDocument } from '@roadiz/types'

export function useMediaViewer() {
    const documents = useState<RoadizDocument[] | null>('mediaViewerDocuments', () => null)
    const selectedIndex = useState<number>('mediaViewerIndex')
    const isOpen = computed(() => !!documents.value)

    const open = (medias: RoadizDocument[], index?: number) => {
        documents.value = medias
        updateIndex(index || 0)
    }
    const close = () => (documents.value = null)

    const updateIndex = (index: number) => (selectedIndex.value = index)
    const previousSlide = () => updateIndex(Math.max(selectedIndex.value - 1, 0))
    const nextSlide = () => updateIndex(Math.min(selectedIndex.value + 1, (documents.value?.length || 1) - 1))

    return { documents, selectedIndex, isOpen, open, close, nextSlide, previousSlide }
}
