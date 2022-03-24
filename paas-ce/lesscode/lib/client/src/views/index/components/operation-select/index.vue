<template>
    <div class="operation-select">
        <div
            class="select-item"
            :class="{ active: value === 'edit' }"
            @click="handleChange('edit')">
            <i class="bk-drag-icon bk-drag-huabu" />
            <span>画布</span>
        </div>
        <div
            class="select-item"
            :class="{ active: value === 'vueCode' }"
            @click="handleChange('vueCode')">
            <i class="bk-drag-icon bk-drag-yuanma" />
            <span>源码</span>
        </div>
        <div
            class="select-item"
            :class="{ active: value === 'jsonSource' }"
            @click="handleChange('jsonSource')">
            <i class="bk-drag-icon bk-drag-json" />
            <span>JSON</span>
        </div>
        <div
            class="select-item"
            :class="{ active: value === 'pageFunction' }"
            @click="handleChange('pageFunction')">
            <i class="bk-drag-icon bk-drag-yemianhanshu" />
            <span>页面函数</span>
        </div>
        <div
            class="select-item"
            :class="{ active: value === 'pageVariable' }"
            @click="handleChange('pageVariable')">
            <i class="bk-drag-icon bk-drag-page-variable" />
            <span>页面变量</span>
        </div>
        <div
            class="select-item"
            :class="{ active: value === 'setting' }"
            @click="handleChange('setting')">
            <i class="bk-drag-icon bk-drag-set" />
            <span>页面设置</span>
        </div>
    </div>
</template>
<script>
    import LC from '@/element-materials/core'

    export default {
        name: '',
        props: {
            value: {
                type: String,
                default: 'edit'
            }
        },
        methods: {
            handleChange (value) {
                this.$emit('input', value)
                const activeNode = LC.getActiveNode()
                if (activeNode) {
                    activeNode.activeClear()
                }
            }
        }
    }
</script>
<style lang="postcss" scoped>
    .operation-select{
        display: flex;
        height: 100%;
        .select-item{
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            font-size: 12px;
            height: 100%;
            cursor: pointer;
            min-width: 60px;
            &:hover,
            &.active {
                background-color: #e1ecff;
                color: #3a84ff;
            }
            & ~ .select-item{
                margin-left: 10px;
            }
            i {
                font-size: 16px;
                margin-bottom: 5px;
            }
        }
    }
</style>
