export function useRelativeLinks(target: MaybeRef<HTMLElement | null | undefined>) {
    function onLinkClick(event: MouseEvent) {
        const link = event.currentTarget as HTMLLinkElement

        if (event.metaKey || event.ctrlKey || event.shiftKey) return

        if (event.defaultPrevented) return

        // target blank
        if (link.target === '_blank') return

        // download link or external
        if (link.hasAttribute('download')) return

        const href = link.getAttribute('href')
        if (!href) return

        // mailto
        if (href.startsWith('mailto:')) return

        // anchor
        if (href.startsWith('#')) return

        // not relative or absolute URL without protocol
        if (!href.startsWith('/') || href.startsWith('//')) return

        event.preventDefault()

        useRouter().push(href)
    }

    onMounted(() => {
        toValue(target)?.querySelectorAll?.('a').forEach(link => link.addEventListener('click', onLinkClick))
    })

    onBeforeUnmount(() => {
        toValue(target)?.querySelectorAll?.('a').forEach(link => link.removeEventListener('click', onLinkClick))
    })
}
