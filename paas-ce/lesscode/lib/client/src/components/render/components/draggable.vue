<template>
    <vue-draggable
        ref="draggable"
        :class="$style['drag-area']"
        :list="list"
        :group="dragGroup"
        :chosen-class="$style['chosen']"
        :ghost-class="ghostClass || $style['ghost']"
        filter="[data-render-drag='disabled']"
        @add="handleAdd"
        @change="handleChange"
        @choose="handleChoose"
        @start="handleStart"
        @end="handleEnd"
        v-bind="$attrs"
        v-on="$listeners">
        <slot />
    </vue-draggable>
</template>
<script>
    import LC from '@/element-materials/core'

    let dragTargetGroup = null
    export const getDragTargetGroup = () => {
        return dragTargetGroup
    }

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
                dragGroup: this.group
            }
        },
        created () {
            dragTargetGroup = null
            const dragableCheck = (event) => {
                /**
                 * 交互式组件状态更新
                 * @description 当交互式组件激活时，不属于交互式组件的drag area不可拖动
                 *  只有关闭后，才可以继续拖拽
                 */
                if (event.interactiveShow
                    && !this.attachToInteractiveComponent) {
                    this.dragGroup = Object.freeze({
                        pull: false,
                        put: false
                    })
                } else {
                    this.dragGroup = this.group
                }
            }
            LC.addEventListener('toggleInteractive', dragableCheck)
            LC.addEventListener('hideInteractive', dragableCheck)
            this.$once('hook:beforeDestroy', () => {
                LC.removeEventListener('toggleInteractive', dragableCheck)
                LC.removeEventListener('hideInteractive', dragableCheck)
            })
        },
        mounted () {
            setTimeout(() => {
                this.$refs.draggable.computeIndexes()
            })
        },
        methods: {
            /**
             * @desc 添加组件
             * @param { Object } dragEvent
             */
            handleAdd (event) {
                this.$emit('add', event)
            },
            /**
             * @desc 拖动更新
             * @param { Object } dragEvent
             */
            handleChange (event) {
                let targetElement = null
                if (event.added) {
                    targetElement = event.added.element
                    LC.triggerEventListener('update', {
                        target: this.componentData,
                        type: 'appendChildren'
                    })
                } else if (event.removed) {
                    targetElement = event.removed.element
                    LC.triggerEventListener('update', {
                        target: this.componentData,
                        type: 'removeChildren'
                    })
                } else if (event.moved) {
                    targetElement = event.moved.element
                    LC.triggerEventListener('update', {
                        target: this.componentData,
                        type: 'moveChildren'
                    })
                }
                // 拖动组件需要重置会影响排版的样式
                targetElement.setStyle({
                    marginTop: 'unset',
                    marginLeft: 'unset'
                })
                // fix: vue-draggable 内部索引不更新的问题
                this.$refs.draggable.computeIndexes()
                dragTargetGroup = ''
                this.$emit('change', event)
            },
            /**
             * @desc 拖动选中
             * @param { Object } dragEvent
             */
            handleChoose (event) {
                dragTargetGroup = event.item.dataset['layout'] ? 'layout' : 'component'
                this.$emit('choose', event)
            },
            /**
             * @desc 开始拖拽
             * @param { Object } dragEvent
             */
            handleStart (event) {
                this.$emit('start', event)
            },
            /**
             * @desc 结束拖拽
             * @param { Object } dragEvent
             */
            handleEnd (event) {
                dragTargetGroup = ''
                this.$emit('end', event)
            }
        }
    }
</script>
<style lang="postcss" module>
    .drag-area{
        position: relative;
        z-index: 10;
        height: 100%;
    }
    .chosen{
        opacity: .9;
    }
    .ghost{
        margin-bottom: 5px;
        &:after {
            content: "放在这里";
            display: block;
            height: 32px;
            padding: 0 5px;
            font-size: 12px;
            color: #fff;
            text-align: center;
            line-height: 32px;
            background-color: #C2D7F9;
        }
        &:global(.inline-block) {
            display: inline-block;
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
