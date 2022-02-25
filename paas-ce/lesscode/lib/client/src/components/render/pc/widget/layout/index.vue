<template>
    <component
        class="lesscode-editor-layout"
        :style="style"
        :is="layoutCom">
        <slot />
    </component>
</template>
<script>
    import { mapGetters, mapMutations } from 'vuex'
    import LC from '@/element-materials/core'
    import LayoutEmpty from './components/empty'
    import LayoutLeftRight from './components/left-right'
    import LayoutComplex from './components/complex'
    import LayoutTopBottom from './components/top-bottom'

    const componentMap = {
        'empty': LayoutEmpty,
        'left-right': LayoutLeftRight,
        'complex': LayoutComplex,
        'top-bottom': LayoutTopBottom
    }

    export default {
        data () {
            return {
                layout: 'left-right',
                style: {}
            }
        },
        computed: {
            ...mapGetters('layout', ['pageLayout']),
            ...mapGetters('projectVersion', { versionId: 'currentVersionId' }),
            layoutCom () {
                if (!componentMap[this.layout]) {
                    return 'div'
                }
                return componentMap[this.layout]
            }
        },
        watch: {
            pageLayout: {
                handler (pageLayout) {
                    const {
                        showName,
                        layoutType,
                        layoutContent = {}
                    } = pageLayout

                    this.layout = layoutType
                    this.setCurTemplateData({
                        showName,
                        layoutType,
                        ...layoutContent
                    })
                },
                immediate: true
            }
        },
        created () {
            this.projectId = this.$route.params.projectId
            this.fetchPageList()
            
            LC.addEventListener('set-page-style', this.applyPageSetting)
            this.$once('hook:beforeDestroy', () => {
                LC.removeEventListener('set-page-style', this.applyPageSetting)
            })
        },
        mounted () {
            this.applyPageSetting()
        },
        methods: {
            ...mapMutations('drag', ['setCurTemplateData']),
            /**
             * @desc 引用页面样式配置
             */
            applyPageSetting () {
                const pageStyle = LC.pageStyle
                this.style = {
                    'min-width': pageStyle['min-width'] || ''
                }
                const $pageContentTarget = document.querySelector('.lesscode-editor-layout .container-content')
                Object.keys(pageStyle).forEach(key => {
                    if (key !== 'min-width') {
                        $pageContentTarget.style[key] = pageStyle[key] || ''
                    }
                })
            },
            fetchPageList () {
                this.$store.dispatch('route/getProjectPageRoute', {
                    projectId: this.projectId,
                    versionId: this.versionId
                })
            }
        }
    }
</script>
<style lang='postcss'>
    @import "@/css/mixins/scroller";
    .lesscode-editor-layout {
        transform: translate(0, 0);
        
        .bk-navigation {
            width: auto;
            height: auto;
            .bk-navigation-wrapper {
                flex: initial;
                .nav-slider {
                    height: auto;
                    .nav-slider-footer {
                        margin-top: auto;
                    }
                }
                .navigation-container {
                    .container-content {
                        flex: unset;
                        height: calc(100vh - 211px);
                        max-height: unset !important;
                        @mixin scroller;
                    }
                }
            }
        }
        .nav-slider-list {
            flex: initial;
            height: auto !important;
            overflow: unset !important;
        }
        .header-right{
            overflow: hidden;
        }
        .navigation-header{
            position: relative;
            display: flex;
            align-items: center;
            width: calc(100% - 100px);
            padding: 0 10px;
            margin-right: auto;
            overflow-x: auto;
            & > * {
                margin-right: 40px;
                &:last-child {
                    margin-right: 0;
                }
            }

            .navigation-header-item{
                display: flex;
                align-items: center;
                height: 40px;
                color: #96a2b9;
                cursor: pointer;
            }
        }
        .navigation-menu{
            position: relative;
            &:before{
                content: '';
                position: absolute;
                top: 0;
                right: 0;
                bottom: 0;
                left: 0;
                z-index: 9;
            }
        }
        .side-menu-wraper{
            position: relative;
            height: calc(100vh - 300px);
            border: 1px solid transparent;
            overflow-y: scroll;
            &:hover{
                border: 1px dashed #3a84ff;
            }
            &.selected{
                border: 1px solid #3a84ff !important;
            }
        }
        .message-box{
            white-space: nowrap;
            cursor: pointer;
            &:hover{
                color: #3A84FF;
            }
            .bk-icon{
                margin-left: 5px;
            }
        }
        .component-wrapper {
            z-index: 1000;
            margin: 5px;
            vertical-align: middle;
            &.selected {
                position: relative;
                z-index: 1000;
                &:before {
                    position: absolute !important;
                    left: 0 !important;
                    right: 0 !important;
                    top: 0 !important;
                    bottom: 0 !important;
                    display: block !important;
                    z-index: 999 !important;
                    content: "" !important;
                    border: 1px solid #3a84ff !important;
                    pointer-events: auto !important;
                }
            }
        }
        .component-wrapper-hover {
            position: relative;
            z-index: 1000;
            &:before {
                position: absolute !important;
                left: 0 !important;
                right: 0 !important;
                top: 0 !important;
                bottom: 0 !important;
                display: block !important;
                z-index: 999 !important;
                content: "" !important;
                border: 1px dashed #3a84ff !important;
                cursor: pointer !important;
                pointer-events: auto !important;
            }
        }
    }
    .lesscode-layout-empty {
        min-height: calc(100vh - 160px);
        .container-content{
            padding: 20px 24px 0;
        }
    }
    .lesscode-layout-message-theme{
        padding: 0 !important;
        user-select: none;
        .bk-tooltip-content{
            padding: 6px 0;
            margin: 0;
            color: #63656E;
            border: 1px solid #E2E2E2;
            border-radius: 2px;
            box-shadow: 0px 3px 4px 0px rgb(64 112 203 / 6%);
        }
        .message-item{
            display: flex;
            align-items: center;
            justify-content: center;
            min-width: 88px;
            height: 32px;
            padding: 0px 20px;
            &:hover{
                color: #3A84FF;
                background: #F0F1F5;
                cursor: pointer;
            }
        }
    }
</style>
