export const units = {
    BYTES: 'bytes',
    KILOBYTE: 'KiB',
    MEGABYTE: 'MiB',
    GIGABYTE: 'GiB',
    TERABYTE: 'TiB',
    PETABYTE: 'PiB',
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
        [units.BYTES]: 'B',
        [units.KILOBYTE]: 'KiB',
        [units.MEGABYTE]: 'MiB',
        [units.GIGABYTE]: 'GiB',
        [units.TERABYTE]: 'TiB',
        [units.PETABYTE]: 'PiB',
    },
} as const

// Intl.NumberFormat supports byte units but only in base-1000 (SI) and requires a fixed unit.
// Manual calculation allows base-1024 (binary) and auto-selects the appropriate unit.
export function formatBytes(size: number | string, locale: string) {
    let bytesLength = 0
    let n = parseInt(size.toString(), 10) || 0

    while (n >= 1024 && ++bytesLength) {
        n = n / 1024
    }

    const value = n.toFixed(n < 10 && bytesLength > 0 ? 1 : 0)

    const localeKey = locale in unitsByLocale ? (locale as keyof typeof unitsByLocale) : 'en'
    const localizesUnits = Object.values(unitsByLocale[localeKey])
    const unitOutput = localizesUnits[Math.min(bytesLength, localizesUnits.length - 1)]

    return `${value}${unitOutput}`
}
