<!--
  Tencent is pleased to support the open source community by making 蓝鲸智云PaaS平台社区版 (BlueKing PaaS Community Edition) available.
  Copyright (C) 2017-2019 THL A29 Limited, a Tencent company. All rights reserved.
  Licensed under the MIT License (the "License"); you may not use this file except in compliance with the License.
  You may obtain a copy of the License at
  http://opensource.org/licenses/MIT
  Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on
  an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the
  specific language governing permissions and limitations under the License.
-->

<template>
    <main
        class="lessocde-draw-page"
        v-bkloading="{
            isLoading: isContentLoading || isCustomComponentLoading
        }">
        <div class="draw-page-header">
            <page-list />
            <div
                id="toolActionBox"
                class="function-and-tool">
                <operation-select v-model="operationType" />
                <div style="height: 22px; width: 1px; margin: 0 5px; background-color: #dcdee5;" />
                <!-- 保存、预览、快捷键等tool单独抽离 -->
                <action-tool />
            </div>
            <extra-links
                show-help-box
                :help-click="handleStartGuide"
                :help-tooltips="{
                    content: '画布操作指引',
                    placements: ['bottom']
                }" />
        </div>
        <template v-if="!isContentLoading && !isCustomComponentLoading">
            <draw-layout>
                <material-panel slot="left" />
                <operation-area
                    :operaion="operationType"
                    :type="operationType" />
                <modifier-panel slot="right" />
            </draw-layout>
            <novice-guide ref="guide" :data="guideStep" />
        </template>
        <variable-form />
        <save-template-dialog />
    </main>
</template>
<script>
    import Vue from 'vue'
    import { mapActions, mapGetters, mapState } from 'vuex'
    import LC from '@/element-materials/core'
    import NoviceGuide from '@/components/novice-guide'
    import VariableForm from '@/components/variable/variable-form'
    import ExtraLinks from '@/components/ui/extra-links'
    import SaveTemplateDialog from '@/components/template/save-template-dialog'
    import DrawLayout from './components/draw-layout'
    import PageList from './components/page-list'
    import OperationSelect from './components/operation-select'
    import MaterialPanel from './components/material-panel'
    import ModifierPanel from './components/modifier-panel'
    import OperationArea from './components/operation-area'
    import ActionTool from './components/action-tool'

    export default {
        components: {
            NoviceGuide,
            VariableForm,
            ExtraLinks,
            SaveTemplateDialog,
            DrawLayout,
            PageList,
            OperationSelect,
            MaterialPanel,
            ModifierPanel,
            OperationArea,
            ActionTool
        },
        data () {
            return {
                isContentLoading: true,
                isCustomComponentLoading: true,
                operationType: 'edit'
            }
        },
        computed: {
            ...mapGetters(['user']),
            ...mapGetters('projectVersion', {
                versionId: 'currentVersionId',
                versionName: 'currentVersionName',
                getInitialVersion: 'initialVersion'
            }),
            ...mapGetters('drag', ['curTemplateData']),
            ...mapGetters('page', ['pageDetail']),
            ...mapGetters('functions', ['funcGroups']),
            ...mapGetters('layout', ['pageLayout']),
            ...mapGetters('variable', ['variableList']),
            ...mapGetters('projectVersion', { versionId: 'currentVersionId', versionName: 'currentVersionName', getInitialVersion: 'initialVersion' }),
            ...mapState('route', ['layoutPageList'])
        },
        watch: {
            curTemplateData: {
                handler () {
                    const pageRoute = this.layoutPageList.find(({ pageId }) => pageId === Number(this.pageId))
                    this.updatePreview({
                        isGenerateNav: true,
                        id: `lesscode-${pageRoute.layoutPath}`,
                        curTemplateData: this.curTemplateData,
                        types: ['reload']
                    })
                }
            },
            variableList () {
                // 变量发生变化的时候  reload
                this.handleUpdatePreview()
            },
            funcGroups () {
                // 函数发生变化的时候  reload
                this.handleUpdatePreview()
            },
            'pageDetail.lifeCycle' () {
                // 生命周期发生变化的时候  reload
                this.handleUpdatePreview()
            }
        },
        async created () {
            this.projectId = parseInt(this.$route.params.projectId)
            this.pageId = parseInt(this.$route.params.pageId)

            // LC.addEventListener('update', this.handleUpdatePreview)
            // this.$once('hook:beforeDestroy', () => {
            //     LC.removeEventListener('update', this.handleUpdatePreview)
            // })

            this.registerCustomComponent()

            // 获取并设置当前版本信息
            this.$store.commit('projectVersion/setCurrentVersion', this.getInitialVersion())

            this.fetchData()

            // 设置权限相关的信息
            this.$store.dispatch('member/setCurUserPermInfo', {
                id: this.projectId
            })

            this.guideStep = [
                {
                    title: '组件库和图标',
                    content: '从基础组件、自定义业务组件、图标库中拖拽组件或图标到画布区域进行页面编排组装',
                    target: '#editPageLeftSideBar'
                },
                {
                    title: '组件树',
                    content: '以全局组件树的形式，快速切换查看页面的所有组件',
                    target: '#editPageLeftSideBar',
                    entry: () => {
                        // 切换组件树 tab
                        document.body.querySelector('[role="component-tree-panel-tab"]').click()
                    },
                    leave: () => {
                        // 离开时切换到组件选择 tab
                        document.body.querySelector('[role="component-panel-tab"]').click()
                    }
                },
                {
                    title: '画布编辑区',
                    content: '可在画布自由拖动组件、图标等进行页面布局',
                    target: '#drawContent'
                },
                {
                    title: '组件配置',
                    content: '在画布中选中对应组件，可在这里进行组件样式、属性、事件及指令的配置',
                    target: '#modifierPanel',
                    entry: () => {
                        const $componentEl = document.body.querySelector('[role="component-root"]')
                        if ($componentEl) {
                            $componentEl.click()
                        }
                    }
                },
                {
                    title: '页面操作',
                    content: '可以查看并下载完整源码、对页面生命周期，路由，函数等进行配置，以及对内容进行保存，预览，清空等操作',
                    target: '#toolActionBox'
                },
                {
                    title: '切换页面',
                    content: '点击页面名称可以快速切换页面，新建页面，以及复制已有的页面',
                    target: '#editPageSwitchPage'
                }
            ]
        },
        beforeDestroy () {
            LC.parseData([])
            window.removeEventListener('beforeunload', this.beforeunloadConfirm)
        },
        beforeRouteLeave (to, from, next) {
            this.$bkInfo({
                title: '确认离开?',
                subTitle: '您将离开画布编辑页面，请确认相应修改已保存',
                confirmFn: async () => {
                    next()
                }
            })
        },
        methods: {
            ...mapActions('functions', [
                'getAllGroupFuncs'
            ]),
            ...mapActions('variable', ['getAllVariable']),
            ...mapActions(['updatePreview']),
            /**
             * @desc 注册自定义组件
             */
            registerCustomComponent () {
                this.isCustomComponentLoading = true
                // 包含所有的自定组件
                window.__innerCustomRegisterComponent__ = {}
                const script = document.createElement('script')
                script.src = `/${parseInt(this.projectId)}/${parseInt(this.pageId)}/component/register.js`
                script.onload = () => {
                    window.customCompontensPlugin.forEach((callback) => {
                        const [
                            config,
                            componentSource
                        ] = callback(Vue)
                        window.__innerCustomRegisterComponent__[config.type] = componentSource
                        // 注册自定义组件 material
                        LC.registerMaterial(config.type, config)
                    })
                    this.isCustomComponentLoading = false
                }
                document.body.appendChild(script)
                this.$once('hook:beforeDestroy', () => {
                    document.body.removeChild(script)
                })
            },
            /**
             * @desc 获取页面编辑基础数据
             */
            async fetchData () {
                try {
                    this.isContentLoading = true
                    const [pageDetail, pageList, projectDetail] = await Promise.all([
                        this.$store.dispatch('page/detail', { pageId: this.pageId }),
                        this.$store.dispatch('page/getList', {
                            projectId: this.projectId,
                            versionId: this.versionId
                        }),
                        this.$store.dispatch('project/detail', { projectId: this.projectId }),
                        this.$store.dispatch('page/pageLockStatus', { pageId: this.pageId }),
                        this.$store.dispatch('route/getProjectPageRoute', {
                            projectId: this.projectId,
                            versionId: this.versionId
                        }),
                        this.$store.dispatch('layout/getPageLayout', { pageId: this.pageId }),
                        this.$store.dispatch('components/componentNameMap'),
                        this.$store.dispatch('functions/getAllGroupFuncs', {
                            projectId: this.projectId,
                            versionId: this.versionId
                        }),
                        this.$store.dispatch('dataSource/list', { projectId: this.projectId })
                    ])

                    await this.$store.dispatch('page/getPageSetting', {
                        pageId: this.pageId,
                        projectId: this.projectId,
                        versionId: this.versionId
                    })

                    await this.getAllVariable({
                        projectId: this.projectId,
                        pageCode: pageDetail.pageCode,
                        versionId: this.versionId,
                        effectiveRange: 0
                    })

                    this.$store.commit('page/setPageDetail', pageDetail || {})
                    this.$store.commit('page/setPageList', pageList || [])
                    this.$store.commit('project/setCurrentProject', projectDetail || {})

                    // 设置初始targetData
                    let initData = []
                    try {
                        const content = pageDetail.content
                        if (content && content !== 'null') {
                            initData = JSON.parse(content)
                        }
                    } catch (err) {
                        this.$bkMessage({
                            theme: 'error',
                            message: 'targetData格式错误',
                            limit: 1
                        })
                    }
                    LC.parseData(initData)
                } catch (e) {
                    console.error(e)
                } finally {
                    this.isContentLoading = false
                }
            },
            /**
             * @desc 显示新手指引
             */
            handleStartGuide () {
                this.$refs.guide.start()
            },
            /**
             * @desc 页面离开确认
             * @param { Object } event
             */
            beforeunloadConfirm (event) {
                const confirmationMessage = '...';
                (event || window.event).returnValue = confirmationMessage
                return confirmationMessage
            },
            handleUpdatePreview (setting = {}) {
                const defaultSetting = {
                    isGenerateNav: false,
                    id: `lesscode-page-${this.pageId}`,
                    curTemplateData: {},
                    types: ['reload', 'update_style']
                }
                this.updatePreview(Object.assign(defaultSetting, setting))
            }
        }
    }
</script>
<style lang="postcss">
    $topHeight: 52px;
    $headerHeight: 64px;

    .lessocde-draw-page {
        min-width: 1280px;
        height: calc(100vh - $headerHeight);
        margin-top: $headerHeight;
        .draw-page-header {
            position: relative;
            display: flex;
            justify-content: space-between;
            height: $topHeight;
            background: #fff;

            &:after{
                content: '';
                position: absolute;
                right: 0;
                bottom: 0;
                left: 0;
                z-index: 99;
                height: 1px;
                box-shadow: 0px 2px 2px 0px rgba(0, 0, 0, 0.1);
            }
            
            .function-and-tool {
                position: relative;
                display: flex;
                justify-content: center;
                align-items: center;
            }

        }
    }
</style>
