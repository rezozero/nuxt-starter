import { captchaProviderInputs, captchaProviders } from '~/utils/captcha/providers'

export function getInputName(name: string) {
    return Object.keys(captchaProviderInputs)
        .find(key => key === name) as keyof typeof captchaProviderInputs | undefined
}

export function getProviderNameByInputName(inputName: string) {
    const validName = getInputName(inputName)
    if (!validName) return undefined

    return captchaProviderInputs[validName]
}

export function getProviderByInputName(inputName: string, token: string) {
    if (!token) return

    const name = getProviderNameByInputName(inputName)
    return name ? captchaProviders[name] : undefined
}
