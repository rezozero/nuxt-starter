import type { ComputedRef, InjectionKey } from 'vue'
import { provide } from 'vue'
import type { AppTheme, ThemeOptions } from '~~/types/theme'

export const THEME_PROVIDER_KEY: InjectionKey<ComputedRef<AppTheme>> = Symbol('themeProviderKey')

export function useThemeProvider(options?: ThemeOptions) {
    const { activeTheme, themeClass } = useTheme(options)

    const providedTheme = computed(() => {
        return activeTheme.value
    })

    provide(THEME_PROVIDER_KEY, providedTheme)

    return { providedTheme, activeTheme, themeClass }
}
