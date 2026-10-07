import VueSkipTo from '@vue-a11y/skip-to'
import '@vue-a11y/skip-to/dist/style.css'

declare module 'vue' {
    interface GlobalComponents {
        VueSkipTo: ComponentPublicInstance
    }
}

export default defineNuxtPlugin((nuxtApp) => {
    nuxtApp.vueApp.use(VueSkipTo)
})
