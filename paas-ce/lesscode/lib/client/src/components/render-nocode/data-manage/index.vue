<template>
    <draw-layout>
        <layout>
            <div class="data-manage-page-wrapper">
                <page-use v-if="type === 'use'"></page-use>
                <page-edit v-else></page-edit>
            </div>
        </layout>
        <div v-if="type === 'edit'" class="data-manage-setting-wrapper" slot="right">
            数据管理页配置组件
        </div>
    </draw-layout>
</template>
<script>
    import DrawLayout from '@/views/index/components/draw-layout'
    import Layout from '@/components/render/pc/widget/layout'
    import PageEdit from './page-edit/index.vue'
    import PageUse from './page-use/index.vue'

    export default {
        name: 'DataManage',
        components: {
            DrawLayout,
            Layout,
            PageEdit,
            PageUse
        },
        props: {
            type: {
                type: String,
                default: 'edit'
            }
        }
    }
</script>
<style lang="postcss">
    .data-manage-page-wrapper {
        height: 100%;
    }
</style>
