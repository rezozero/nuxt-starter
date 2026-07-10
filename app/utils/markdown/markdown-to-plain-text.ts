import { marked } from 'marked'

const HTML_ENTITIES: Record<string, string> = {
    'amp': '&',
    'lt': '<',
    'gt': '>',
    'quot': '"',
    '#39': '\'',
    'nbsp': ' ',
}

function decodeHtmlEntities(value: string): string {
    return value.replace(/&(#\d+|[a-z]+);/gi, (match, entity: string) => {
        if (entity[0] === '#') {
            const code = Number.parseInt(entity.slice(1), 10)
            return Number.isNaN(code) ? match : String.fromCodePoint(code)
        }
        return HTML_ENTITIES[entity.toLowerCase()] ?? match
    })
}

// render the markdown to HTML then
// strip tags/entities so structured data doesn't leak raw markdown syntax.
export function markdownToPlainText(content: string | undefined | null): string | undefined {
    if (!content) return undefined

    const html = marked.parse(content, { async: false }) as string
    const text = decodeHtmlEntities(html.replace(/<[^>]*>/g, ' '))
        .replace(/\s+/g, ' ')
        .trim()

    return text || undefined
}
