import type { ComputedRef, InjectionKey } from 'vue'
import { provide } from 'vue'
import type { ThemeOptions, ThemeProps } from '~~/types/theme'

export const THEME_PROVIDER_KEY: InjectionKey<ComputedRef<ThemeProps['theme']>> = Symbol('themeProviderKey')

export function useThemeProvider(options?: ThemeOptions) {
    const { activeTheme, themeClass } = useTheme(options)

    const providedTheme = computed(() => {
        return activeTheme.value
    })

    provide(THEME_PROVIDER_KEY, providedTheme)

    return { providedTheme, activeTheme, themeClass }
}
