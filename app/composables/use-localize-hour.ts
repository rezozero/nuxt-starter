export function useLocalizeHour() {
    const { locale } = useI18n()

    return function (date: string) {
        if (locale.value === 'fr') {
            return date
                .replace(/:/, 'h') // 20:15 -> 20h15
                .replace('h00', 'h') // 20h00 -> 20h
        }

        return date
    }
}
