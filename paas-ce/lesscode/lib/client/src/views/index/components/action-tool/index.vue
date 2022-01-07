<template>
    <div class="action-tool-list">
        <save-canvas />
        <preview />
        <save-as-template />
        <clear-canvas />
        <show-function />
        <quick-operation />
    </div>
</template>
<script>
    import SaveCanvas from './save-canvas'
    import Preview from './preview'
    import SaveAsTemplate from './save-as-template'
    import ClearCanvas from './clear-canvas'
    import ShowFunction from './show-function'
    import QuickOperation from './quick-operation.vue'

    export default {
        components: {
            SaveCanvas,
            Preview,
            SaveAsTemplate,
            ClearCanvas,
            ShowFunction,
            QuickOperation
        }
    }
</script>
<style scoped>
    .action-tool-list{
        display: flex;
        align-items: center;
        height: 100%;
    }
</style>
