import type { RoadizAlternateLink } from '@roadiz/types'
import { b64DecodeUnicode } from '~/utils/string/b64-decode-unicode'

export function getResponseAlternateLinks(links: string): Array<RoadizAlternateLink> {
    return links
        .split(',')
        .filter((link: string) => {
            return link
                .split(';')
                .map(attribute => attribute.trim())
                .includes('type="text/html"')
        })
        .map((link: string) => {
            const attributes = link.split(';')
            const title = attributes[3]?.split('title="').join('').split('"').join('').trim() || undefined

            return {
                url: attributes[0].split('<').join('').split('>').join('').trim(),
                locale: attributes[2].split('hreflang="').join('').split('"').join('').trim(),
                // Must decode translation name from base64 because headers are ASCII only
                title: title ? b64DecodeUnicode(title) : undefined,
            } as RoadizAlternateLink
        })
}
