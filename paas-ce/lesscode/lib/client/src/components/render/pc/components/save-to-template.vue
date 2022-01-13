<template>
    <div
        :class="$style['button']"
        @click="handleSaveTemplate"
        role="save-template"
        data-render-drag="disabled">
        <i class="bk-drag-icon bk-drag-template-fill" />
        存为模板
    </div>
</template>
<script>
    import LC from '@/element-materials/core'

    export default {
        name: '',
        data () {
            return {}
        },
        methods: {
            handleSaveTemplate (event) {
                event.stopPropagation()
                event.preventDefault()
                const activeNode = LC.getActiveNode()
                LC.triggerEventListener('saveTemplate', {
                    target: activeNode,
                    type: 'saveTemplate',
                    isWholePage: false,
                    value: JSON.parse(JSON.stringify(activeNode))
                })
            }
        }
    }
</script>
<style lang="postcss" module>
    .button{
        position: absolute;
        top: -19px;
        left: 0;
        z-index: 10;
        height: 20px;
        padding: 2px 5px;
        font-size: 12px;
        color: #fff;
        background: #3a84ff;
        border-top-left-radius: 2px;
        border-top-right-radius: 2px;
        cursor: pointer;
        pointer-events: all !important;
        &:hover {
            background: #1964E1;
        }
    }
</style>
