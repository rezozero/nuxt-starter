module.exports = {
    root: true,
    env: {
        browser: true,
        node: true,
    },
    extends: ['@nuxtjs/eslint-config-typescript', 'prettier', 'plugin:prettier/recommended', 'plugin:nuxt/recommended'],
    plugins: ['prettier'],
    rules: {
        // deactivate temp because of this issue https://github.com/typescript-eslint/typescript-eslint/issues/2477
        'no-undef': 'off',
        'no-use-before-define': 'off',
        'vue/require-default-prop': 'off',
        // We possibly use CommonJS import
        'no-var-requires': 'off',
        '@typescript-eslint/no-var-requires': 'off',
        // TypeScript compilation already ensures that named imports exist in the referenced module
        'import/named': 'off',
    },
}
