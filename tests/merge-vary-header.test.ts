import { describe, expect, it } from 'vitest'
import { mergeVaryHeader } from '../app/utils/http/merge-vary-header'

describe('mergeVaryHeader', () => {
    it('creates the header when none is set', () => {
        expect(mergeVaryHeader(undefined, 'Accept-Language', 'Cookie')).toBe('Accept-Language, Cookie')
    })

    it('appends to an existing value', () => {
        expect(mergeVaryHeader('Accept-Encoding', 'Accept-Language')).toBe('Accept-Encoding, Accept-Language')
        expect(mergeVaryHeader(['Accept-Encoding', 'Origin'], 'Cookie')).toBe('Accept-Encoding, Origin, Cookie')
    })

    it('does not repeat header names, whatever their case', () => {
        expect(mergeVaryHeader('accept-language, Cookie', 'Accept-Language', 'Cookie')).toBe('accept-language, Cookie')
        expect(mergeVaryHeader(undefined, 'Cookie', 'cookie')).toBe('Cookie')
    })

    it('keeps a wildcard as is', () => {
        expect(mergeVaryHeader('*', 'Accept-Language')).toBe('*')
    })
})
