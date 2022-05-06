<template>
    <draw-layout>
        <layout class="data-manage-layout">
            <div class="data-manage-page-wrapper">
                <page-edit></page-edit>
            </div>
        </layout>
        <div class="data-manage-setting-wrapper" slot="right">
            数据管理页配置组件
        </div>
    </draw-layout>
</template>
<script>
    import DrawLayout from '@/views/index/components/draw-layout'
    import Layout from '@/components/render/pc/widget/layout'
    import PageEdit from './page-edit/index.vue'

    export default {
        name: 'DataManage',
        components: {
            DrawLayout,
            Layout,
            PageEdit
        }
    }
</script>
<style lang="postcss">
    .data-manage-layout {
        .navigation-container .container-content {
            background: #ffffff;
        }
    }
</style>
