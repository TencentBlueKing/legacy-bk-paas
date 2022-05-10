<template>
    <div class="operate-area">
        <bk-button
            v-for="(item, index) in buttons"
            class="btn-item"
            :key="index">
            {{ item.name }}
        </bk-button>
    </div>
</template>
<script>
    export default {
        name: 'operateArea',
        props: {
            buttons: {
                type: Array,
                default: () => []
            }
        }
    }
</script>
<style lang="postcss" scoped>
    .operate-area {
        display: flex;
        align-items: center;
        flex-wrap: wrap;
        margin-bottom: 8px;
    }
    .btn-item {
        margin-right: 8px;
    }
</style>
