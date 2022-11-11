import defu from 'defu'
import config from './nuxt.config'

export default defu(
    {
        // https://fr.nuxtjs.org/docs/2.x/configuration-glossary/configuration-runtime-config/
        publicRuntimeConfig: {
            interventionRequest: {
                baseUrl: 'http://localhost:8080/assets',
            },
            apiURL: '/',
        },
    },
    config
)
