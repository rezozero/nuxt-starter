import type { MarkedExtension, Renderer, Token, Tokens } from 'marked'
import { Lexer } from 'marked'

// GFM has no caption syntax: contributors write `Tableau : My caption` on the paragraph right before the table,
// or `Tableau masqué : My caption` to keep it for assistive technologies only
const CAPTION_PATTERN = /^\s*Tableau(\s+masqu[ée])?\s*:\s*(\S.*)$/i

interface TableCaption {
    text: string
    hidden: boolean
}

interface TableTokenWithCaption extends Tokens.Table {
    caption?: TableCaption
}

function getCaption(token: Token): TableCaption | undefined {
    if (token.type !== 'paragraph' || token.text.includes('\n')) return

    const match = CAPTION_PATTERN.exec(token.text)
    const text = match?.[2]?.trim()

    if (text) return { text, hidden: !!match?.[1] }
}

// A cell fully wrapped in `**…**` is a header: the <th> carries the emphasis, so the <strong> is dropped
function getStrongContent(cell: Tokens.TableCell): Token[] | undefined {
    const [first] = cell.tokens

    if (cell.tokens.length === 1 && first?.type === 'strong') return (first as Tokens.Strong).tokens
}

function renderCell(
    renderer: Renderer,
    cell: Tokens.TableCell,
    tag: 'th' | 'td',
    scope?: 'col' | 'row',
    tokens = cell.tokens,
): string {
    const scopeAttribute = scope ? ` scope="${scope}"` : ''
    const alignAttribute = cell.align ? ` style="text-align: ${cell.align}"` : ''

    return `<${tag}${scopeAttribute}${alignAttribute}>${renderer.parser.parseInline(tokens)}</${tag}>`
}

function renderRow(renderer: Renderer, row: Tokens.TableCell[]): string {
    const cells = row.map((cell, index) => {
        const strongContent = index === 0 ? getStrongContent(cell) : undefined

        if (strongContent) return renderCell(renderer, cell, 'th', 'row', strongContent)

        return renderCell(renderer, cell, 'td')
    })

    return `<tr>${cells.join('')}</tr>`
}

export const markedTableExtension: MarkedExtension = {
    hooks: {
        processAllTokens(tokens) {
            for (let index = tokens.length - 1; index >= 0; index--) {
                const caption = getCaption(tokens[index]!)

                if (!caption) continue

                let nextIndex = index + 1
                while (tokens[nextIndex]?.type === 'space') nextIndex++

                const table = tokens[nextIndex]
                if (table?.type !== 'table') continue

                ;(table as TableTokenWithCaption).caption = caption
                tokens.splice(index, nextIndex - index)
            }

            return tokens
        },
    },
    renderer: {
        table(token: TableTokenWithCaption) {
            const header = token.header
                .map(cell => renderCell(this, cell, 'th', 'col', getStrongContent(cell)))
                .join('')
            const body = token.rows.map(row => renderRow(this, row)).join('')

            const caption = token.caption
                ? this.parser.parseInline(Lexer.lexInline(token.caption.text, this.options))
                : ''
            const captionClass = token.caption?.hidden ? ' class="visually-hidden"' : ''
            const captionElement = caption ? `<caption${captionClass}>${caption}</caption>` : ''

            // The wrapper scrolls horizontally on narrow screens: Safari doesn't make scroll containers
            // keyboard focusable natively, so tabindex keeps the overflowing content reachable
            return '<div class="v-markdown-table" tabindex="0">'
                + `<table>${captionElement}<thead><tr>${header}</tr></thead>`
                + (body ? `<tbody>${body}</tbody>` : '')
                + '</table></div>\n'
        },
    },
}
