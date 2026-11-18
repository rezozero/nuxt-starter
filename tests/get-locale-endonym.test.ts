import { describe, expect, it } from 'vitest'
import { getLocaleEndonym } from '../app/utils/i18n/get-locale-endonym'

describe('getLocaleEndonym', () => {
    it('names each language in itself, capitalized', () => {
        expect(getLocaleEndonym('fr')).toBe('Français')
        expect(getLocaleEndonym('en')).toBe('English')
        expect(getLocaleEndonym('es')).toBe('Español')
        expect(getLocaleEndonym('de')).toBe('Deutsch')
    })

    it('keeps the region of a regional locale', () => {
        expect(getLocaleEndonym('en-GB')).toBe('British English')
    })

    it('falls back to the uppercased code', () => {
        expect(getLocaleEndonym('not a tag')).toBe('NOT A TAG')
        expect(getLocaleEndonym('xx')).toBe('XX')
    })
})
