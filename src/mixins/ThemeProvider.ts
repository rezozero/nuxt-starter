import mixins from 'vue-typed-mixins'
import Themeable from '~/mixins/Themeable'

export type ThemeProviderTheme = Theme | undefined | false

export interface ThemeProviderInject {
    theme(): ThemeProviderTheme
}

export default mixins(Themeable).extend({
    provide(): ThemeProviderInject {
        return {
            theme: this.getProvidedTheme,
        }
    },
    methods: {
        getProvidedTheme(): ThemeProviderTheme {
            return this.activeTheme
        },
    },
})
