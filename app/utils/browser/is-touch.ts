export const isTouchDevice = (): boolean => {
    if (typeof window === 'undefined') return false

    const hasCoarse = window.matchMedia('(pointer: coarse)').matches
    if (hasCoarse) return true

    // prioritize mouse control
    const hasPointer = window.matchMedia('(pointer: fine)').matches
    if (hasPointer) return false

    // Otherwise, fall-back to older style mechanisms
    return 'ontouchstart' in window || navigator.maxTouchPoints > 0
}
