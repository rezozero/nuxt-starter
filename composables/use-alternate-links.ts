import type { RoadizAlternateLink } from '@roadiz/types'
import type { LocaleObject } from '@nuxtjs/i18n'

export function useAlternateLinks(links?: RoadizAlternateLink[]) {
    const alternateLinks = useState<RoadizAlternateLink[]>('alternateLinks', () => [])

    if (links) alternateLinks.value = links

    const { $i18n } = useNuxtApp()

    const availableAlternateLinks = computed(() => {
        const locales =
            ($i18n.locales.value?.some((locale: unknown) => typeof locale === 'string')
                ? ($i18n.locales.value as unknown as string[])
                : ($i18n.locales.value as LocaleObject[]).map((locale) => locale.code)) || []

        return alternateLinks.value.sort((a: RoadizAlternateLink, b: RoadizAlternateLink) => {
            const indexA = locales.includes(a.locale) ? locales.indexOf(a.locale) : 9999
            const indexB = locales.includes(b.locale) ? locales.indexOf(b.locale) : 9999

            return indexA - indexB
        })
    })

    return { alternateLinks, availableAlternateLinks }
}
