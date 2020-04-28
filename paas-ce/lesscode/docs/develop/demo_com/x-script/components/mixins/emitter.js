/**
 * @file emitter mixin
 *
 * Copyright © 2012-2019 Tencent BlueKing. All Rights Reserved. 蓝鲸智云 版权所有
 */

export default {
    methods: {
        dispatch (componentName, eventName, params) {
            let parent = this.$parent || this.$root
            let name = parent.$options.name

            while (parent && (!name || name !== componentName)) {
                parent = parent.$parent

                if (parent) {
                    name = parent.$options.name
                }
            }
            if (parent) {
                parent.$emit.apply(parent, [eventName].concat(params))
            }
        }
    }
}
