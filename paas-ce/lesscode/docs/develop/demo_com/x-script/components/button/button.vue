<template>
    <button :title="title" :disabled="disabled" :class="[buttonCls, extCls]" :type="nativeType" @click="handleClick" v-bind="$attrs">
        <div class="bk-button-loading" v-if="loading">
            <div class="bounce1"></div>
            <div class="bounce2"></div>
            <div class="bounce3"></div>
            <div class="bounce4"></div>
        </div>
        <div :class="loading ? 'bk-loading-wrapper' : ''">
            <i class="bk-icon left-icon" :class="['icon-' + iconType, iconType === 'loading' ? 'bk-button-icon-loading' : '']" v-if="iconType">
                <template v-if="iconType === 'loading'">
                    <span class="loading"></span>
                </template>
            </i>
            <span><slot></slot></span>
            <i class="bk-icon right-icon" :class="['icon-' + iconRightType, iconRightType === 'loading' ? 'bk-button-icon-loading' : '']" v-if="iconRightType">
                <template v-if="iconRightType === 'loading'">
                    <span class="loading"></span>
                </template>
            </i>
        </div>
    </button>
</template>

<script>
    export default {
        name: 'x-button',
        props: {
            // 按钮类型
            theme: {
                type: String,
                default: 'default',
                validator (value) {
                    if (['default', 'primary', 'warning', 'success', 'danger'].indexOf(value) < 0) {
                        console.error(`theme property is not valid: '${value}'`)
                        return false
                    }
                    return true
                }
            },
            // mouseover 按钮类型，当设置了此属性时，`theme` 和 `text` 失效
            hoverTheme: {
                type: String,
                default: '',
                validator (value) {
                    if (['', 'primary', 'warning', 'success', 'danger'].indexOf(value) < 0) {
                        console.error(`hoverTheme property is not valid: '${value}'`)
                        return false
                    }
                    return true
                }
            },
            // 尺寸
            size: {
                type: String,
                default: 'normal',
                validator (value) {
                    if (['small', 'normal', 'large'].indexOf(value) < 0) {
                        console.error(`size property is not valid: '${value}'`)
                        return false
                    }
                    return true
                }
            },
            // title 文案
            title: {
                type: String,
                default: ''
            },
            // 左侧图标，设置为 loading 的时候，会显示转圈的 loading 效果。
            icon: String,
            // 右侧图标，设置为 loading 的时候，会显示转圈的 loading 效果。
            iconRight: String,
            // 是否禁用
            disabled: Boolean,
            // 是否加载中
            loading: Boolean,
            // 是否显示反色按钮
            outline: Boolean,
            // 是否是文字按钮
            text: Boolean,
            nativeType: {
                type: String,
                default: 'button'
            },
            // 外部设置的 class name
            extCls: {
                type: String,
                default: ''
            }
        },
        data () {
            return {
                showSlot: true
            }
        },
        computed: {
            iconType () {
                let icon = this.icon || ''
                if (icon) {
                    if (icon.indexOf('icon') === 0) {
                        icon = icon.replace(/^(icon-)/, '')
                    }
                }
                return icon
            },
            iconRightType () {
                let iconRight = this.iconRight || ''
                if (iconRight) {
                    if (iconRight.indexOf('icon') === 0) {
                        iconRight = iconRight.replace(/^(icon-)/, '')
                    }
                }
                return iconRight
            },
            themeType () {
                if (this.text) {
                    return 'primary'
                }
                return this.theme
            },
            buttonCls () {
                return [
                    `bk-${this.themeType}`,
                    `bk-button-${this.size}`,
                    this.hoverTheme
                        ? `bk-button-hover bk-${this.hoverTheme}`
                        : (this.text ? 'bk-button-text' : 'bk-button'),
                    this.disabled ? 'is-disabled' : '',
                    this.loading ? 'is-loading' : '',
                    this.outline ? 'is-outline' : '',
                    !this.showSlot ? 'no-slot' : ''
                ]
            }
        },
        mounted () {
            this.showSlot = this.$slots.default !== undefined
        },
        methods: {
            /**
             * 点击事件
             *
             * @param {Object} e 事件对象
             */
            handleClick (e) {
                if (!this.disabled && !this.loading) {
                    this.$emit('click', e)
                    this.$el.blur()
                }
            }
        }
    }
</script>
<style>
    @import './button.css';
</style>
