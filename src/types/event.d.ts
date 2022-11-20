import { JsonLdObject } from '@roadiz/abstract-api-client/dist/types/jsonld'
import { RoadizDocument, RoadizNodesSources, RoadizTag } from '@roadiz/abstract-api-client/dist/types/roadiz'

export namespace EventsApi {
    interface TicketingAware {
        offersUrl?: Array<string>
    }

    interface DocumentedEntity {
        mainDocument?: RoadizDocument | null
        mainDocuments?: Array<RoadizDocument> | null
        medias?: Array<RoadizDocument>
        logos?: Array<RoadizDocument>
        icons?: Array<RoadizDocument>
        fallbackDocument?: RoadizDocument | null
    }

    interface TaggedEntity {
        tags?: Array<RoadizTag> // collection without filter
        mainTag?: RoadizTag | null // first main tag
        mainTags?: Array<RoadizTag> | null
        otherTags?: Array<RoadizTag> | null
    }

    interface Thing {
        name?: string | null
        slug?: string | null
    }

    interface Routable {
        url?: string | null
    }

    interface PublishableEntity {
        publishedAt?: string | null
        published?: boolean
    }

    interface DateSortable {
        sortingFirstDateTime?: string | null
        sortingDateTime?: string | null
        sortingLastDateTime?: string | null
        availability?: number
        cancelled?: boolean
        postponed?: boolean
        programmingInProgress?: boolean
        arrayDates?: Array<string> | Array<Array<string>>
        longRunningEvent?: boolean
        placesNames?: Record<string, string>
    }

    interface Event
        extends JsonLdObject,
            Thing,
            Routable,
            DocumentedEntity,
            TicketingAware,
            TaggedEntity,
            DateSortable,
            PublishableEntity {
        additionalRoles?: string | null
        attributes?: Array<KeyValueItem>
        blogPosts?: Array<RoadizNodesSources>
        bookingDescription?: string | null
        bookingLabel?: string | null
        castingPending?: boolean
        color?: string | null
        country?: string | null
        customDatesLabel?: string | null
        dates: Array<Omit<EventDate, 'event' | 'additionalTicketingData' | 'offers'>>
        datesCount?: number | null
        disclaimer?: string | null
        duration?: string | null
        excerpt?: string | null
        gatheredEvents?: Array<Event>
        gatheredEventsCount?: number | null
        inLanguage?: string | null
        includedIn?: Array<Event>
        minPrice?: number | null
        maxPrice?: number | null
        offSubscription?: boolean
        placeMapImage?: RoadizDocument | null
        otherDocuments?: Array<RoadizDocument>
        overtitleLanguage?: string | null
        peripheralEvents?: Array<Event>
        position?: number | null
        priceRange?: string | null
        pricingDescription?: string | null
        reassurance?: Review | null
        relatedEvents?: Array<Event>
        reversePeripheralEvents?: Array<Event>
        reverseRelatedEvents?: Array<Event>
        review?: Review | null
        performers?: Array<Omit<Role, 'event'>>
        sponsors?: Array<Omit<Role, 'event'>>
        scheduleDescription?: string | null
        schedule?: Array<ScheduleItem>
        season?: Omit<Season, 'seo'> | null
        seo?: Seo | null
        sponsorsTitle?: string | null
        subEvents?: Array<Event>
        subEventsCount?: number | null
        subtitle?: string | null
        superEvent?: Event | null
        type?:
            | null
            | 'live_performance'
            | 'festival'
            | 'educational'
            | 'exhibition'
            | 'screening'
            | 'conference'
            | 'guided_tour'
            | 'piece_of_art'
            | 'other'
        typicalAgeRange?: string | null
    }

    interface DurationAware {
        open?: boolean
        duration?: string
        multiDay?: boolean
    }

    interface Availability {
        availability?: number
        available?: boolean
        noVacancy?: boolean
        lastSeats?: boolean
        cancelled?: boolean
        postponed?: boolean
        programmingInProgress?: boolean
    }

    interface Offer extends JsonLdObject {
        identifier?: string | null
        availability?:
            | 'https://schema.org/BackOrder'
            | 'https://schema.org/Discontinued'
            | 'https://schema.org/InStock'
            | 'https://schema.org/InStoreOnly'
            | 'https://schema.org/LimitedAvailability'
            | 'https://schema.org/OnlineOnly'
            | 'https://schema.org/OutOfStock'
            | 'https://schema.org/PreOrder'
            | 'https://schema.org/PreSale'
            | 'https://schema.org/SoldOut'
            | null
        name?: string | null
        category?:
            | null
            | 'booking'
            | 'pre_reservation'
            | 'free_entrance_upon_reservation'
            | 'additional_booking'
            | 'free_entrance'
        eligibleCustomerType?: null | 'occasional' | 'member' | 'subscriber'
        url?: string | null
        availabilityStarts?: string | null
        availabilityEnds?: string | null
    }

    interface AggregateOffer extends JsonLdObject {
        identifier?: string | null
        offers?: Array<Offer>
        offerCount?: number
    }

    interface EventDate extends JsonLdObject, DurationAware, Availability {
        event?: Omit<Event, 'dates'>
        doorTime?: string | null
        availabilityStarts?: string | null
        subscriberAvailabilityStarts?: string | null
        memberAvailabilityStarts?: string | null
        availabilityEnds?: string | null
        subscriberAvailabilityEnds?: string | null
        memberAvailabilityEnds?: string | null
        preReservationStarts?: string | null
        subscriberPreReservationStarts?: string | null
        memberPreReservationStarts?: string | null
        preReservationEnds?: string | null
        subscriberPreReservationEnds?: string | null
        memberPreReservationEnds?: string | null
        endDate?: string | null
        place?: Omit<Place, 'eventDates'> | null
        bookingLabel?: string | null
        free?: boolean
        minPrice?: number | null
        maxPrice?: number | null
        online?: boolean
        additionalTicketingData?: SecutixAdditionalTicketingData | null
        offers?: AggregateOffer
    }

    interface SecutixAvailability {
        level?: string
        quota?: number
        remaining?: number
    }

    interface SecutixPrice {
        code?: string
        kind?: string
        name?: string
        amount?: number
        comfortVars?: Array<Record<string, string>>
        // Following data is not exposed by API
        // but created by getReducedSeatCategoriesPrices util
        minAmount?: number
        maxAmount?: number
        gatheredPrices?: Record<string, SecutixPrice>
        message?: string
    }

    interface SecutixSeatCategory {
        id?: number
        code?: string
        color?: string
        maxPrice?: number
        minPrice?: number
        availability?: SecutixAvailability
        externalName?: string
        memberPrices?: Record<string, SecutixPrice>
        occasionalPrices?: Record<string, SecutixPrice>
        subscriberPrices?: Record<string, SecutixPrice>
    }

    interface SecutixSalesPeriod {
        start?: string
        end?: string
    }

    interface SecutixSeasonTicket {
        id: number
        externalName?: string
        salesPeriods?: Array<SecutixSalesPeriod>
        largeImageUrl?: string
        mediumImageUrl?: string
    }

    interface SecutixAdditionalTicketingData {
        availability?: SecutixAvailability
        seatCategories?: Array<SecutixSeatCategory>
        seasonTickets?: Array<SecutixSeasonTicket>
        inSeasonTickets?: boolean
        waitingListAllowed?: boolean
    }

    interface Review extends JsonLdObject {
        reviewBody?: string
        author?: string
    }

    interface Seo extends JsonLdObject {
        title?: string | null
        description?: string | null
        keywords?: string | null
    }

    interface Person extends JsonLdObject, TaggedEntity, DocumentedEntity, Routable {
        name?: string | null
        fullName?: string | null
        seo?: Seo
        slug?: string | null
        familyName?: string | null
        givenName?: string | null
        address?: PostalAddress | null
        websiteUrl?: string | null
        jobTitle?: string | null
        memberOf?: Array<Organization>
        excerpt?: string | null
        description?: string | null
        relatedTo?: Array<Person>
    }

    interface Organization extends TaggedEntity, DocumentedEntity, Routable {
        name?: string | null
        seo?: Seo
        slug?: string | null
        websiteUrl?: string | null
        members?: Array<Person>
        excerpt?: string | null
        description?: string | null
    }

    interface Role extends JsonLdObject {
        name?: string | null
        type?: 'performer' | 'sponsor'
        event?: Event
        people?: Array<Person>
        organization?: Organization
        description?: string | null
        quote?: string | null
        mainRole?: boolean
        onStage?: boolean
        onFocus?: boolean
        manualPeopleOrOrganization?: string
        identities?: string | null
    }

    interface Season extends JsonLdObject, DocumentedEntity, Thing, Routable {
        seo?: Seo
        startDate?: string | null
        endDate?: string | null
        color?: string | null
    }

    interface Weightable {
        weight?: number
    }

    interface PostalAddress {
        addressCountry?: string | null
        addressLocality?: string | null
        addressRegion?: string | null
        postOfficeBoxNumber?: string | null
        postalCode?: string | null
        streetAddress?: string | null
    }

    interface GeoCoordinates {
        latitude?: number | null
        longitude?: number | null
        elevation?: number | null
    }

    interface Place extends JsonLdObject, Thing, DocumentedEntity, TaggedEntity, Weightable {
        address?: PostalAddress
        seo?: Seo
        geo?: GeoCoordinates
        eventDates?: Array<EventDate>
        description?: string | null
        directions?: string | null
        accessibility?: string | null
        externalTicketingUrl?: string | null
        telephone?: string | null
        email?: string | null
        openingHours?: string | null
        websiteUrl?: string | null
        zone?: string | null
    }

    interface ScheduleItem {
        title?: string | null
        headliner?: string | null
        part?: string | null
        duration?: string | null
        intermission?: boolean
    }

    interface KeyValueItem {
        key?: string | null
        value?: string | null
    }
}
