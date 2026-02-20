import type { MaybeRefOrGetter } from 'vue'

export type Theme = 'light' | 'dark'

export interface ThemeProps {
    theme?: Theme | false | null
}
export interface ThemeOptions {
    props?: ThemeProps
    preferredTheme?: MaybeRefOrGetter<ThemeProps['theme']>
}
