<template>
    <vue-draggable
        ref="draggable"
        :class="$style['drag-area']"
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
    import _ from 'lodash'
    import LC from '@/element-materials/core'

    export default {
        name: 'render-draggable',
        inheritAttrs: false,
        props: {
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
            const dragableCheck = _.debounce((event) => {
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
            }, 60)
            LC.addEventListener('update', dragableCheck)
            this.$once('hook:beforeDestroy', () => {
                LC.removeEventListener('update', dragableCheck)
            })
        },
        mounted () {
            setTimeout(() => {
                this.$refs.draggable && this.$refs.draggable.computeIndexes()
            })
        },
        methods: {
            /**
             * @desc 添加组件
             * @param { Object } dragEvent
             */
            handleAdd (event) {
                // console.log('============print drag add', event)
                this.$emit('add', event)
            },
            /**
             * @desc 拖动更新
             * @param { Object } dragEvent
             */
            handleChange (event) {
                if (event.added) {
                    LC.triggerEventListener('update', {
                        target: this.componentData,
                        type: 'appendChildren'
                    })
                } else if (event.removed) {
                    LC.triggerEventListener('update', {
                        target: this.componentData,
                        type: 'removeChildren'
                    })
                } else if (event.moved) {
                    LC.triggerEventListener('update', {
                        target: this.componentData,
                        type: 'moveChildren'
                    })
                }
                // fix: vue-draggable内部没有更新
                this.$refs.draggable.computeIndexes()
                
                this.$emit('change', event)
            },
            /**
             * @desc 拖动选中
             * @param { Object } dragEvent
             */
            handleChoose (event) {
                // console.log('print drag choose', event)
                this.$emit('choose', event)
            },
            /**
             * @desc 开始拖拽
             * @param { Object } dragEvent
             */
            handleStart (event) {
                // console.log('print drag start', event)
                this.$emit('start', event)
            },
            /**
             * @desc 结束拖拽
             * @param { Object } dragEvent
             */
            handleEnd (event) {
                // console.log('print drag end', event)
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
        opacity: .5;
        /* background-color: #ffdddd; */
    }
    .ghost{
        &::before{
            content: none !important;
        }
        &:after {
            content: "放在这里";
            display: block;
            height: 32px;
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
            display: none;
        }
    }
</style>
