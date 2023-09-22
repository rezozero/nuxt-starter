export default defineNuxtConfig({
    extends: ['github:rezozero/nuxt3-layer'],
    css: ['~/assets/scss/main.scss'],
    // https://github.com/storybook-vue/storybook-nuxt/issues/57
    components: [
        '~/components/atoms',
        '~/components/molecules',
        '~/components/organisms',
        { path: '~/components/blocks/', global: true },
    ],
    // https://nuxt.com/docs/api/configuration/nuxt-config#vite
    vite: {
        css: {
            preprocessorOptions: {
                scss: {
                    additionalData: `@import "~/assets/scss/_style-resources.scss";`,
                },
            },
        },
    },
})
