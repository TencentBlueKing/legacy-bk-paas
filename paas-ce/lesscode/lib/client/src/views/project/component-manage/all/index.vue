<template>
    <layout class="component-manage-all">
        <render-category ref="category" slot="left" @on-change="handleCategoryChange" />
        <render-list v-if="categoryId" :category-id="categoryId" @on-change="handleComponentChange" />
    </layout>
</template>
<script>
    import Layout from '@/components/ui/layout'
    import RenderCategory from './components/render-category'
    import RenderList from './components/render-list'

    export default {
        name: '',
        components: {
            Layout,
            RenderCategory,
            RenderList
        },
        data () {
            return {
                categoryId: 0
            }
        },
        methods: {
            handleCategoryChange (category) {
                this.categoryId = category
            },
            handleComponentChange () {
                this.$refs.category.refresh()
            }
        }
    }
</script>

<style lang="postcss" scoped>
    .component-manage-all {
        height: calc(100vh - 120px);
    }
</style>
