/**
 * @see https://github.com/JetBrains/svg-sprite-loader/blob/master/lib/runtime-generator.js
 * @see https://github.com/JetBrains/svg-sprite-loader/blob/master/examples/custom-runtime-generator/svg-to-icon-component-runtime-generator.js
 * @see https://github.com/Akimyou/svg-sprite-vue-generator/blob/master/lib/svg-sprite-vue-generator.js
 * @see https://github.com/visualfanatic/vue-svg-loader/blob/dev/index.js
 */
const { generateSpritePlaceholder, stringify } = require('svg-sprite-loader/lib/utils')

module.exports = function runtimeGenerator({ symbol, loaderContext }) {
    const publicPath = loaderContext._compiler.options.output.publicPath
    const spritePlaceholder = generateSpritePlaceholder(symbol.request.file)
    const viewBoxParts = symbol.viewBox.split(' ')
    const width = parseInt(viewBoxParts[2], 10)
    const height = parseInt(viewBoxParts[3], 10)
    const viewBox = stringify(symbol.viewBox)
    const href = publicPath + spritePlaceholder

    return `
        module.exports = {
          functional: true,
          viewBox: ${viewBox},
          href: '${href}',
          width: '${width}',
          height: '${height}',
          render: function(h, context) {
            return h('svg',
                {
                    attrs: {
                        viewBox: ${stringify(symbol.viewBox)},
                        width: context.props.width || ${width},
                        height: context.props.height || ${height},
                    },
                    class: context.data.class || '',
                }, [
              h('use', { attrs: { 'xlink:href': '${href}' } })
            ]);
          }
        };
    `
}
