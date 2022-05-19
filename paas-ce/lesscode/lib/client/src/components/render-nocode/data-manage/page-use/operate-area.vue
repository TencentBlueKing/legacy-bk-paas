<template>
    <div class="operate-area">
        <!--        <bk-button-->
        <!--            v-for="(item, index) in buttons"-->
        <!--            class="btn-item"-->
        <!--            :key="index">-->
        <!--            {{ item.name }}-->
        <!--        </bk-button>-->
        <button-group @click="handleClick" />
    </div>
</template>
<script>
    import ButtonGroup from '../page-edit/buttonGroup'
    export default {
        name: 'operateArea',
        components: {
            ButtonGroup
        },
        props: {
            buttons: {
                type: Array,
                default: () => []
            }
        },
        methods: {
            handleClick (action) {
                this.$emit('click', action)
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
