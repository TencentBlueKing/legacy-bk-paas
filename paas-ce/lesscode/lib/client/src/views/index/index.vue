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
        class="app-main"
        v-bkloading="{
            isLoading: isContentLoading || isCustomComponentLoading
        }">
        <div class="main-top">
            <div class="page-title">
                <div class="page-name">
                    <i
                        class="bk-drag-icon bk-drag-arrow-back"
                        title="返回页面列表"
                        @click="leavePage('pageList')" />
                    <span class="seperate-line">|</span>
                    <span
                        class="bk-drag-icon template-logo"
                        title="返回项目列表"
                        @click="leavePage('projects')">
                        <svg aria-hidden="true" width="16" height="16">
                            <use xlink:href="#bk-drag-logo"></use>
                        </svg>
                    </span>
                    <span class="seperate-line">|</span>
                    <div id="editPageSwitchPage" class="select-page-box">
                        <bk-select
                            ext-cls="select-page"
                            ext-popover-cls="select-page-dropdown"
                            ref="pageSelect"
                            :value="pageDetail.id"
                            :clearable="false"
                            :searchable="true"
                            @change="handlePageChange">
                            <div slot="trigger">
                                <div
                                    class="name-content"
                                    :title="`${pageDetail.pageName}【${projectDetail.projectName}】`">
                                    {{ pageDetail.pageName }}<span class="project-name">【{{ projectDetail.projectName }}】</span>
                                </div>
                                <i class="bk-select-angle bk-icon icon-angle-down" />
                            </div>
                            <bk-option
                                v-for="option in pageList"
                                :key="option.id"
                                :id="option.id"
                                :name="option.pageName">
                                <span>{{option.pageName}}</span>
                                <i class="bk-drag-icon bk-drag-copy"
                                    style="position: absolute; right: 10px; top: 50%; transform: translateY(-50%)"
                                    @click.stop="handlePageAction('copy')"
                                    title="复制页面"></i>
                            </bk-option>
                            <div slot="extension" class="extension">
                                <div
                                    class="page-row"
                                    @click="handlePageAction('create')">
                                    <i class="bk-icon icon-plus-circle" /> 新建空白页面
                                </div>
                                <div
                                    class="page-row"
                                    @click="handlePageFromTemplate">
                                    <i class="bk-icon icon-plus-circle" /> 从模板新建页面
                                </div>
                            </div>
                        </bk-select>
                    </div>
                </div>
            </div>
            <div class="function-and-tool">
                <div
                    id="toolActionBox"
                    class="function-tool-wrapper">
                    <operation-select v-model="contentTab" />
                    <div style="height: 22px; width: 1px; margin: 0 5px; background-color: #dcdee5;" />
                    <!-- 保存、预览、快捷键等tool单独抽离 -->
                    <action-tool />
                </div>
            </div>
            <extra-links
                show-help-box
                :help-click="handleStartGuide"
                :help-tooltips="{
                    content: '画布操作指引',
                    placements: ['bottom']
                }" />
        </div>
        <div
            v-if="!isContentLoading && !isCustomComponentLoading"
            class="main-container">
            <material-panel />
            <operation-area
                :operaion="contentTab"
                :project="projectDetail"
                :type="contentTab" />
            <modifier-panel />
        </div>
        <page-dialog ref="pageDialog" :action="action" />
        <novice-guide ref="guide" :data="guideStep" />
        <variable-form />
        <save-template-dialog />
        <page-from-template-dialog ref="pageFromTemplateDialog" />
    </main>
</template>

<script>
    import Vue from 'vue'
    import { mapState, mapGetters, mapActions } from 'vuex'
    import LC from '@/element-materials/core'
    import NoviceGuide from '@/components/novice-guide'
    import VariableForm from '@/components/variable/variable-form'
    import ExtraLinks from '@/components/ui/extra-links'
    import PageDialog from '@/components/project/page-dialog'
    import SaveTemplateDialog from '@/components/template/save-template-dialog'
    import PageFromTemplateDialog from '@/components/project/page-from-template-dialog'
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
            PageDialog,
            SaveTemplateDialog,
            PageFromTemplateDialog,
            OperationSelect,
            MaterialPanel,
            ModifierPanel,
            OperationArea,
            ActionTool
        },
        data () {
            return {
                isContentLoading: true,
                lockNotify: null,
                lockCheckTimer: null,
                isCustomComponentLoading: true,
                isSaving: false,
                action: 'create',
                contentTab: 'edit'
            }
        },
        computed: {
            ...mapGetters(['user']),
            ...mapGetters('project', [
                'projectDetail'
            ]),
            ...mapGetters('page', [
                'pageDetail',
                'pageList'
            ]),
            ...mapGetters('functions', ['funcGroups']),
            ...mapGetters('layout', ['pageLayout']),
            ...mapGetters('components', ['interactiveComponents']),
            ...mapGetters('variable', ['variableList']),
            ...mapState('route', ['layoutPageList'])
        },
        async created () {
            this.projectId = parseInt(this.$route.params.projectId)
            this.pageId = parseInt(this.$route.params.pageId)
            this.registerCustomComponent()
            
            this.fetchData()

            // 设置权限相关的信息
            this.$store.dispatch('member/setCurUserPermInfo', { id: this.projectId })

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
                        document.body.querySelector('[data-name="nav-tab-tree"]').click()
                    },
                    leave: () => {
                        // 离开时切换到组件选择 tab
                        document.body.querySelector('[data-name="nav-tab-component"]').click()
                    }
                },
                {
                    title: '画布编辑区',
                    content: '可在画布自由拖动组件、图标等进行页面布局',
                    target: '.main-content'
                },
                {
                    title: '组件配置',
                    content: '在画布中选中对应组件，可在这里进行组件样式、属性、事件及指令的配置',
                    target: '.main-right-sidebar',
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
        mounted () {
            window.addEventListener('unload', this.relasePage)
        },
        beforeDestroy () {
            LC.parseData([])
            window.removeEventListener('beforeunload', this.beforeunloadConfirm)
            window.removeEventListener('unload', this.relasePage)
            this.relasePage()
            this.lockNotify && this.lockNotify.close()
        },
        beforeRouteLeave (to, from, next) {
            this.$bkInfo({
                title: '确认离开?',
                subTitle: `您将离开画布编辑页面，请确认相应修改已保存`,
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
            handleContentTabChange (contentTab) {
                this.contentTab = contentTab
            },
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
            relasePage () {
                const data = new FormData()
                data.append('activeUser', this.user.username)
                data.append('pageId', this.pageId)
                navigator.sendBeacon('/api/page/releasePage', data)
            },
            async lockStatsuPolling (type) {
                const interval = 20 * 1000 // 节流，状态检查每20s一次
                if (this.lockCheckTimer === null) {
                    await this.checkLockStatus(type)
                    this.lockCheckTimer = setTimeout(() => {
                        clearTimeout(this.lockCheckTimer)
                        this.lockCheckTimer = null
                    }, interval)
                }
            },
            async checkLockStatus (type) {
                try {
                    const status = await this.$store.dispatch('page/pageLockStatus', { pageId: this.pageId })
                    if (status.isLock) {
                        if (this.lockNotify !== null) return true// 当前有弹窗，代表无权限
                        const messageType = `${type}-${status.accessible ? 'valiad' : 'invaliad'}`
                        this.lockNotify = this.$bkNotify({
                            title: '暂无编辑权限',
                            theme: 'warning',
                            delay: 0,
                            onClose: () => {
                                this.lockNotify = null
                            },
                            message: this.getLockMessage(messageType, status.activeUser)
                        })
                        return true
                    } else { // 未加锁，更新当前画布的加锁者为当前用户
                        this.$store.dispatch('page/updatePageLock', { data: {
                            pageId: this.pageId
                        } })
                        return false
                    }
                } catch (error) {
                    throw Error({
                        message: error
                    })
                }
            },
            userText (text) {
                const h = this.$createElement
                return h('span', {
                    style: {
                        color: '#EA3636'
                    }
                }, [text])
            },
            hpyerTextGenerator (text, handler) {
                const h = this.$createElement
                return h('span', {
                    style: {
                        cursor: 'pointer',
                        color: '#3a84ff'
                    },
                    on: {
                        click: handler
                    }
                }, [text])
            },
            getLockMessage (type, user) {
                const h = this.$createElement
                switch (type) {
                    case 'lock-invaliad':
                        return h('p', {
                            style: {
                                'line-height': '26px'
                            }
                        }, [
                            '当前画布正在被',
                            this.userText(user),
                            '编辑，您暂无编辑权限，如需操作请联系其退出编辑，如仅需查看页面最新状态，请直接',
                            this.hpyerTextGenerator('刷新页面', location.reload.bind(location))

                        ])
                    case 'lock-valiad':
                        return h('p', {
                            style: {
                                'line-height': '26px'
                            }
                        }, [
                            '当前页面正在被',
                            this.userText(user),
                            '编辑，如需获取操作，可点击',
                            this.hpyerTextGenerator('获取权限', this.occupyPage.bind(this)),
                            '，如仅需查看页面最新状态，请直接',
                            this.hpyerTextGenerator('刷新页面', location.reload.bind(location))
                        ])
                    case 'taked-invaliad':
                        return h('p', {
                            style: {
                                'line-height': '26px'
                            }
                        }, [
                            '由于您长时间未操作，页面编辑权已被释放；当前页面正在被',
                            this.userText(user),
                            '编辑，如仍需操作请联系其退出，如仅需查看页面最新状态，请直接',
                            this.hpyerTextGenerator('刷新页面', location.reload.bind(location))
                        ])
                    case 'taked-valiad':
                        return h('p', {
                            style: {
                                'line-height': '26px'
                            }
                        }, [
                            '由于您长时间未操作，页面编辑权已被释放；当前页面正在被',
                            this.userText(user),
                            '编辑，如需获取操作，可点击',
                            this.hpyerTextGenerator('获取权限', this.occupyPage.bind(this)),
                            '获取权限，如仅需查看页面最新状态，请直接',
                            this.hpyerTextGenerator('刷新页面', location.reload.bind(location))
                        ])
                }
            },
            async occupyPage () {
                try {
                    const resp = await this.$store.dispatch('page/occupyPage', {
                        data: {
                            pageId: this.pageId
                        }
                    })
                    if (resp.activeUser === this.user.username) {
                        this.lockNotify && this.lockNotify.close()
                        this.$bkMessage({
                            message: '抢占成功',
                            theme: 'success'
                        })
                    }
                } catch (error) {
                    throw Error({
                        message: error
                    })
                }
            },

            async fetchData () {
                try {
                    this.isContentLoading = true
                    const [pageDetail, pageList, projectDetail] = await Promise.all([
                        this.$store.dispatch('page/detail', { pageId: this.pageId }),
                        this.$store.dispatch('page/getList', { projectId: this.projectId }),
                        this.$store.dispatch('project/detail', { projectId: this.projectId }),
                        this.$store.dispatch('page/pageLockStatus', { pageId: this.pageId }),
                        this.$store.dispatch('route/getProjectPageRoute', { projectId: this.projectId }),
                        this.$store.dispatch('layout/getPageLayout', { pageId: this.pageId }),
                        this.$store.dispatch('components/componentNameMap'),
                        this.getAllGroupFuncs(this.projectId)
                    ])

                    await this.$store.dispatch('page/getPageSetting', {
                        pageId: this.pageId,
                        projectId: this.projectId
                    })

                    await this.lockStatsuPolling('lock') // 处理加锁逻辑

                    await this.getAllVariable({
                        projectId: this.projectId,
                        pageCode: pageDetail.pageCode,
                        effectiveRange: 0
                    })

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

                    this.$store.commit('page/setPageDetail', pageDetail || {})
                    this.$store.commit('page/setPageList', pageList || [])
                    this.$store.commit('project/setCurrentProject', projectDetail || {})
                } catch (e) {
                    console.error(e)
                } finally {
                    this.isContentLoading = false
                }
            },

            handleStartGuide () {
                this.$refs.guide.start()
            },

            beforeunloadConfirm (event) {
                const confirmationMessage = '...';
                (event || window.event).returnValue = confirmationMessage
                return confirmationMessage
            },

            leavePage (routeName) {
                this.$router.push({
                    name: routeName,
                    params: {
                        projectId: this.projectId,
                        pageId: this.pageId
                    }
                })
            },

            handlePageChange (pageId) {
                if (pageId === this.pageId) {
                    return
                }
                this.$bkInfo({
                    title: '确认离开?',
                    subTitle: `您将离开画布编辑页面，请确认相应修改已保存`,
                    confirmFn: async () => {
                        this.$router.push({
                            params: {
                                projectId: this.projectId,
                                pageId
                            }
                        })
                    }
                })
            },

            // 从模板创建
            handlePageFromTemplate () {
                this.$refs.pageFromTemplateDialog.isShow = true
            },

            handlePageAction (action = 'create') {
                this.action = action
                if (action === 'create') {
                    this.$refs.pageDialog.dialog.formData.id = undefined
                    this.$refs.pageDialog.dialog.formData.pageName = ''
                } else {
                    const layoutId = (this.layoutPageList.find(({ pageId }) => pageId === Number(this.pageId)) || {}).layoutId
                    this.$refs.pageDialog.dialog.formData.id = this.pageId
                    this.$refs.pageDialog.dialog.formData.layoutId = layoutId
                    this.$refs.pageDialog.dialog.formData.pageName = `${this.pageDetail.pageName}-copy`
                }

                this.$refs.pageDialog.dialog.formData.pageCode = ''
                this.$refs.pageDialog.dialog.formData.pageRoute = ''
                this.$refs.pageDialog.dialog.visible = true
                this.$refs.pageSelect.close()
            }
        }
    }
</script>

<style lang="postcss">
    @import './index.css';
</style>
