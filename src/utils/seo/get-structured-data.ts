import { JsonLdObject } from '@roadiz/abstract-api-client/dist/types/jsonld'
import { NuxtApp } from '@nuxt/types/app'
import { EventsApi } from '~/types/event'

export interface StructuredDataJsonLd {
    '@type': string
    [key: string]: unknown
}
type PropertiesOptions = string | string[]

enum Type {
    EVENT = 'http://schema.org/Event',
}

const DEFAULT_PROPERTIES: Record<string, string[]> = {
    [Type.EVENT]: [
        // Google required properties
        // @see https://developers.google.com/search/docs/appearance/structured-data/event#structured-data-type-definitions
        'location',
        'startDate',
        'name',
        // Google recommended properties
        'endDate',
        'description',
        'eventAttendanceMode',
        'eventStatus',
        'image',
        'offers',
        'organizer',
        'performer',
        'previousStartDate',
        // Other properties than Google ones
        // 'doorTime',
        // 'duration',
        // 'subEvent',
        // 'superEvent',
        // 'sponsor',
        // 'review',
    ],
}
// should be defined on each event date but for this project it is not into the data (not serialized)
const DEFAULT_EVENT_LOCATION = {
    '@type': 'Place',
    name: 'Opéra de Lyon',
    address: {
        '@type': 'PostalAddress',
        streetAddress: '1 place de la comédie',
        addressLocality: 'Lyon',
        postalCode: '69001',
        addressCountry: 'France',
    },
}

function isEvent(type: string): boolean {
    return type === Type.EVENT
}

function getPropertyValue(property: string, data: any, type: string, nuxt: NuxtApp): unknown {
    const propertyValue = data[property]

    // event
    if (isEvent(type)) {
        if (property === 'location') {
            return (data as EventsApi.EventDate).place?.address || DEFAULT_EVENT_LOCATION
        } else if (property === 'startDate') {
            // no startDate into the data
            return (data as EventsApi.EventDate).doorTime
        } else if (property === 'description') {
            return (data as EventsApi.Event).excerpt
        } else if (property === 'eventAttendanceMode') {
            // TODO: handle online and mixed events
            return 'https://schema.org/OfflineEventAttendanceMode'
        } else if (property === 'eventStatus') {
            if ((data as EventsApi.EventDate).cancelled) return 'https://schema.org/EventCancelled'
            else if ((data as EventsApi.EventDate).postponed) return 'https://schema.org/EventPostponed'
            else return 'https://schema.org/EventScheduled'
            // TODO: other status (rescheduled, scheduled, moved online)
        } else if (property === 'image') {
            const relativePath = (data as EventsApi.Event).mainDocuments?.[0]?.relativePath

            if (relativePath) {
                // Google recommended ratios
                // @see https://developers.google.com/search/docs/appearance/structured-data/event
                return ['1x1', '4x3', '16x9'].map((crop) => nuxt.$img(relativePath, { crop, width: 1920 }))
            }
        } else if (property === 'offers') {
            // TODO: use event date offers
            // but for now the event dates in the web response doesn't have the offers property
            // then we use the offersUrl event property
            if ((data as EventsApi.Event).offersUrl) {
                const offersUrl: string[] | Record<string, string> | undefined = (data as EventsApi.Event).offersUrl

                if (!offersUrl) return

                const urls = Array.isArray(offersUrl) ? offersUrl : Object.values(offersUrl)

                return urls.map((url) => ({
                    '@type': 'Offer',
                    url,
                }))
            }
        } else if (property === 'performer') {
            return (data as EventsApi.Event).performers?.map((performer) => ({
                // we don't know if its a person or an organization,
                // plus  Google requires a Person a PerformingGroup (the schema.org specification indicates Person or Organization)
                '@type': 'PerformingGroup',
                name: performer.manualPeopleOrOrganization || performer.identities,
            }))
        }
    }

    return propertyValue
}

function getDataValues(
    data: JsonLdObject,
    type: string,
    nuxt: NuxtApp,
    properties?: PropertiesOptions
): Record<string, unknown> {
    const result: Record<string, unknown> = {}

    properties = (typeof properties === 'string' ? properties.split(',') : properties) || DEFAULT_PROPERTIES[type] || []

    properties.forEach((property) => {
        const propertyValue = getPropertyValue(property, data, type, nuxt)

        if (propertyValue) result[property] = propertyValue
    })

    return result
}

function getStructuredDataEntry(
    data: JsonLdObject,
    type: string,
    nuxt: NuxtApp,
    properties?: PropertiesOptions
): StructuredDataJsonLd {
    return {
        '@type': type,
        '@context': 'https://schema.org',
        ...getDataValues(data, type, nuxt, properties),
    }
}

function getEventStructuredDataEntry(
    event: EventsApi.Event,
    nuxt: NuxtApp,
    properties?: PropertiesOptions,
    date?: EventsApi.EventDate
): StructuredDataJsonLd {
    const entry = getStructuredDataEntry(event, Type.EVENT, nuxt, properties)
    const dateValues = date && getDataValues(date, Type.EVENT, nuxt, properties)

    return { ...entry, ...dateValues }
}

function getEventStructuredData(
    event: EventsApi.Event,
    nuxt: NuxtApp,
    properties?: PropertiesOptions
): StructuredDataJsonLd | StructuredDataJsonLd[] | void {
    if (event.dates && event.dates.length > 1) {
        return event.dates.map((date) => getEventStructuredDataEntry(event, nuxt, properties, date))
    } else {
        return getEventStructuredDataEntry(event, nuxt, properties, event.dates?.[0])
    }
}

export function getStructuredData(
    data: JsonLdObject,
    nuxt: NuxtApp,
    properties?: PropertiesOptions
): StructuredDataJsonLd | StructuredDataJsonLd[] | void {
    const type = data['@type']

    if (isEvent(type)) {
        return getEventStructuredData(data as EventsApi.Event, nuxt, properties)
    }
}
