import type { RoadizDocument } from '@roadiz/types'
import type { VideoSource } from '~/utils/video/video-props'

// Any format a `<video>` plays, webm as much as mp4
export function isNativeVideo(document: RoadizDocument | undefined): boolean {
    return !!document?.mimeType?.startsWith('video/')
}

export function isSvg(document: RoadizDocument | undefined): boolean {
    return document?.mimeType === 'image/svg+xml'
}

export function isEmbed(document: RoadizDocument | undefined): boolean {
    return typeof document?.embedId !== 'undefined'
}

export function isVideoEmbed(document: RoadizDocument | undefined): boolean {
    const videoPlatforms = ['vimeo', 'youtube', 'dailymotion', 'ted', 'twitch']
    const platform = document?.embedPlatform?.toLowerCase()
    return isEmbed(document) && !!platform && videoPlatforms.includes(platform)
}

export function isVideo(document: RoadizDocument | undefined): boolean {
    return isVideoEmbed(document) || isNativeVideo(document)
}

export function isImage(document: RoadizDocument | undefined): boolean {
    return document?.processable === true || isSvg(document)
}

export function isPDF(document: RoadizDocument | undefined): boolean {
    return document?.mimeType === 'application/pdf'
}

export function isAudio(document: RoadizDocument | undefined): boolean {
    const platform = document?.embedPlatform?.toLowerCase()
    return (
        document?.mimeType === 'audio/mpeg'
        || document?.mimeType === 'audio/mp3'
        || (isEmbed(document) && !!platform && ['deezer', 'spotify', 'soundcloud'].includes(platform))
    )
}

export function isDocument(document: RoadizDocument | undefined): boolean {
    return !isAudio(document) && !isImage(document) && isEmbed(document) && !isVideo(document)
}

// The document then its alternative formats, all under the same media query
export function getVideoSources(document: RoadizDocument | undefined, media?: string): VideoSource[] {
    if (!document) return []

    return [document, ...(document.altSources || [])]
        .filter(file => !!file.relativePath)
        .map(file => ({ src: file.relativePath as string, type: file.mimeType, media }))
}
