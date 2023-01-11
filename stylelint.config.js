module.exports = {
    extends: [
        'stylelint-config-standard',
        'stylelint-config-idiomatic-order',
        'stylelint-config-css-modules',
        'stylelint-config-prettier',
    ],
    plugins: ['stylelint-scss', 'stylelint-order'],
    // add your custom config here
    // https://stylelint.io/user-guide/configuration
    rules: {
        'no-descending-specificity': null,
        // Conflict with prettier (eslint)
        indentation: [4, { ignore: ['value'] }],
        'at-rule-no-unknown': null,
        'scss/at-rule-no-unknown': true,
        // sass context: @use + @import
        // https://github.com/stylelint/stylelint/issues/5133
        'no-invalid-position-at-import-rule': null,
    },
    defaultSeverity: 'warning',
}
