let result: boolean

function compute() {
    const ua = window.navigator.userAgent.toLowerCase()

    result = ua.includes('safari') && !ua.includes('chrome') && !ua.includes('android')
}

export function isSafari(): boolean {
    if (!result) compute()

    return result
}
