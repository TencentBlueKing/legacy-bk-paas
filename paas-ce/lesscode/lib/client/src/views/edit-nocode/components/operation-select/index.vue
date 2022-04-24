<template>
    <div class="operation-select">
        <div
            v-for="item in operationList"
            class="select-item"
            :class="{ active: value === item.key }"
            :key="item.key"
            @click="handleChange(item.key)">
            <i :class="`bk-drag-icon ${item.icon}`" />
            <span>{{item.label}}</span>
        </div>
    </div>
</template>
<script>
    export default {
        name: '',
        props: {
            value: {
                type: String,
                default: 'edit'
            }
        },
        data () {
            return {
                operationList: [
                    {
                        key: 'edit',
                        label: '表单设计',
                        icon: 'bk-drag-huabu'
                    },
                    {
                        key: 'setting',
                        label: '页面设置',
                        icon: 'bk-drag-set'
                    },
                    {
                        key: 'jsonSource',
                        label: 'JSON',
                        icon: 'bk-drag-json'
                    }
                ]
            }
        },
        methods: {
            handleChange (value) {
                this.$emit('input', value)
            }
        }
    }
</script>
<style lang="postcss" scoped>
    .operation-select{
        display: flex;
        height: 100%;
        align-items: center;
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
