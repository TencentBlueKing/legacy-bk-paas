<template>
    <bk-select
        v-model="type"
        :clearable="false"
        :ext-cls="'type-select'"
        @change="handleChange">
        <bk-option v-for="option in typeList"
            :key="option.id"
            :id="option.id"
            :name="option.name">
        </bk-option>
    </bk-select>
</template>

<script>
    const typeSelectList = [
        {
            id: 'ALL',
            name: '全部'
        },
        {
            id: 'PC',
            name: 'PC端'
        },
        {
            id: 'MOBILE',
            name: '移动端'
        }
    ]
    
    export default {
        name: 'type-select',
        data () {
            return {
                type: 'ALL',
                typeList: typeSelectList
            }
        },
        methods: {
            handleChange () {
                this.$emit('select-change', this.type)
            }
        }
    }
</script>

<style lang="postcss"  scoped>
    .type-select {
        width: 120px;
        background: #fff;
        display: inline-block;
        margin-right: 10px;
    }
</style>
