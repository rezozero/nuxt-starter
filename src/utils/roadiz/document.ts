import { RoadizDocument } from '@roadiz/abstract-api-client/dist/types/roadiz'

export function isMp4(document: RoadizDocument | undefined): boolean {
    return document?.mimeType === 'video/mp4'
}

export function isSvg(document: RoadizDocument | undefined): boolean {
    return document?.mimeType === 'image/svg+xml'
}

export function isEmbed(document: RoadizDocument | undefined): boolean {
    return typeof document?.embedId !== 'undefined'
}

export function isVideoEmbed(document: RoadizDocument | undefined): boolean {
    return isEmbed(document) && (document?.embedPlatform === 'vimeo' || document?.embedPlatform === 'youtube')
}

export function isVideo(document: RoadizDocument | undefined): boolean {
    return isVideoEmbed(document) || isMp4(document)
}

export function isImage(document: RoadizDocument | undefined): boolean {
    return document?.processable === true
}

export function isAudio(document: RoadizDocument | undefined): boolean {
    return (
        document?.mimeType === 'audio/mpeg' ||
        document?.mimeType === 'audio/mp3' ||
        (isEmbed(document) &&
            !!document?.embedPlatform &&
            ['deezer', 'spotify', 'soundcloud'].includes(document.embedPlatform))
    )
}

export function isDocument(document: RoadizDocument | undefined): boolean {
    return !isAudio(document) && !isImage(document) && isEmbed(document) && !isVideo(document)
}
