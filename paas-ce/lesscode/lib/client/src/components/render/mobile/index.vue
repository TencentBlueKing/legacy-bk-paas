<template>
    <div class="mobile-canvas-wrapper">
        <edit-area></edit-area>
        <simulator style="margin-left: 10%;"></simulator>
    </div>
</template>

<script>
    import editArea from './edit-area.vue'
    import simulator from './simulator-area.vue'
    export default {
        components: {
            editArea,
            simulator
        }
    }
</script>
<style lang="postcss" scoped>
.mobile-canvas-wrapper {
    min-height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 40px 0;
}
</style>
