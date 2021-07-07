import { RootState } from '~/types/store'

export default (): RootState => ({
    firstPageData: null,
    firstPageError: null,
    nextPageData: null,
    previousPageData: null,
    headData: null,
    mainMenuData: null,
    alternateUrls: '',
    windowWidth: 0,
    windowHeight: 0,
})
