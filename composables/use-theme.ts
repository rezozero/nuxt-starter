import { inject } from 'vue'
import type { MaybeRefOrGetter } from 'vue'
import { THEME_PROVIDER_KEY } from '~/composables/use-theme-provider'
import appConfig from '~/app.config'

export type Theme = (typeof appConfig)['themes'][number]

export interface ThemeProps {
    theme?: Theme | false | null
}

export interface ThemeOptions {
    props?: ThemeProps
    preferredTheme?: MaybeRefOrGetter<Theme | false | null>
}

export function useTheme(options?: ThemeOptions) {
    const injectedTheme = inject(THEME_PROVIDER_KEY, null)
    const $style = useCssModule()

    const activeTheme = computed(() => {
        return toValue(options?.preferredTheme) || options?.props?.theme || injectedTheme?.value || 'light'
    })

    const themeClass = computed(() => {
        return activeTheme.value && !!$style && $style['root--theme-' + activeTheme.value]
    })

    return { activeTheme, themeClass }
}
