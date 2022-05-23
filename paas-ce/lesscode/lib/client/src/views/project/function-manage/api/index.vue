<template>
    <layout class="api-manage">
        <api-category
            slot="left"
            ref="apiCategory"
            @categoryChange="handleCategoryChange"
        />
        <api-list
            :category-id="categoryId"
            :category-name="categoryName"
            @freshList="handleFresh"
        />
    </layout>
</template>

<script>
    import Layout from '@/components/ui/layout'
    import ApiCategory from './children/category.vue'
    import ApiList from './children/list.vue'

    export default {
        components: {
            Layout,
            ApiCategory,
            ApiList
        },
        data () {
            return {
                categoryId: '',
                categoryName: ''
            }
        },
        methods: {
            handleCategoryChange ({ id, name }) {
                this.categoryId = id
                this.categoryName = name
            },

            handleFresh () {
                this.$refs.apiCategory.initData()
            }
        }
    }
</script>

<style lang="postcss" scoped>
    .api-manage {
        height: calc(100% - 44px);
    }
</style>
