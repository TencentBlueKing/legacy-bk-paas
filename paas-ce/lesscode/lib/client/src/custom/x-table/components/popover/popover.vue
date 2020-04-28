<!--
  Tencent is pleased to support the open source community by making 蓝鲸智云PaaS平台社区版 (BlueKing PaaS Community Edition) available.
  Copyright (C) 2017-2019 THL A29 Limited, a Tencent company. All rights reserved.
  Licensed under the MIT License (the "License"); you may not use this file except in compliance with the License.
  You may obtain a copy of the License at
  http://opensource.org/licenses/MIT
  Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on
  an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the
  specific language governing permissions and limitations under the License.
-->

<template>
    <div class="bk-tooltip">
        <div class="bk-tooltip-content" ref="html">
            <slot name="content">{{content}}</slot>
        </div>
        <div ref="reference" class="bk-tooltip-ref">
            <slot></slot>
        </div>
    </div>
</template>

<script>
    import Tippy, { getValidTippyProps } from '../utils/tippy'
    import zIndex from '../mixins/z-index'
    import popManager from '../utils/pop-manager.js'
    export default {
        name: 'x-popover',
        mixins: [zIndex],
        props: {
            placement: {
                type: String,
                default: 'top'
            },
            content: {
                type: String,
                default: ''
            },
            theme: {
                type: String,
                default: 'dark'
            },
            interactive: {
                type: [Boolean, String],
                default: true
            },
            arrow: {
                type: [Boolean, String],
                default: true
            },
            arrowType: {
                type: String,
                default: 'sharp'
            },
            showOnInit: {
                type: Boolean,
                default: false
            },
            arrowTransform: {
                type: String,
                default: ''
            },
            trigger: {
                type: String,
                default: 'mouseenter focus'
            },
            animation: {
                type: String,
                default: 'shift-away'
            },
            distance: {
                type: Number,
                default: 10
            },
            width: {
                type: [String, Number],
                default: 'auto'
            },
            maxWidth: {
                type: [String, Number],
                default: 'auto'
            },
            offset: {
                type: [Number, String],
                default: 0
            },
            always: {
                type: Boolean,
                default: false
            },
            followCursor: {
                type: [Boolean, String],
                default: false
            },
            sticky: {
                type: [Boolean, String],
                default: false
            },
            delay: {
                type: Number,
                default: 100
            },
            size: {
                type: String,
                default: 'small'
            },
            onShow: {
                type: Function,
                default () {}
            },
            onHide: {
                type: Function,
                default () {}
            },
            tippyOptions: {
                type: Object,
                default () {
                    return {}
                }
            },
            // 外部设置的 class name
            extCls: {
                type: String,
                default: ''
            },
            disabled: Boolean
        },
        data () {
            return {
                instance: null
            }
        },
        watch: {
            disabled (disabled) {
                if (this.instance) {
                    disabled ? this.instance.disable() : this.instance.enable()
                }
            }
        },
        mounted () {
            const options = getValidTippyProps(Object.assign({}, this.tippyOptions, { appendTo: popManager.container }, this.$props))
            const onShow = options.onShow
            const onHide = options.onHide
            options.onShow = tip => {
                tip.set({ zIndex: this.getLocalZIndex() })
                onShow && onShow(tip)
                this.$emit('show')
            }
            options.onHide = tip => {
                onHide && onHide(tip)
                this.$emit('hide')
            }
            options.content = this.$refs.html
            if (this.always) {
                options.showOnInit = true
                options.hideOnClick = false
                options.trigger = 'manual'
            }
            this.instance = Tippy(this.$refs.reference, options)
            if (this.disabled) {
                this.instance.disable()
            }
        },
        updated () {
            this.instance.setContent(this.$refs.html)
            if (this.instance.popperInstance) {
                this.instance.popperInstance.update()
            }
        },
        beforeDestroy () {
            this.instance.destroy()
        },
        methods: {
            showHandler () {
                this.instance.show()
            },
            hideHandler () {
                this.instance.hide()
            }
        }
    }
</script>

<style>
    @import './popover.css';
</style>
