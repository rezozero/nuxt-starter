export default function toBoolean(value: boolean | string | number | undefined): boolean {
    return (
        typeof value !== 'undefined' &&
        (value === true || value === 'true' || value === 'True' || value === 'TRUE' || value === 1)
    )
}
