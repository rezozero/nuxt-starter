import { RootState } from '~/types/store'

export default (): RootState => ({
    firstPageData: null,
    firstPageError: null,
    nextPageData: null,
    previousPageData: null,
    commonContent: null,
    alternateLinks: [],
    windowWidth: 0,
    windowHeight: 0,
    prefersReducedMotion: false,
    scrollIsDisabled: false,
})
