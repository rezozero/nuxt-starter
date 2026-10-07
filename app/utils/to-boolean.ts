export function toBoolean(value: unknown): boolean {
    return typeof value === 'string'
        ? (value as string).toLowerCase() === 'true'
        || (value as string).toLowerCase() === 'yes'
        || (value as string).toLowerCase() === 'on'
        || (value as string).toLowerCase() === '1'
        : !!value
}
