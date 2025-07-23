import { provide } from 'vue'
import type { ComputedRef, InjectionKey } from 'vue'
import type { Theme, ThemeOptions } from '~/composables/use-theme'

export const THEME_PROVIDER_KEY: InjectionKey<ComputedRef<Theme | 'light'>> = Symbol('themeProviderKey')

export function useThemeProvider(options?: ThemeOptions) {
    const { activeTheme, themeClass } = useTheme(options)

    const providedTheme = computed(() => {
        return activeTheme.value
    })

    provide(THEME_PROVIDER_KEY, providedTheme)

    return { providedTheme, activeTheme, themeClass }
}
