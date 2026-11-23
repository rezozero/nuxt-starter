/**
 * Adds header names to a `Vary` header value, skipping the ones already listed (case-insensitive),
 * so that rendering the same component twice in one request (e.g. error page) does not repeat them.
 * A header value may be a string, a number or a list of strings.
 */
export function mergeVaryHeader(current: string | number | string[] | null | undefined, ...names: string[]): string {
    const tokens = [current ?? []]
        .flat()
        .flatMap(value => String(value).split(','))
        .map(token => token.trim())
        .filter(Boolean)

    // `*` already varies on everything
    if (tokens.includes('*')) return '*'

    const lowerCaseTokens = tokens.map(token => token.toLowerCase())

    for (const name of names) {
        if (lowerCaseTokens.includes(name.toLowerCase())) continue

        tokens.push(name)
        lowerCaseTokens.push(name.toLowerCase())
    }

    return tokens.join(', ')
}
