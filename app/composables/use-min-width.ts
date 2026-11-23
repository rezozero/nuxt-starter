import { getBreakpointValue } from '~/utils/media'

export type Breakpoint = 'xs' | 'sm' | 'md' | 'lg' | 'vl' | 'xl' | 'xxl' | 'hd' | 'qhd'

/**
 * Checks if the viewport width is greater than or equal to the specified breakpoint
 */
export function useMinWidth(breakpoint: Breakpoint) {
    return useMediaQuery(`(min-width: ${getBreakpointValue(breakpoint)}px)`)
}
