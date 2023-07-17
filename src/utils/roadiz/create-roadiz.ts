import RoadizApi from '@roadiz/abstract-api-client'
import { joinURL } from 'ufo'
import toBoolean from '../to-boolean'

export default function () {
    return new RoadizApi(
        joinURL(process.env.API_URL || process.env.BASE_URL || '', process.env.API_ENDPOINT_PREFIX || ''),
        {
            apiKey: process.env.API_KEY,
            preview: toBoolean(process.env.API_PREVIEW),
            debug: toBoolean(process.env.API_DEBUG),
        }
    )
}
