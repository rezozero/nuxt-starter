export default function toBoolean(value: any): boolean {
    return typeof value === 'string' ? (value as string).toLowerCase() === 'true' : !!value
}
