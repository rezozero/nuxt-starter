export function useBodyScrollLock() {
    const disableBodyScroll = () => {
        document.body.style = `--body-padding-right: ${window.innerWidth - document.documentElement.clientWidth}px`
        document.body.classList.add('scroll--disabled')
    }
    const enableBodyScroll = () => document.body.classList.remove('scroll--disabled')

    return { disableBodyScroll, enableBodyScroll }
}
