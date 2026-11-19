import type { RoadizDocument } from '@roadiz/types'
import { describe, expect, it } from 'vitest'
import { supportsTransparency } from '../app/utils/roadiz/document'

const withMimeType = (mimeType?: string) => ({ mimeType }) as RoadizDocument

describe('supportsTransparency', () => {
    it.each(['image/png', 'image/svg+xml', 'image/gif', 'image/webp', 'image/avif'])(
        'is true for %s',
        (mimeType) => {
            expect(supportsTransparency(withMimeType(mimeType))).toBe(true)
        },
    )

    it('is false for a JPEG', () => {
        expect(supportsTransparency(withMimeType('image/jpeg'))).toBe(false)
    })

    it('is false without a document or a mime type', () => {
        expect(supportsTransparency(undefined)).toBe(false)
        expect(supportsTransparency(withMimeType())).toBe(false)
    })
})
