import { describe, expect, it } from 'vitest'
import { getOgLocale } from '../app/utils/i18n/get-og-locale'

const locales = [
    { code: 'fr', language: 'fr-FR' },
    { code: 'en', language: 'en-GB' },
    { code: 'de' },
]

describe('getOgLocale', () => {
    it('converts the BCP 47 language of the locale', () => {
        expect(getOgLocale('fr', locales)).toBe('fr_FR')
        expect(getOgLocale('en', locales)).toBe('en_GB')
    })

    it('returns undefined for an unknown locale or a locale without language', () => {
        expect(getOgLocale('es', locales)).toBeUndefined()
        expect(getOgLocale('de', locales)).toBeUndefined()
    })
})
