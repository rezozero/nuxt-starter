type ScriptAttributes = {
    [key: string]: string | boolean
    id: string
    src: string
}

export default async function injectScript(scriptAttributes: ScriptAttributes) {
    const currentScript = document.getElementById(scriptAttributes.id)
    if (currentScript) {
        return currentScript
    }

    return new Promise((resolve, reject) => {
        const script = document.createElement('script')
        for (const key in scriptAttributes) {
            Object.assign(script, { [key]: scriptAttributes[key] })
        }

        script.onload = () => resolve(script)
        script.onerror = reject
        document.head.appendChild(script)
    })
}
