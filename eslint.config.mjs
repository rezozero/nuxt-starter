import withNuxt from './.nuxt/eslint.config.mjs'

export default withNuxt(
    {
        ignores: ['dist', '.output'],
    },
).append({
    files: ['**/*.stories.vue'],
    rules: {
        'vue/multi-word-component-names': 'off',
    },
})
