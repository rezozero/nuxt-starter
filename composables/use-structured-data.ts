import type { JsonLdObject } from '@roadiz/types'
import type { EventsApi } from '~/types/event'
import { isEventEntity } from '~/utils/roadiz/entity'
import { availabilityCodes, type AvailabilityCodesValue } from '~/constants/availibity-codes'

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
        'typicalAgeRange',
        'duration',
        'sponsor',
        'reviews',
        // 'doorTime',
        // 'subEvent',
        // 'superEvent',
    ],
}

function isEvent(type: string): boolean {
    return type === Type.EVENT
}

interface EventStructuredDataOption {
    data: JsonLdObject
    properties?: PropertiesOptions
}

export function useStructuredData(options: EventStructuredDataOption) {
    const img = useImage()

    // should be defined on each event date but for this project it is not into the data (not serialized)
    // const appConfig = useAppConfig()
    // const defaultEventLocation = appConfig.mainLocation
    const { head } = useCommonContent()
    const siteUrl = useRuntimeConfig().public.siteURL

    const defaultOrganizer = {
        '@type': 'Organization',
        name: head.value?.siteName,
        url: siteUrl,
    }
    const defaultPlace = useAppConfig().mainPlace

    function getPropertyValue(property: string, data: any, type: string) {
        const propertyValue = data[property]

        // event
        if (isEvent(type)) {
            if (property === 'organizer') {
                return defaultOrganizer
            } else if (property === 'location') {
                return (data as EventsApi.EventDate).place?.address || defaultPlace
            } else if (property === 'startDate') {
                // no startDate into the data
                return (data as EventsApi.EventDate).startDate
            } else if (property === 'endDate') {
                return (data as EventsApi.EventDate).endDate
            } else if (property === 'description') {
                return (data as EventsApi.Event).excerpt
            } else if (property === 'eventAttendanceMode') {
                // TODO: handle online and mixed events
                return 'https://schema.org/OfflineEventAttendanceMode'
            } else if (property === 'eventStatus') {
                const availability = data.availability?.value as AvailabilityCodesValue
                // TODO: other status (rescheduled, scheduled, moved online)

                if (availability === availabilityCodes.CANCELLED) return 'https://schema.org/EventCancelled'
                else if (availability === availabilityCodes.POSTPONED) return 'https://schema.org/EventPostponed'
                else return 'https://schema.org/EventScheduled'
            } else if (property === 'image') {
                const relativePath = (data as EventsApi.Event).mainDocuments?.[0]?.relativePath

                if (relativePath) {
                    // Google recommended ratios
                    // @see https://developers.google.com/search/docs/appearance/structured-data/event
                    return ['1x1', '4x3', '16x9'].map((crop) =>
                        img(relativePath, { crop, width: 1920 }, { provider: 'interventionRequest' }),
                    )
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
            } else if (property === 'typicalAgeRange') {
                return data.typicalAgeRange
            } else if (property === 'duration') {
                return data.duration
            } else if (property === 'sponsor' && data.sponsors?.length) {
                return data.sponsors
            } else if (property === 'reviews' && data.review?.length) {
                return data.review
            }
        }

        return propertyValue
    }

    function getDataValues(data: JsonLdObject, type: string, properties?: PropertiesOptions): Record<string, unknown> {
        const result: Record<string, unknown> = {}

        properties =
            (typeof properties === 'string' ? properties.split(',') : properties) || DEFAULT_PROPERTIES[type] || []

        properties.forEach((property) => {
            const propertyValue = getPropertyValue(property, data, type)

            if (propertyValue) result[property] = propertyValue
        })

        return result
    }

    function getStructuredDataEntry(
        data: JsonLdObject,
        type: string,
        properties?: PropertiesOptions,
    ): StructuredDataJsonLd {
        return {
            '@type': type,
            '@context': 'https://schema.org',
            ...getDataValues(data, type, properties),
        }
    }

    function getEventStructuredDataEntry(
        event: EventsApi.Event,
        properties?: PropertiesOptions,
        date?: EventsApi.EventDate,
    ): StructuredDataJsonLd {
        const entry = getStructuredDataEntry(event, Type.EVENT, properties)
        const dateValues = date && getDataValues(date, Type.EVENT, properties)

        return { ...entry, ...dateValues }
    }

    function getEventStructuredData(event: EventsApi.Event, properties?: PropertiesOptions) {
        if (event.dates && event.dates.length > 1) {
            return event.dates.map((date) => getEventStructuredDataEntry(event, properties, date))
        } else {
            return getEventStructuredDataEntry(event, properties, event.dates?.[0])
        }
    }

    function getStructuredData(data: JsonLdObject, properties?: PropertiesOptions) {
        if (isEventEntity(data)) {
            return getEventStructuredData(data, properties)
        }
        // TODO: adapt for others object types
    }

    return getStructuredData(options.data, options?.properties)
}
