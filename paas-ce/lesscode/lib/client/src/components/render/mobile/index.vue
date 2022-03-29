<template>
    <div class="mobile-canvas-wrapper">
        <edit-area></edit-area>
        <simulator v-show="mobilePreview" style="transform: translateX(-40px)"></simulator>
    </div>
</template>

<script>
    import editArea from './edit-area.vue'
    import simulator from './simulator-area.vue'
    import { mapGetters } from 'vuex'
    export default {
        components: {
            editArea,
            simulator
        },
        computed: {
            ...mapGetters('page', ['mobilePreview'])
        }
    }
</script>
<style lang="postcss" scoped>
.mobile-canvas-wrapper {
    display: flex;
    justify-content: space-around;
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
