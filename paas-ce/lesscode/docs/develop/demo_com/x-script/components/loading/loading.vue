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
