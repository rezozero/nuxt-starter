import Vue from 'vue'
import type { PropType, VueConstructor } from 'vue'
import { ThemeProviderInject } from '~/mixins/ThemeProvider'

interface Inject {
    injectedTheme: ThemeProviderInject['theme']
}

export type PreferredTheme = Theme | null | undefined

export default (Vue as VueConstructor<Vue & Inject>).extend({
    inject: {
        injectedTheme: {
            from: 'theme',
            default: () => {},
        },
    },
    props: {
        theme: [String, Boolean] as PropType<Theme | false | null>,
    },
    computed: {
        // theme used if no other theme value is defined
        defaultTheme(): Theme {
            return 'light'
        },
        // theme used before any other theme value
        preferredTheme(): PreferredTheme {
            return null
        },
        activeTheme(): Theme | undefined | false {
            return this.preferredTheme || this.theme || this.injectedTheme?.() || this.defaultTheme
        },
        themeClass(): string | false {
            return (
                typeof this.activeTheme === 'string' && !!this.$style && this.$style['root--theme-' + this.activeTheme]
            )
        },
    },
})
