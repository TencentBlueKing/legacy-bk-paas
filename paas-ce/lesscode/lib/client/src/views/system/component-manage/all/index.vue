<template>
    <div>
        <layout>
            <render-category slot="left" @on-change="handleCategoryChange" />
            <render-list v-if="categoryId" :category="categoryId" />
        </layout>
    </div>
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
            }
        }
    }
</script>
