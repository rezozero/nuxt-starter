export function reflow(element: HTMLElement) {
    element.style.display = 'none'
    element.offsetHeight
    element.style.display = ''
}
