import defu from 'defu'
import config from './nuxt.config'

export default defu(
    {
        // https://fr.nuxtjs.org/docs/2.x/configuration-glossary/configuration-runtime-config/
        publicRuntimeConfig: {
            interventionRequest: {
                baseUrl: process.env.INTERVENTION_REQUEST_BASE_URL || 'http://localhost:8086/assets',
            },
            apiURL: '/',
        },
        // https://github.com/rezozero/intervention-request-provider
        image: {
            providers: {
                interventionRequest: {
                    options: {
                        imagesPath: 'images',
                    },
                },
            },
        },
    },
    config
)
