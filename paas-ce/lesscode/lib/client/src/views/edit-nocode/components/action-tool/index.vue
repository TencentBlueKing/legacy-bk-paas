<template>
    <div class="action-tool-list">
        <save />
        <preview />
        <clear />
    </div>
</template>
<script>
    import Save from './components/save'
    import Preview from '@/views/index/components/action-tool/components/preview'
    import Clear from './components/clear'

    export default {
        components: {
            Save,
            Preview,
            Clear
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
