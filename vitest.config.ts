import { defineConfig } from 'vitest/config'

export default defineConfig({
    define: {
        // Nuxt replaces it at build time; tests run the server branch.
        'import.meta.server': true,
    },
})
