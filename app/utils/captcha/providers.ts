import type { CaptchaProvider } from './providers/defineCaptchaProvider'

const modules = import.meta.glob('./providers/*.{js,ts}')
const captchaProviders: Record<string, () => Promise<{ default: CaptchaProvider }>> = {}

for (const path in modules) {
    const fileName = path.match(/\/([^/]+)\.(js|ts)$/)?.[1] // ProviderName or provider-name

    if (fileName) {
        Object.assign(captchaProviders, { [fileName]: modules[path] })
    }
}

export { captchaProviders }
