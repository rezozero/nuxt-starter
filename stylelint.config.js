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
        indentation: 4,
        'at-rule-no-unknown': null,
        'scss/at-rule-no-unknown': true,
    },
    defaultSeverity: 'warning',
}
