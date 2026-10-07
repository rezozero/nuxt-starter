import throttle from 'lodash/throttle'

export function useTopBarScroll(hiddenThresholdDown = 130, hiddenThresholdUp = 30) {
    const { isHidden, isOnPageTop } = useTopBarState()

    let scrollY = 0
    let scrollDirection = 1
    let scrollOffset = 0
    let scrollCallback: null | EventListener = null

    function update() {
        const newScrollY = Math.abs(window.scrollY)
        isOnPageTop.value = newScrollY < hiddenThresholdDown

        const newScrollDirection = newScrollY === scrollY ? scrollDirection : newScrollY >= scrollY ? 1 : -1

        if (newScrollDirection !== scrollDirection) scrollOffset = 0

        // scroll dist from last reset
        scrollOffset += Math.abs(newScrollY - scrollY)
        scrollY = newScrollY
        scrollDirection = newScrollDirection

        const hidden
            = scrollDirection === 1
                ? scrollOffset > hiddenThresholdDown
                : newScrollY > hiddenThresholdDown && scrollOffset < hiddenThresholdUp

        if (hidden !== isHidden.value) isHidden.value = hidden
    }

    onMounted(() => {
        scrollY = window.scrollY
        scrollCallback = throttle(update, 150)

        update()
        window.addEventListener('scroll', scrollCallback, { passive: true })
    })

    onBeforeUnmount(() => {
        if (scrollCallback) window.removeEventListener('scroll', scrollCallback)
    })

    return { isHidden, isOnPageTop }
}
