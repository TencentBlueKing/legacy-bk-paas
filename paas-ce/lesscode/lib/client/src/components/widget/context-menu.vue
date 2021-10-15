<template>
    <div :style="style" style="display: block;" v-show="show"
        @mousedown.stop
        @contextmenu.prevent
    >
        <slot></slot>
    </div>
</template>

<script>
    import { bus } from '@/common/bus'
    export default {
        name: 'context-menu',
        props: {
            target: null,
            show: Boolean,
            offset: {
                type: Object,
                default: () => ({
                    x: 0,
                    y: 0
                })
            }
        },
        data () {
            return {
                triggerShowFn: () => {},
                triggerHideFn: () => {},
                x: null,
                y: null,
                style: {},
                binded: false
            }
        },
        watch: {
            show (show) {
                if (show) {
                    this.bindHideEvents()
                } else {
                    this.unbindHideEvents()
                }
            },
            target (target) {
                this.bindEvents()
            }
        },
        mounted () {
            this.bindEvents()
        },
        methods: {
            // 初始化事件
            bindEvents () {
                this.$nextTick(() => {
                    if (!this.target || this.binded) return
                    this.triggerShowFn = this.contextMenuHandler.bind(this)
                    this.target.addEventListener('contextmenu', this.triggerShowFn)
                    this.binded = true
                    bus.$on('hideContextMenu', () => {
                        this.$emit('update:show', false)
                    })
                })
            },

            // 取消绑定事件
            unbindEvents () {
                if (!this.target) return
                this.target.removeEventListener('contextmenu', this.triggerShowFn)
            },

            // 绑定隐藏菜单事件
            bindHideEvents () {
                this.triggerHideFn = this.clickDocumentHandler.bind(this)
                document.addEventListener('mousedown', this.triggerHideFn)
                document.addEventListener('mousewheel', this.triggerHideFn)
            },

            // 取消绑定隐藏菜单事件
            unbindHideEvents () {
                document.removeEventListener('mousedown', this.triggerHideFn)
                document.removeEventListener('mousewheel', this.triggerHideFn)
            },

            // 鼠标按压事件处理器
            clickDocumentHandler (e) {
                this.$emit('update:show', false)
            },

            // 右键事件事件处理
            contextMenuHandler (e) {
                this.$emit('update:show', false) // 先隐藏所有右键菜单

                e.preventDefault()

                setTimeout(() => {
                    this.x = e.clientX + this.offset.x
                    this.y = e.clientY + this.offset.y
                    this.style = {
                        left: this.x + 'px',
                        top: this.y + 'px'
                    }
                    this.$nextTick(() => {
                        this.$emit('update:show', true)
                    })
                }, 50)
            }
        }
    }
</script>
