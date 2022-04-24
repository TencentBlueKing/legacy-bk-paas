<template>
    <draw-layout
        class="lesscode-editor-page-content">
        <left-panel slot="left" />
        <layout style="margin: 20px 0">
            <form-content />
        </layout>
        <right-panel slot="right" />
    </draw-layout>
    
</template>

<script>
    import DrawLayout from '@/views/index/components/draw-layout'
    import LeftPanel from './components/left-panel'
    import RightPanel from './components/right-panel'
    import Layout from '@/components/render/pc/widget/layout'
    import FormContent from './components/form-content'
    export default {
        components: {
            DrawLayout,
            LeftPanel,
            RightPanel,
            Layout,
            FormContent
        },
        data () {
            return {

            }
        }
    }
</script>
