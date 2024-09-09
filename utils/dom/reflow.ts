export function reflow(element: HTMLElement) {
    element.style.display = 'none'
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    element.offsetHeight
    element.style.display = ''
}
