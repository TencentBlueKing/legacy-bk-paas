<template>
    <vue-draggable
        ref="draggable"
        :class="$style['drag-area']"
        @add="handleAdd"
        @change="handleChange"
        @choose="handleChoose"
        @start="handleStart"
        @end="handleEnd"
        :ghost-class="ghostClass || $style['ghost']"
        v-bind="$attrs"
        v-on="$listeners">
        <slot />
    </vue-draggable>
</template>
<script>
    import LC from '@/element-materials/core'

    export default {
        name: '',
        inheritAttrs: false,
        props: {
            componentData: {
                type: Object,
                required: true
            },
            ghostClass: String
        },
        mounted () {
            setTimeout(() => {
                this.$refs.draggable.computeIndexes()
            }, 500)
        },
        methods: {
            handleAdd (event) {
                console.log('============print drag add', event)
                this.$emit('add', event)
            },
            handleChange (event) {
                if (event.added) {
                    LC.triggerEventListener('update', this.componentData, 'appendChildren')
                } else if (event.removed) {
                    LC.triggerEventListener('update', this.componentData, 'removeChildren')
                } else if (event.moved) {
                    LC.triggerEventListener('update', this.componentData, 'moveChildren')
                }
                console.log('prnt drang change == == ', event, this.$refs.draggable)
                // fix: vue-draggable内部没有更新
                this.$refs.draggable.computeIndexes()
                
                this.$emit('change', event)
            },
            handleChoose (event) {
                console.log('print drag choose', event)
                this.$emit('choose', event)
            },
            handleStart (event) {
                console.log('print drag start', event)
                this.$emit('start', event)
            },
            handleEnd (event) {
                console.log('print drag end', event)
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
    .ghost{
        &:after {
            content: "放在这里";
            background-color: #C2D7F9;
            position: absolute;
            left: 0;
            min-height: 32px;
            height: 32px;
            padding: 0 5px;
            font-size: 12px;
            color: #fff;
            text-align: center;
            line-height: 32px;
            
        }
        &.inline-block {
            display: inline-block;
            &:after {
                width: 60px;
                display: inline-block;
                position: relative;
            }
        }
        &.block {
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
