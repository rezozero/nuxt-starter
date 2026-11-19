import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vitest/config'

export default defineConfig({
    define: {
        // Nuxt replaces it at build time; tests run the server branch.
        'import.meta.server': true,
    },
    resolve: {
        alias: {
            // Same as the Nuxt `~` alias, for the app files imported by tests
            '~': fileURLToPath(new URL('./app', import.meta.url)),
        },
    },
})
