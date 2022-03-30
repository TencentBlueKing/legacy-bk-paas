<template>
    <div class="mobile-canvas-wrapper">
        <edit-area></edit-area>
        <simulator v-show="preview" style="transform: translateX(-40px)"></simulator>
        <preview-switch :value.sync="preview"></preview-switch>
    </div>
</template>

<script>
    import editArea from './edit-area.vue'
    import simulator from './simulator-area.vue'
    import previewSwitch from './preview-switch'
    export default {
        components: {
            editArea,
            simulator,
            previewSwitch
        },
        data () {
            return {
                preview: true
            }
        }
    }
</script>
<style lang="postcss" scoped>
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
