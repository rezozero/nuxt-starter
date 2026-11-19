// The locale the document was rendered in, which `[...slug].vue` compares to the web response to reload the page
// on a locale change. Not the i18n locale: it already follows the locale prefix before the page setup, so switching
// from the default locale would go unnoticed. Frozen by the layout on every server render, pages without a web
// response included.
export function useDocumentLocale() {
    return useState<string>('documentLocale', () => useNuxtApp().$i18n.locale.value)
}
