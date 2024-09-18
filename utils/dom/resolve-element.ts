// @see https://github.com/vueuse/vueuse/blob/8ba4df8b6a343945681083cd0a0687135213fc1e/packages/core/_resolve-element.ts#L4
export function resolveElement(
    el: HTMLElement | SVGElement | Window | Document | null | undefined,
): HTMLElement | SVGElement | null | undefined {
    if (typeof Window !== 'undefined' && el instanceof Window) return el.document.documentElement

    if (typeof Document !== 'undefined' && el instanceof Document) return el.documentElement

    return el as HTMLElement | SVGElement | null | undefined
}
