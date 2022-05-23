<template>
    <vue-draggable
        ref="draggable"
        :class="$style['drag-area']"
        :list="list"
        :group="dragGroup"
        :chosen-class="$style['chosen']"
        :ghost-class="ghostClass || $style['ghost']"
        :style="styles"
        filter="[data-render-drag='disabled']"
        @choose="handleChoose"
        @unchoose="handleUnchoose"
        @start="handleStart"
        @end="handleEnd"
        @add="handleAdd"
        @onSort="handleSort"
        @change="handleChange"
        v-bind="$attrs"
        v-on="$listeners">
        <slot />
    </vue-draggable>
</template>
<script>
    import LC from '@/element-materials/core'
    import { setMousedown } from '../resolve-component'

    export default {
        name: 'render-draggable',
        inheritAttrs: false,
        props: {
            list: {
                type: Array,
                required: false,
                default: null
            },
            componentData: {
                type: Object,
                required: true
            },
            ghostClass: String,
            group: {
                type: Object,
                required: true
            }
        },
        inject: ['attachToInteractiveComponent'],
        data () {
            return {
                dragGroup: this.group,
                styles: {}
            }
        },
        created () {
            if (!this.attachToInteractiveComponent) {
                const dragableCheck = (event) => {
                    /**
                     * 交互式组件状态更新
                     * @description 当交互式组件激活时，不属于交互式组件的drag area不可拖动
                     *  只有关闭后，才可以继续拖拽
                     */
                    if (event.interactiveShow) {
                        this.dragGroup = Object.freeze({
                            pull: false,
                            put: false
                        })
                    } else {
                        this.dragGroup = this.group
                    }
                }
                const removeChildCallback = (event) => {
                    if (event.child.interactiveShow) {
                        this.dragGroup = this.group
                    }
                }
                LC.addEventListener('removeChild', removeChildCallback)
                LC.addEventListener('toggleInteractive', dragableCheck)
                this.$once('hook:beforeDestroy', () => {
                    LC.removeEventListener('removeChild', removeChildCallback)
                    LC.removeEventListener('toggleInteractive', dragableCheck)
                })
            }
        },
        mounted () {
            setTimeout(() => {
                this.$refs.draggable.computeIndexes()
            })
        },
        methods: {
            /**
             * @desc 拖动选中
             * @param { Object } dragEvent
             */
            handleChoose (event) {
                const {
                    height
                } = this.$refs.draggable.$el.getBoundingClientRect()
                this.styles = {
                    height: `${height}px`
                }
                this.$emit('choose', event)
            },
            handleUnchoose (event) {
                this.styles = {}
                this.$emit('unchoose', event)
            },
            /**
             * @desc 开始拖拽
             * @param { Object } dragEvent
             */
            handleStart (event) {
                LC.triggerEventListener('componentDragStart', {
                    type: 'componentDragStart'
                })
                this.$emit('start', event)
                // LC.triggerEventListener('componentMouserleave')
                // const activeNode = LC.getActiveNode()
                // if (activeNode) {
                //     activeNode.activeClear()
                // }
            },
            /**
             * @desc 结束拖拽
             * @param { Object } dragEvent
             */
            handleEnd (event) {
                this.styles = {}
                setMousedown(false)
                LC.triggerEventListener('componentDragEnd', {
                    type: 'componentDragEnd'
                })
                this.$emit('end', event)
            },
            /**
             * @desc 添加组件
             * @param { Object } dragEvent
             */
            handleAdd (event) {
                // fix: vue-draggable 内部索引不更新的问题
                this.$refs.draggable.computeIndexes()
                setMousedown(false)
                this.$emit('add', event)
            },
            handleSort (event) {
                this.$emit('sort', event)
            },
            /**
             * @desc 拖动更新
             * @param { Object } dragEvent
             */
            handleChange (event) {
                let operationNode = null
                const triggerEvent = {
                    target: this.componentData,
                    type: '',
                    child: null
                }
                if (event.added) {
                    operationNode = event.added.element
                    triggerEvent.type = 'appendChild'
                    // 拖动组件需要重置会影响排版的样式
                    operationNode.setStyle({
                        position: '',
                        top: '',
                        right: '',
                        bottom: '',
                        left: '',
                        zIndex: '',
                        marginTop: '',
                        marginRight: '',
                        marginBottom: '',
                        marginLeft: ''
                    })
                    setTimeout(() => {
                        // 新加的组件默认选中
                        operationNode.active()
                    }, 100)
                } else if (event.removed) {
                    operationNode = event.removed.element
                    triggerEvent.type = 'removeChild'
                } else if (event.moved) {
                    operationNode = event.moved.element
                    triggerEvent.type = 'moveChild'
                }
                
                triggerEvent.child = operationNode
                LC.triggerEventListener(triggerEvent.type, triggerEvent)
                LC.triggerEventListener('update', triggerEvent)
                // fix: vue-draggable 内部索引不更新的问题
                this.$refs.draggable.computeIndexes()
                this.$emit('change', event)
            }
        }
    }
</script>
<style lang="postcss" module>
    .drag-area{
        position: relative;
        width: 100%;
        height: 100%;
        pointer-events: auto !important;
        &:empty{
            min-height: 34px;
        }
    }
    .chosen{
        opacity: .9;
    }
    .ghost{
        margin-bottom: 5px;
        &:after {
            content: "放在这里";
            display: block;
            height: 24px;
            padding: 0 5px;
            font-size: 12px;
            color: #fff;
            text-align: center;
            line-height: 24px;
            background-color: #C2D7F9;
        }
        &:global(.inline),
        &:global(.inline-block) {
            display: inline-block;
            vertical-align: sub;
            &:after {
                width: 60px;
                display: inline-block;
                position: relative;
            }
        }
        &:global(.block) {
            display: block;
            &:after {
                top: 0;
                display: inline-block;
                width: 100%;
                position: relative;
            }
        }
        & > * {
            display: none !important;
        }
    }
</style>
