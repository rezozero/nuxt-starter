module.exports = {
    root: true,
    extends: [
        '@nuxt/eslint-config',
        // @see https://github.com/prettier/eslint-plugin-prettier#recommended-configuration
        'plugin:prettier/recommended',
    ],
    rules: {
        'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
        'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
        '@typescript-eslint/ban-ts-ignore': 'off',
        '@typescript-eslint/ban-ts-comment': 'off',
        'vue/require-default-prop': 'off', // props could be undefined
        'vue/padding-line-between-blocks': 'warn',
        'vue/multi-word-component-names': 'off', // this gonna disappear in the next version
    },
}
