import { useMediaQuery } from '@vueuse/core'
import { breakpoints } from '~/utils/breakpoints-ts'

export const useIsMinWidth = (keyName: keyof typeof breakpoints): Ref<boolean> => {
    return useMediaQuery(`(min-width: ${breakpoints[keyName]}px)`)
}
