import { describe, expect, it } from 'vitest'
import { fitCrop, parseCrop } from '../app/utils/image/crop'

describe('parseCrop', () => {
    it('reads a crop as a ratio', () => {
        expect(parseCrop('344x220')).toEqual({ width: 344, height: 220 })
    })

    it('ignores anything that is not a crop', () => {
        expect(parseCrop(undefined)).toBeUndefined()
        expect(parseCrop('344')).toBeUndefined()
        expect(parseCrop('0x220')).toBeUndefined()
        expect(parseCrop('axb')).toBeUndefined()
    })
})

describe('fitCrop', () => {
    const landscape = { width: 344, height: 220 }

    it('keeps the full width of a taller image', () => {
        // 1661 × 2500 portrait document, 344 × 220 crop
        expect(fitCrop(landscape, 1661, 2500)).toEqual([1661, 1062])
    })

    it('keeps the full height of a wider image', () => {
        expect(fitCrop({ width: 1, height: 2 }, 2500, 1578)).toEqual([789, 1578])
    })

    it('derives the missing side from the ratio', () => {
        expect(fitCrop(landscape, 344)).toEqual([344, 220])
        expect(fitCrop(landscape, undefined, 220)).toEqual([344, 220])
        expect(fitCrop(landscape)).toBeUndefined()
    })
})
