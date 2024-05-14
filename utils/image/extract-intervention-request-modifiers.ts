import interventionRequestProps from '~/utils/image/intervention-request-props'

type InterventionRequestModifiers = Partial<typeof interventionRequestProps>

export function extractInterventionRequestModifiers(
    source: Record<string, unknown>,
    excludedKeys: string[] = ['width', 'height']
) {
    const interventionRequestKeys = Object.keys(interventionRequestProps)

    return Object.keys(source).reduce<InterventionRequestModifiers>((acc, key) => {
        if (interventionRequestKeys.includes(key) && !excludedKeys.includes(key)) {
            // @ts-ignore don't know how to type `key` in `acc[key]`
            acc[key] = source[key]
        }

        return acc
    }, {})
}
