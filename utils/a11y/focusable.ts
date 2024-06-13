// @see https://github.com/vue-a11y/vue-focus-loop/blob/master/src/FocusLoop.vue
// Should we use a more complete and complex solution like here https://allyjs.io/api/query/focusable.html ?
const focusableElementsSelector = [
    ...['input', 'select', 'button', 'textarea'].map(field => `${field}:not([disabled]):not([tabindex^="-"])`),
    'a[href]:not([tabindex^="-"]',
    'video[controls]:not([tabindex^="-"]',
    'audio[controls]:not([tabindex^="-"]',
    '[tabindex]:not([tabindex^="-"])',
    '[contenteditable]:not([contenteditable="false"])',
].join(',')

function getParentNode(root?: Element | string): ParentNode {
    const rootElement = typeof root === 'string' ? document.querySelector(root) : root

    return rootElement || document
}

export function getAllFocusableElements(root?: Element | string): NodeListOf<Element> {
    return getParentNode(root).querySelectorAll(focusableElementsSelector)
}

export function getFirstFocusableElement(root?: Element | string): Element | null {
    return getParentNode(root).querySelector(focusableElementsSelector)
}

export function focusFirstElement(root?: Element | string) {
    ;(getFirstFocusableElement(root) as HTMLElement)?.focus?.()
}
