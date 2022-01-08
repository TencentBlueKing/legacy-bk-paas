<template>
    <div class="item">
        <div
            class="item-text"
            v-bk-tooltips="{
                placement: 'bottom',
                content: item.tips,
                disabled: !item.tips
            }"
            @click="item.func">
            <i :class="item.icon"></i>
            <span>{{item.text}}</span>
        </div>
        <slot />
    </div>
</template>
<script>
    export default {
        props: {
            item: {
                type: Object,
                required: true
            }
        }
    }
</script>
<style lang="postcss" scoped>
    .item {
        display: flex;
        font-size: 12px;
        height: 100%;
        cursor: pointer;
        &:hover,
        &.active {
            background-color: #e1ecff;
            color: #3a84ff;
        }
        & ~ .item{
            margin-left: 10px;
        }
        .item-text{
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            min-width: 60px;
            i {
                font-size: 16px;
                margin-bottom: 5px;
            }
        }
    }
</style>
