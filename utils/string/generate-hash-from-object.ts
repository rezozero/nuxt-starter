// Example usage
// const obj = { key1: 'value1', key2: 'value2' }
// const hash = generateHashFromObject(obj)
// console.log(hash)

// generate simple hash from object
export function generateHashFromObject(obj: Record<string, unknown>): string {
    const jsonString = JSON.stringify(obj)
    let hash = 0

    for (let i = 0; i < jsonString.length; i++) {
        const char = jsonString.charCodeAt(i)
        hash = (hash << 5) - hash + char
        hash |= 0 // Convert to 32bit integer
    }

    return hash.toString(16)
}
