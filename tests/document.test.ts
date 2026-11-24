import type { RoadizDocument } from '@roadiz/types'
import { describe, expect, it } from 'vitest'
import { supportsTransparency } from '../app/utils/roadiz/document'

const withMimeType = (mimeType?: string) => ({ mimeType }) as RoadizDocument

describe('supportsTransparency', () => {
    it.each(['image/png', 'image/svg+xml', 'image/gif'])(
        'is true for %s',
        (mimeType) => {
            expect(supportsTransparency(withMimeType(mimeType))).toBe(true)
        },
    )

    it.each(['image/jpeg', 'image/webp', 'image/avif'])('is false for %s', (mimeType) => {
        expect(supportsTransparency(withMimeType(mimeType))).toBe(false)
    })

    it('is false without a document or a mime type', () => {
        expect(supportsTransparency(undefined)).toBe(false)
        expect(supportsTransparency(withMimeType())).toBe(false)
    })
})
