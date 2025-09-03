import type { MaybeRef } from 'vue'
import { toDisplayString } from 'vue'

type structuredDataContent = Record<string, unknown>

const isNullishValue = (v: unknown) => {
    if (typeof v === 'number') return false
    return v === null || v === undefined || !Object.keys(v).length || (Array.isArray(v) && !v.length)
}

function removeNullishNestedKeys(obj: structuredDataContent) {
    Object.keys(obj).forEach((key) => {
        const value = obj[key]

        // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
        if (isNullishValue(value)) delete obj[key]
        // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
        else if (Array.isArray(value) && value.every(v => isNullishValue(v))) delete obj[key]
        else if (value && typeof value === 'object') removeNullishNestedKeys(value as structuredDataContent)
    })

    return obj
}

export function getJsonLdScriptContent(content: MaybeRef<structuredDataContent | unknown[]>) {
    const value = toValue(content)

    const filteredContent = Array.isArray(value)
        ? value.filter(v => !isNullishValue(v))
        : removeNullishNestedKeys(value)

    return {
        type: 'application/ld+json',
        innerHTML: toDisplayString(filteredContent).replaceAll(
            /"@id":\s?"\/api\/\.well-known\/genid\/([^"]+)",\s*/gm, // Remove auto genid from structured data. It could lead Google to follow them as links, plus it is useless.
            '',
        ),
    }
}
