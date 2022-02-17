import breakpoints from '@/scss/export/_breakpoints.scss'

export function getBreakpointValue(breakpoint: string) {
    return parseInt(breakpoints['breakpoint-' + breakpoint])
}

export function mediaIsMin(breakpoint: string): boolean {
    return window.innerWidth >= getBreakpointValue(breakpoint)
}

export function mediaIsMax(breakpoint: string): boolean {
    return window.innerWidth <= getBreakpointValue(breakpoint)
}

export function mediaIsLessThan(breakpoint: string): boolean {
    return window.innerWidth < getBreakpointValue(breakpoint)
}
