import type { EventsApi } from '@events-api/javascript-sdk'
import type { ImageOptions } from '@nuxt/image'
import type { RoadizDocument } from '@roadiz/types'
import type { MaybeRefOrGetter } from 'vue'

export function useRoadizPlaceSchemaOrg(
    place: MaybeRefOrGetter<EventsApi.Place | undefined>,
) {
    const img = useImage()
    const nuxtApp = useNuxtApp()
    const placeRef = computed(() => toValue(place))

    function getSchemaOrgMedia(document: RoadizDocument | undefined): string | undefined {
        if (!document?.relativePath) return undefined

        // runWithContext restores the Nuxt instance so the provider's useRuntimeConfig() call works
        // when this function is invoked from inside a lazily-evaluated computed.
        // The callback is synchronous so the cast is safe.
        return nuxtApp.runWithContext(() =>
            img(document.relativePath!, { width: 1920 }, { provider: 'interventionRequest' } as unknown as ImageOptions)) as string | undefined
    }

    const address = computed(() => {
        const addr = placeRef.value?.address
        if (!addr) return undefined
        return {
            '@type': 'PostalAddress' as const,
            'streetAddress': addr.streetAddress ?? undefined,
            'addressLocality': addr.addressLocality ?? undefined,
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
        }
    })

    const logo = computed(() => {
        const doc = placeRef.value?.logos?.[0]
        if (!doc) return undefined
        const url = getSchemaOrgMedia(doc as RoadizDocument)
        if (!url) return undefined
        return {
            '@type': 'ImageObject' as const,
            url,
        }
    })

    return computed(() => ({
        '@type': 'Place',
        'name': placeRef.value?.name ?? undefined,
        'address': address.value,
        'telephone': placeRef.value?.telephone ?? undefined,
        'geo': geo.value,
        'logo': logo.value,
        'url': placeRef.value?.websiteUrl ?? undefined,
    }))
}
