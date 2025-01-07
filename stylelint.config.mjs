export default {
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
        'selector-class-pattern': '^[a-z]([-]?[a-z0-9]+)*(__[a-z0-9]([-]?[a-z0-9]+)*)*(--[a-z0-9]([-]?[a-z0-9]+)*)?$',
        'scss/no-global-function-names': null, // use global functions / variables / functions
        'scss/comment-no-empty': null,
        'function-no-unknown': null, // we use SCSS global imports for functions
        'scss/function-no-unknown': null, // we use SCSS global imports for functions
        'color-function-notation': null, // do not change rgba() to rgb()
        'no-duplicate-selectors': null, // The & selector is considering as duplicate. See https://github.com/stylelint/stylelint/issues/7893
        'at-rule-empty-line-before': [
            'always',
            {
                except: ['blockless-after-same-name-blockless', 'first-nested'],
                ignore: ['after-comment', 'blockless-after-same-name-blockless'],
                ignoreAtRules: ['else'],
            },
        ],
    },
    defaultSeverity: 'warning',
    ignoreFiles: ['./assets/scss/vendors/_tarteaucitron.scss', './assets/scss/vendors/_orejime.scss', './dist/**/*.css'],
}
