import type { MaybeRefOrGetter } from 'vue'

export type AppTheme = 'light' | 'dark'
export type ThemeValue = AppTheme | false | null
export interface ThemeProps {
    theme?: ThemeValue
}
export interface ThemeOptions {
    props?: ThemeProps
    preferredTheme?: MaybeRefOrGetter<ThemeValue>
}
