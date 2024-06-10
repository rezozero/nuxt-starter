import EventType from '~/constants/event-type'

export function usePageTransitionEvent(event: EventType, callback: () => void, options?: { keepListener: boolean }) {
    onBeforeMount(() => {
        eventBus[options?.keepListener ? 'on' : 'once'](event, callback)
    })

    onBeforeUnmount(() => {
        eventBus.off(event, callback)
    })
}
