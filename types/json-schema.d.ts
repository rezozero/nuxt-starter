import type { JSONSchema4 } from 'json-schema'

export interface JsonSchemaExtended extends JSONSchema4 {
    widget?: string

    enum_titles?: string[]
    attr?: Record<string, string | boolean>
}
