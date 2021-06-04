/**
 * @file highlight.js 设置高亮语言，默认的加载的语言太多了
 *
 * Copyright © 2012-2019 Tencent BlueKing. All Rights Reserved. 蓝鲸智云 版权所有
 */

const hljs = require('highlight.js/lib/highlight')
const bash = require('highlight.js/lib/languages/bash')
const css = require('highlight.js/lib/languages/css')
const javascript = require('highlight.js/lib/languages/javascript')

hljs.registerLanguage('bash', bash)
hljs.registerLanguage('css', css)
hljs.registerLanguage('javascript', javascript)

module.exports = hljs
