<template>
    <ul class="function-and-tool-list">
        <save-canvas></save-canvas>
        <preview></preview>
        <save-as-template></save-as-template>
        <clear-canvas></clear-canvas>
        <show-function></show-function>
        <quick-operation></quick-operation>
    </ul>
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
