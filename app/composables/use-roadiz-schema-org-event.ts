import { AvailabilityCode } from '@events-api/javascript-sdk'
import type { EventsApi } from '@events-api/javascript-sdk'
import type { RoadizDocument } from '@roadiz/types'
import { joinURL } from 'ufo'
import { markdownToPlainText } from '~/utils/markdown/markdown-to-plain-text'

type UseSchemaOrgEventOptions = {
    event: MaybeRefOrGetter<EventsApi.Event | undefined>
    eventDates: MaybeRefOrGetter<EventsApi.EventDate[] | undefined>
}

function mapEventAvaibilityToStatusSchema(avaibilityCode: EventsApi.AvailabilityCode | undefined) {
    if (typeof avaibilityCode !== 'number') return undefined

    switch (avaibilityCode) {
        // https://schema.org/EventRescheduled
        // EventRescheduled is when a new date is proposed
        // the previous date need to be specified with previousStartDate property
        // case AvailabilityCode.RESCHEDULED:
        //     return 'EventRescheduled'

        case AvailabilityCode.CANCELLED:
            return 'EventCancelled'

        // An Event date POSTPONED haven't a new date proposed yet, so we use EventPostponed
        case AvailabilityCode.POSTPONED:
            return 'EventPostponed'

        case AvailabilityCode.LAST_SEATS:
        case AvailabilityCode.PROGRAMMING_IN_PROGRESS:
        case AvailabilityCode.AVAILABLE:
            return 'EventScheduled'

        default:
            return undefined
    }
}

export async function useRoadizSchemaOrgEvent(options: UseSchemaOrgEventOptions) {
    const { resolveImageUrl } = useRoadizResolvedImage()

    // Reactive cache of resolved media URLs, keyed by relativePath, so the (synchronous) computeds
    // below can look them up instead of calling resolveImageUrl lazily — that call must be
    // awaited, which a computed getter can't do.
    const mediaUrlCache = reactive(new Map<string, string>())

    async function populateMediaUrlCache(event: EventsApi.Event | undefined) {
        const documents = [
            event?.mainDocuments?.[0],
            ...(event?.performers?.flatMap(performer => performer.people?.map(p => p.mainDocuments?.[0])) ?? []),
        ].filter((doc): doc is RoadizDocument => !!doc?.relativePath)

        await Promise.all(documents.map(async (doc) => {
            const url = await resolveImageUrl(doc, { width: 1920 })
            if (url) mediaUrlCache.set(doc.relativePath!, url)
        }))
    }

    // Resolve upfront so the first (SSR) render already has the URLs available.
    await populateMediaUrlCache(toValue(options.event))

    // Keep the cache in sync if `event` changes later without remounting this composable's caller.
    watch(() => toValue(options.event), event => populateMediaUrlCache(event))

    function getSchemaOrgMedia(document: RoadizDocument | undefined): string | undefined {
        if (!document?.relativePath) return undefined
        return mediaUrlCache.get(document.relativePath)
    }

    const uniqueOffers = computed(() => {
        const eventDates = toValue(options.eventDates)
        if (!eventDates?.length) return undefined

        const offers = eventDates.flatMap((date) => {
            const offers = date.offers?.offers || []
            const seatCategories = date.additionalTicketingData?.seatCategories || []
            const lowPrice = date?.minPrice || seatCategories.reduce((acc, category) => {
                const price = (category.minPrice || 0) / 1000
                return Math.min(acc, price)
            }, 0)
            const highPrice = date?.maxPrice || seatCategories.reduce((acc, category) => {
                const price = (category.maxPrice || 0) / 1000
                return Math.max(acc, price)
            }, 0)

            return offers.map((offer) => {
                return {
                    name: offer?.identifier || offer?.name || undefined,
                    lowPrice,
                    highPrice,
                    // TODO: Price is a required key but not always available from eventsApi
                    price: typeof lowPrice === 'number' && typeof highPrice === 'number' ? `${lowPrice}€-${highPrice}€` : '',
                    priceCurrency: 'EUR',
                    validFrom: offer?.availabilityStarts || date.availabilityStarts,
                    validThrough: offer?.availabilityEnds || date.availabilityEnds,
                    availability: offer.availability,
                    url: offer.url!,
                }
            })
        }).filter((offer) => {
            return offer.url && ((offer.lowPrice || offer.highPrice) || offer.price)
        }) || []

        // Get unique offers by url
        return [...new Map(offers.map(item => [item.url, item])).values()]
    })

    const locationSchema = computed(() => {
        const eventDates = toValue(options.eventDates)

        const placesMap = new Map<string, Omit<EventsApi.Place, 'eventDates'>>()
        for (const date of eventDates ?? []) {
            const id = date.place?.['@id']
            if (id && date.place && !placesMap.has(id)) {
                placesMap.set(id, date.place)
            }
        }

        if (!placesMap.size) {
            const event = toValue(options.event)
            const names = Object.values(event?.placesNames ?? {})
            if (!names.length) return undefined
            return { '@type': 'Place' as const, 'name': names.join(', ') }
        }

        const places = [...placesMap.values()].map(place => ({
            '@type': 'Place' as const,
            'name': place.name ?? '',
            ...(place.websiteUrl && { url: place.websiteUrl }),
        }))

        return places.length === 1 ? places[0] : places
    })

    const performersSchema = computed(() => {
        const event = toValue(options.event)
        if (!event) return undefined

        const persons = event.performers?.flatMap((performer) => {
            return performer.people?.map((p) => {
                return {
                    '@type': 'Person',
                    'name': p.name || p.fullName || 'Unknown',
                    'description': markdownToPlainText(p.description),
                    'image': getSchemaOrgMedia(p.mainDocuments?.[0]),
                    'url': p.url ? joinURL(siteUrl, p.url) : undefined,
                }
            })
        })?.filter(p => p?.name)

        return persons?.length ? persons : undefined
    })

    const siteUrl = useRuntimeConfig().public.site.url

    const getFirstItem = (arr: undefined | string | string[]) => Array.isArray(arr) ? arr[0] : arr
    function getEventDateRange(dates: EventsApi.Event['arrayDates']) {
        return [
            getFirstItem(dates?.[0]) || undefined,
            dates?.length ? getFirstItem(dates[dates.length - 1]) : undefined,
        ]
    }

    return computed(() => {
        const event = toValue(options.event)
        if (!event) return {}

        const [startDate, endDate] = getEventDateRange(event.arrayDates)
        const eventStatus = mapEventAvaibilityToStatusSchema(event.availability?.value)

        return {
            name: event.name,
            description: markdownToPlainText(event.description),
            eventStatus,
            image: getSchemaOrgMedia(event.mainDocuments?.[0]),
            location: locationSchema.value,
            offers: uniqueOffers.value,
            // `EventSimple` types this as `performers` (plural), but using
            // `performer` (singular) is required for `defineEvent` to resolve each Person to a
            // compact `{ "@id": "..." }` reference in the output. Using `performers` bypasses
            // that resolution and renders the raw object instead.
            performer: performersSchema.value,
            duration: event.duration || undefined,
            accessibilityFeatures: event.accessibilityFeatures?.join(', '),
            startDate,
            endDate,
        }
    })
}
