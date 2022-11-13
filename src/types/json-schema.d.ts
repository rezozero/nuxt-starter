import { JSONSchema4 } from 'json-schema'

interface JsonSchemaExtended extends JSONSchema4 {
    widget?: string
    // eslint-disable-next-line camelcase
    enum_titles?: string[]
    attr?: Record<string, string>
}
