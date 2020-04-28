/**
 * @file loading entry
 *
 * Copyright © 2012-2019 Tencent BlueKing. All Rights Reserved. 蓝鲸智云 版权所有
 */

import Loading from './loading.js'
import directive from './directive.js'

export default {
    Loading,
    directive,
    install: Vue => {
        Vue.directive('bkloading', directive)
    }
}
