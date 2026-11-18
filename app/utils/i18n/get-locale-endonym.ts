/**
 * Name of a language in that language (e.g. 'fr' => 'Français', 'es' => 'Español'),
 * so that visitors recognize their own language whatever the current locale is.
 * Falls back to the uppercased code when the runtime cannot name it.
 */
export function getLocaleEndonym(code: string): string {
    try {
        const name = new Intl.DisplayNames([code], { type: 'language' }).of(code)

        // without data for the language, Intl returns the code itself
        if (!name || name.toLowerCase() === code.toLowerCase()) return code.toUpperCase()

        return name.charAt(0).toLocaleUpperCase(code) + name.slice(1)
    }
    catch {
        // invalid language tag
        return code.toUpperCase()
    }
}
