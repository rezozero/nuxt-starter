import type { IReCaptchaComposition } from 'vue-recaptcha-v3'
import { useReCaptcha, VueReCaptcha } from 'vue-recaptcha-v3'

export function useRecaptchaState() {
    const recaptchaKey = useRuntimeConfig().public.recaptcha.siteKey
    const nuxtApp = useNuxtApp()

    const recaptcha = useState<IReCaptchaComposition | undefined>('recaptchaInstance', () => undefined)

    const init = () => {
        if (recaptcha.value) return

        nuxtApp.vueApp.use(VueReCaptcha, {
            siteKey: recaptchaKey,
            loaderOptions: {
                autoHideBadge: true,
            },
        })

        recaptcha.value = useReCaptcha()
    }
    return { recaptcha, init }
}
