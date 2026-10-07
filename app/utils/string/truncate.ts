const ELLIPSIS = '…'

export function truncate(text: string, maxLength: number, ellipsis = ELLIPSIS): string {
    const trimmed = text.trim()

    if (trimmed.length <= maxLength) {
        return trimmed
    }

    const cutoff = maxLength - ellipsis.length
    if (cutoff <= 0) {
        return trimmed.slice(0, maxLength)
    }

    const truncated = trimmed.slice(0, cutoff)
    const nextChar = trimmed[cutoff]
    const isWordBoundary = nextChar === undefined || /\s/.test(nextChar)

    let wordSafe = truncated
    if (!isWordBoundary) {
        const lastSpaceIndex = truncated.lastIndexOf(' ')
        wordSafe = lastSpaceIndex > 0 ? truncated.slice(0, lastSpaceIndex) : truncated
    }

    return wordSafe.replace(/[\s,.;:!?-]+$/, '') + ellipsis
}
