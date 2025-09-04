import type { MaybeRef } from 'vue'
import { toDisplayString } from 'vue'

type StructuredDataContent = Record<string, unknown>

const isNullishValue = (v: unknown): boolean => {
    if (typeof v === 'number') return false
    if (v === null || v === undefined) return true
    if (Array.isArray(v)) return v.length === 0
    if (typeof v === 'object') return Object.keys(v).length === 0
    return false
}

export function removeNullishNestedKeys<T extends StructuredDataContent>(obj: T): T {
    return Object.entries(obj).reduce((acc, [key, value]) => {
        if (isNullishValue(value)) {
            return acc
        }

        if (Array.isArray(value)) {
            const cleanedArr = value
                .map(v =>
                    typeof v === 'object' && v !== null
                        ? removeNullishNestedKeys(v as StructuredDataContent)
                        : v)
                .filter(v => !isNullishValue(v))

            if (cleanedArr.length > 0) {
                (acc as StructuredDataContent)[key] = cleanedArr
            }
            return acc
        }

        if (typeof value === 'object' && value !== null && Object.keys(value).length) {
            const cleanedObj = removeNullishNestedKeys(value as StructuredDataContent)
            if (!isNullishValue(cleanedObj)) {
                (acc as StructuredDataContent)[key] = cleanedObj
            }
            return acc
        }

        (acc as StructuredDataContent)[key] = value
        return acc
    }, {} as T)
}
export function getJsonLdScriptContent(content: MaybeRef<StructuredDataContent | unknown[]>) {
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
