<template>
    <div class="select-panel">
        <div
            class="tab-item"
            :class="{
                active: value === 'component'
            }"
            v-bk-tooltips.right="'组件库'"
            @click="handleChange('component')">
            <i class="bk-drag-icon bk-drag-custom-comp-default" />
        </div>
        <div
            class="tab-item"
            :class="{
                active: value === 'template'
            }"
            v-bk-tooltips.right="'模板库'"
            @click="handleChange('template')">
            <i class="bk-drag-icon bk-drag-template-fill" />
        </div>
        <div
            class="tab-item"
            :class="{
                active: value === 'tree'
            }"
            v-bk-tooltips.right="'页面组件树'"
            @click="handleChange('tree')">
            <i class="bk-drag-icon bk-drag-level-down" />
        </div>
    </div>
</template>
<script>
    export default {
        props: {
            value: String
        },
        methods: {
            handleChange (value) {
                this.$emit('input', value)
                this.$emit('change', value)
            }
        }
    }
</script>
<style lang="postcss" scoped>
    .select-panel{
        font-size: 14px;
        border-right: 1px solid #dcdee5;
        .tab-item{
            width: 100%;
            height: 42px;
            position: relative;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            &:hover{
                color: #3a84ff;
            }
            &.active{
                background-color: #e1ecff;
                color: #3a84ff;
            }
        }
    }
</style>
