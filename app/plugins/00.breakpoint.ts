export default defineNuxtPlugin(() => {
    return {
        provide: {
            breakpoint: (value: string) => getBreakpointValue(value),
        },
    }
})
