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
    <transition name="fade" @after-leave="animationFinish">
        <div class="bk-loading" :class="extCls" v-show="isShow"
            :style="{
                position: type === 'directive' ? 'absolute' : 'fixed',
                backgroundColor: bgColor
            }">
            <div class="bk-loading-wrapper">
                <div :class="computedClass">
                    <div class="point point1"></div>
                    <div class="point point2"></div>
                    <div class="point point3"></div>
                    <div class="point point4"></div>
                </div>
                <div class="bk-loading-title">
                    <slot>{{title}}</slot>
                </div>
            </div>
        </div>
    </transition>
</template>
<script>
    /**
     *  bk-loading
     *  @module components/loading
     *  @desc 加载组件
     *  @param title {String，VNode} - 加载时的文案显示
     *  @example
        this.$bkLoading() or
        this.$bkLoading('加载中') or
        this.$bkLoading({
          title: this.$createElement('span', '加载中')
        })
     */
    export default {
        name: 'bk-loading',
        data () {
            return {
                timer: 0,
                opacity: -1,
                color: '#ffffff',
                isShow: false,
                hide: false,
                title: '',
                type: 'full',
                size: 'large',
                theme: 'colorful',
                delay: 0,
                extCls: ''
            }
        },
        computed: {
            bgColor () {
                const color = this.color.replace(/\s/gm, '')
                if (/^#([A-Fa-f0-9]{3}){1,2}$/.test(color)) {
                    let colors = color.substring(1).split('')
                    if (colors.length === 3) {
                        colors = [colors[0], colors[0], colors[1], colors[1], colors[2], colors[2]]
                    }
                    colors = '0x' + colors.join('')
                    return 'rgba(' + [(colors >> 16) & 255, (colors >> 8) & 255, colors & 255].join(',') + `,${this.opacity})`
                } else if (/^rgba?\(([^\)]+)\)/.test(color)) {
                    return color.replace(/^rgb\(([^\)]+)\)/, `rgba($1,${this.opacity})`)
                }
                return this.color
            },
            computedClass () {
                return `bk-loading1 bk-${this.theme} bk-size-${this.size}`
            }
        },
        watch: {
            hide (newVal) {
                if (newVal) {
                    const delay = isNaN(this.delay) ? 0 : Number(this.delay)
                    clearTimeout(this.timer)
                    if (delay > 0) {
                        this.timer = setTimeout(() => {
                            this.hideLoading()
                        }, delay)
                    } else {
                        this.hideLoading()
                    }
                }
            }
        },
        mounted () {
            this.hide = false
        },
        methods: {
            hideLoading () {
                this.isShow = false
                this.$el.addEventListener('transitionend', this.destroyEl)
            },
            destroyEl () {
                this.$el.removeEventListener('transitionend', this.destroyEl)
                this.$destroy()
                this.$el.parentNode.removeChild(this.$el)
            },
            /**
             * .bk-dialog after-leave 回调，弹框消失的动画结束后触发
             */
            animationFinish () {
                if (this.afterLeave && typeof this.afterLeave === 'function') {
                    this.afterLeave()
                }
            }
        }
    }
</script>
<style>
    @import './loading.css';
</style>
