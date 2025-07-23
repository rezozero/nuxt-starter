import breakpoints from '~/assets/scss/export/_breakpoints.module.scss'

export function getBreakpointValue(breakpoint: string) {
    return parseInt(breakpoints['breakpoint-' + breakpoint])
}

export function mediaIsMin(breakpoint: string, windowWidth?: number): boolean {
    return (windowWidth || window.innerWidth) >= getBreakpointValue(breakpoint)
}

export function mediaIsMax(breakpoint: string, windowWidth?: number): boolean {
    return (windowWidth || window.innerWidth) <= getBreakpointValue(breakpoint)
}

export function mediaIsLessThan(breakpoint: string, windowWidth?: number): boolean {
    return (windowWidth || window.innerWidth) < getBreakpointValue(breakpoint)
}
