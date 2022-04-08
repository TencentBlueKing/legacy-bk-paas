<template>
    <div :class="$style['mobile-canvas-wrapper']">
        <edit-area></edit-area>
        <simulator v-show="showPreview" style="transform: translateX(-40px)"></simulator>
    </div>
</template>

<script>
    import editArea from './edit-area.vue'
    import simulator from './simulator-area.vue'
    import LC from '@/element-materials/core'
    
    export default {
        components: {
            editArea,
            simulator
        },
        data () {
            return {
                showPreview: true
            }
        },
        created () {
            LC.addEventListener('mobilePreviewSwitch', val => {
                this.showPreview = val
            })
        }
    }
</script>
<style lang="postcss" module>
.mobile-canvas-wrapper {
    display: flex;
    justify-content: space-around;
    min-width: 1000px;
    padding: 40px 0 80px;
    overflow: auto;
    ::v-deep .lesscode-layout-empty {
        min-height: 0;
        min-width: 0;
        padding: 0;
        overflow: hidden;
    }
}
</style>
