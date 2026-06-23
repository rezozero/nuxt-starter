export const units = {
    BYTES: 'bytes',
    KILOBYTE: 'Kib',
    MEGABYTE: 'MiB',
    GIGABYTE: 'GiB',
    TERABYTE: 'Tib',
    PETABYTE: 'Pib',
}

export const unitsByLocale = {
    fr: {
        [units.BYTES]: 'o',
        [units.KILOBYTE]: 'Ko',
        [units.MEGABYTE]: 'Mo',
        [units.GIGABYTE]: 'Go',
        [units.TERABYTE]: 'To',
        [units.PETABYTE]: 'Po',
    },
    en: {
        [units.BYTES]: 'b',
        [units.KILOBYTE]: 'KiB',
        [units.MEGABYTE]: 'MiB',
        [units.GIGABYTE]: 'GiB',
        [units.TERABYTE]: 'TiB',
        [units.PETABYTE]: 'PiB',
    },
} as const

// Intl.NumberFormat supports byte units but only in base-1000 (SI) and requires a fixed unit.
// Manual calculation allows base-1024 (binary) and auto-selects the appropriate unit.
export function formatBytes(size: number | string, locale: keyof typeof unitsByLocale) {
    let bytesLength = 0
    let n = parseInt(size.toString(), 10) || 0

    while (n >= 1024 && ++bytesLength) {
        n = n / 1024
    }

    const value = n.toFixed(n < 10 && bytesLength > 0 ? 1 : 0)

    const localizesUnits = Object.values(unitsByLocale[locale])
    const unitOutput = localizesUnits[bytesLength]

    return `${value}${unitOutput}`
}
