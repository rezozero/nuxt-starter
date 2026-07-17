import type { EventsApi } from '@events-api/javascript-sdk'
import type { MaybeRefOrGetter } from 'vue'
import { markdownToPlainText } from '~/utils/markdown/markdown-to-plain-text'

// API day codes (`Mo`, `Tu`, ...) to schema.org day names — schema.org requires full names/URLs.
const SCHEMA_ORG_DAY_NAMES: Record<string, string> = {
    Mo: 'Monday',
    Tu: 'Tuesday',
    We: 'Wednesday',
    Th: 'Thursday',
    Fr: 'Friday',
    Sa: 'Saturday',
    Su: 'Sunday',
}

export async function useRoadizSchemaOrgPlace(
    place: MaybeRefOrGetter<EventsApi.Place | undefined>,
) {
    const { resolveImageUrl } = useRoadizResolvedImage()
    const placeRef = computed(() => toValue(place))

    const logoUrl = ref<string | undefined>()
    const imageUrl = ref<string | undefined>()

    async function resolveMediaUrls(currentPlace: EventsApi.Place | undefined) {
        [logoUrl.value, imageUrl.value] = await Promise.all([
            resolveImageUrl(currentPlace?.logos?.[0], { width: 600, quality: 70 }),
            resolveImageUrl(currentPlace?.mainDocuments?.[0], { width: 1200, crop: '1200x630', quality: 70 }),
        ])
    }

    // Resolve upfront so the first (SSR) render already has the URLs available.
    await resolveMediaUrls(placeRef.value)

    // Keep it in sync if `place` changes later without remounting this composable's caller.
    watch(placeRef, resolveMediaUrls)

    const address = computed(() => {
        const addr = placeRef.value?.address
        if (!addr) return undefined
        return {
            '@type': 'PostalAddress' as const,
            'streetAddress': addr.streetAddress ?? undefined,
            'addressLocality': addr.addressLocality ?? undefined,
            'addressRegion': addr.addressRegion ?? undefined,
            'postalCode': addr.postalCode ?? undefined,
            'addressCountry': addr.addressCountry ?? 'FR',
        }
    })

    const geo = computed(() => {
        const g = placeRef.value?.geo
        if (!g?.latitude || !g?.longitude) return undefined
        return {
            '@type': 'GeoCoordinates' as const,
            'latitude': g.latitude,
            'longitude': g.longitude,
            'elevation': g.elevation ?? undefined,
        }
    })

    const logo = computed(() => {
        if (!logoUrl.value) return undefined

        return {
            '@type': 'ImageObject' as const,
            'url': logoUrl.value,
        }
    })

    const image = computed(() => {
        if (!imageUrl.value) return undefined

        return {
            '@type': 'ImageObject' as const,
            'url': imageUrl.value,
        }
    })

    const openingHoursSpecification = computed(() => {
        const specs = placeRef.value?.openingHoursSpecification
        if (!specs?.length) return undefined

        const mapped = specs
            .filter(spec => spec.opens && spec.closes)
            .map((spec) => {
                const days = (Array.isArray(spec.dayOfWeek) ? spec.dayOfWeek : [spec.dayOfWeek])
                    .filter((day): day is string => !!day)
                return {
                    '@type': 'OpeningHoursSpecification' as const,
                    'dayOfWeek': days.map(day => SCHEMA_ORG_DAY_NAMES[day] ?? day),
                    'opens': spec.opens ?? undefined,
                    'closes': spec.closes ?? undefined,
                    'validFrom': spec.validFrom ?? undefined,
                    'validThrough': spec.validThrough ?? undefined,
                }
            })

        return mapped.length ? mapped : undefined
    })

    return computed(() => ({
        name: placeRef.value?.name ?? undefined,
        description: markdownToPlainText(placeRef.value?.description),
        address: address.value,
        telephone: placeRef.value?.telephone ?? undefined,
        email: placeRef.value?.email ?? undefined,
        geo: geo.value,
        logo: logo.value,
        image: image.value,
        openingHoursSpecification: openingHoursSpecification.value,
        url: placeRef.value?.websiteUrl ?? undefined,
    }))
}
