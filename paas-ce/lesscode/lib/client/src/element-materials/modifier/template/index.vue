<template>
    <div class="project-template-modifier">
        <div class="header" v-if="!isComplexSide">{{ templateData.showName }}</div>
        <div class="main" :class="{ 'is-complex-side': isComplexSide }">
            <editor-prop
                v-if="!isComplexSide"
                v-bind="templateData"
                @on-change="handleChange" />
            <div ref="container" class="container">
                <component
                    :is="panelCom"
                    :style="containerStyle"
                    v-bind="templateData"
                    @on-change="handleChange" />
            </div>
        </div>
    </div>
</template>
<script>
    import { bus } from '@/common/bus'
    import EditorProp from './editor/prop'
    import RenderInfo from './info'
    import RenderMenu from './side-menu'
    import RenderTopMenu from './top-menu'
    import RenderComplexTop from './complex-top'
    import RenderComplexSide from './complex-side'

    const panelComMap = {
        info: RenderInfo,
        menu: RenderMenu,
        topMenu: RenderTopMenu,
        complexTop: RenderComplexTop,
        complexSide: RenderComplexSide
    }

    const getOffset = target => {
        let totalLeft = null
        let totalTop = null
        let par = target.offsetParent
        totalLeft += target.offsetLeft
        totalTop += target.offsetTop
        while (par) {
            if (navigator.userAgent.indexOf('MSIE 8.0') === -1) {
                // 不是IE8我们才进行累加父级参照物的边框
                totalTop += par.clientTop
                totalLeft += par.clientLeft
            }
            totalTop += par.offsetTop
            totalLeft += par.offsetLeft
            par = par.offsetParent
        }
        return { left: totalLeft, top: totalTop }
    }

    export default {
        components: {
            EditorProp
        },
        props: {
            templateData: {
                type: Object,
                required: true
            }
        },
        data () {
            return {
                containerStyle: {}
            }
        },
        computed: {
            panelCom () {
                return panelComMap[this.templateData.panelActive] || ''
            },
            isComplexSide () {
                return this.templateData.panelActive === 'complexSide'
            }
        },
        mounted () {
            const { top } = getOffset(this.$refs.container)
            this.containerStyle = {
                height: `${window.innerHeight - top}px`
            }
        },
        methods: {
            handleChange (field, value) {
                bus.$emit('on-template-change', {
                    ...this.templateData,
                    [field]: value
                })
            }
        }
    }
</script>
<style lang='postcss'>
    @import "@/css/mixins/scroller";

    .project-template-modifier{
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        z-index: 1;
        background: #fff;
        .header{
            height: 46px;
            font-size: 14px;
            line-height: 46px;
            text-align: center;
            border-bottom: 1px solid #dcdee5;
        }
        .main {
            padding-top: 20px;
            height: calc(100% - 46px);
            overflow: auto;
            @mixin scroller;
            &.is-complex-side {
                height: 100%
            }
        }
        .container{
            padding: 0 10px;
        }
        .action-title{
            margin-bottom: 10px;
            font-size: 12px;
            font-weight: bold;
            color: #63656E;
            line-height: 16px;
        }
    }
    .menu-ghost-item {
        border: 1px dashed #3a84ff;
        background: #fff;
        color: #fff !important;
        height: 80px;
        .template-menu-edit, .template-menu-box, .bk-icon, .bk-drag-icon, .menu-children-box:before {
            display: none;
        }
    }
</style>
