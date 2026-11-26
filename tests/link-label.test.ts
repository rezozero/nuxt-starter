import { describe, expect, it } from 'vitest'
import { getLinkLabelWithContext, LINK_CONTEXT_SEPARATOR } from '../app/utils/a11y/link-label'

describe('getLinkLabelWithContext', () => {
    it('appends the context after the visible label', () => {
        expect(getLinkLabelWithContext('Learn more', 'Card title')).toBe(`Learn more${LINK_CONTEXT_SEPARATOR}Card title`)
    })

    it('keeps the visible label at the start of the name', () => {
        expect(getLinkLabelWithContext('Learn more', 'Card title').startsWith('Learn more')).toBe(true)
    })

    it('returns the label alone without context', () => {
        expect(getLinkLabelWithContext('Learn more')).toBe('Learn more')
        expect(getLinkLabelWithContext('Learn more', '')).toBe('Learn more')
    })
})
