import type { RoadizDocument } from '@roadiz/types'

export function useMediaViewer() {
    const documents = useState<RoadizDocument[] | null>('mediaViewerDocuments', () => null)
    const slideIndex = useState<number>('mediaViewerIndex')
    const isOpen = computed(() => !!documents.value)

    const open = (medias: RoadizDocument[], index?: number) => {
        documents.value = medias
        slideIndex.value = index ? index : 0
        // updateIndex(index || 0)
    }
    const close = () => (documents.value = null)

    const previousSlide = () => slideIndex.value = Math.max(slideIndex.value - 1, 0)
    const nextSlide = () => slideIndex.value = Math.min(slideIndex.value + 1, (documents.value?.length || 1) - 1)

    return { documents, slideIndex, isOpen, open, close, nextSlide, previousSlide }
}
