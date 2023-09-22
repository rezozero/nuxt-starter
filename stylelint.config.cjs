module.exports = {
    extends: [
        // 'stylelint-config-standard',
        'stylelint-config-standard-scss',
        'stylelint-config-standard-vue/scss',
        'stylelint-config-idiomatic-order',
        'stylelint-config-css-modules',
        // 'stylelint-config-prettier',
    ],
    // plugins: ['stylelint-scss'],
    // https://stylelint.io/user-guide/configuration
    rules: {
        'no-descending-specificity': null,
        'at-rule-no-unknown': null,
        'scss/at-rule-no-unknown': true,
        // sass context: @use + @import
        // https://github.com/stylelint/stylelint/issues/5133
        'no-invalid-position-at-import-rule': null,
        // BEM like selector
        'selector-class-pattern': '^.[a-z]([a-z0-9-]+)?(__([a-z0-9]+-?)+)?(--([a-z0-9]+-?)+){0,2}$',
        'scss/no-global-function-names': null, // use global functions / variables / functions
        'scss/comment-no-empty': null,
    },
    defaultSeverity: 'warning',
    ignoreFiles: ['./assets/scss/vendors/_tarteaucitron.scss', './assets/scss/vendors/_orejime.scss'],
}
