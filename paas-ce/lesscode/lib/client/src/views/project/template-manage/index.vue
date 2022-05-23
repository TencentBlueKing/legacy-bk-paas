<template>
    <section>
        <bk-alert type="info" title="模板来源：在页面画布中可将局部内容或将整个页面存为模板" closable></bk-alert>
        <layout class="template-manage" :init-width="300">
            <render-category ref="category" slot="left" @on-change="handleCategoryChange" />
            <render-template v-if="categoryId" :category-id="categoryId" @on-change="handleComponentChange" />
        </layout>
    </section>
</template>
<script>
    import Layout from '@/components/ui/layout'
    import RenderCategory from './components/render-category'
    import RenderTemplate from './components/render-template'

    export default {
        name: '',
        components: {
            Layout,
            RenderCategory,
            RenderTemplate
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
    .template-manage {
        height: calc(100vh - 120px);
    }
</style>
