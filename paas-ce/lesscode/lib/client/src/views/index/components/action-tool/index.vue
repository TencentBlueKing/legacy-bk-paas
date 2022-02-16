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
    import SaveCanvas from './components/save-canvas'
    import Preview from './components/preview'
    import SaveAsTemplate from './components/save-as-template'
    import ClearCanvas from './components/clear-canvas'
    import ShowFunction from './components/show-function'
    import QuickOperation from './components/quick-operation'

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
<style lang="postcss" scoped>
    .action-tool-list{
        display: flex;
        align-items: center;
        height: 100%;
    }
</style>
