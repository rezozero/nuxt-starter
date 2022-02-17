import { RoadizDocument } from '@roadiz/abstract-api-client/dist/types/roadiz'

export function isRoadizMp4(document: RoadizDocument | undefined): boolean {
    return document?.mimeType === 'video/mp4'
}

export function isRoadizSvg(document: RoadizDocument | undefined): boolean {
    return document?.mimeType === 'image/svg+xml'
}

export function isRoadizEmbed(document: RoadizDocument | undefined): boolean {
    return typeof document?.embedId !== 'undefined'
}

export function isRoadizVideoEmbed(document: RoadizDocument | undefined): boolean {
    return isRoadizEmbed(document) && (document?.embedPlatform === 'vimeo' || document?.embedPlatform === 'youtube')
}

export function isRoadizVideo(document: RoadizDocument | undefined): boolean {
    return isRoadizVideoEmbed(document) || isRoadizMp4(document)
}

export function isRoadizImage(document: RoadizDocument | undefined): boolean {
    return document?.processable === true
}
