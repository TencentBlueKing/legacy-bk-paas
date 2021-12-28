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
    <main class="app-main">
        <div class="main-top">
            <div class="page-title">
                <div class="page-name">
                    <i class="bk-drag-icon bk-drag-arrow-back" title="返回页面列表" @click="leavePage('pageList')"></i>
                    <span class="seperate-line">|</span>
                    <span class="bk-drag-icon template-logo" title="返回项目列表" @click="leavePage('projects')">
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
                                <i class="bk-select-angle bk-icon icon-angle-down"></i>
                            </div>
                            <bk-option v-for="option in pageList"
                                :key="option.id"
                                :id="option.id"
                                :name="option.pageName">
                                <span>{{option.pageName}}</span>
                                <i class="bk-drag-icon bk-drag-copy"
                                    :style="copyIconStyle"
                                    @click.stop="handlePageAction('copy')"
                                    title="复制页面"></i>
                            </bk-option>
                            <div slot="extension" class="extension">
                                <div class="page-row" @click="handlePageAction('create')"><i class="bk-icon icon-plus-circle"></i> 新建空白页面</div>
                                <div class="page-row" @click="handlePageFromTemplate"><i class="bk-icon icon-plus-circle"></i> 从模板新建页面</div>
                            </div>
                        </bk-select>
                    </div>
                </div>
            </div>
            <div class="function-and-tool">
                <div id="toolActionBox" class="function-wrapper tool-actions">
                    <ul class="function-and-tool-list">
                        <li
                            class="tool-item"
                            :class="{ active: contentTab === 'edit' }"
                            @click="handleContentTabChange('edit')">
                            <i class="bk-drag-icon bk-drag-huabu" />
                            <span>画布</span>
                        </li>
                        <li
                            class="tool-item"
                            :class="{ active: contentTab === 'vueCode' }"
                            @click="handleContentTabChange('vueCode')">
                            <i class="bk-drag-icon bk-drag-yuanma" />
                            <span>源码</span>
                        </li>
                        <li
                            class="tool-item"
                            :class="{ active: contentTab === 'jsonSource' }"
                            @click="handleContentTabChange('jsonSource')">
                            <i class="bk-drag-icon bk-drag-json" />
                            <span>JSON</span>
                        </li>
                        <li
                            class="tool-item"
                            :class="{ active: contentTab === 'pageFunction' }"
                            @click="handleContentTabChange('pageFunction')">
                            <i class="bk-drag-icon bk-drag-yemianhanshu" />
                            <span>页面函数</span>
                        </li>
                        <li
                            class="tool-item"
                            :class="{ active: contentTab === 'pageVariable' }"
                            @click="handleContentTabChange('pageVariable')">
                            <i class="bk-drag-icon bk-drag-variable-manage" />
                            <span>页面变量</span>
                        </li>
                        <li
                            class="tool-item"
                            :class="{ active: contentTab === 'setting' }"
                            @click="handleContentTabChange('setting')">
                            <i class="bk-drag-icon bk-drag-set" />
                            <span>页面设置</span>
                        </li>
                    </ul>
                    <!-- 保存、预览、快捷键等tool单独抽离 -->
                    <extra-action></extra-action>
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
        <div class="main-container">
            <material-panel @onCustomComponentLoaded="handleCustomComponentLoaded" />
            <operation-area
                :operaion="contentTab"
                :project="projectDetail"
                :type="contentTab" />
            <modifier-panel />
        </div>
        <bk-dialog v-model="delComponentConf.visiable"
            class="del-component-dialog"
            theme="primary"
            :mask-close="false"
            :header-position="delComponentConf.headerPosition"
            title="删除"
            @confirm="confirmDelComponent"
            @cancel="cancelDelComponent"
            @after-leave="afterLeaveDelComponent">
            <div>
                <p>确认删除{{delComponentConf.item.name}}组件【{{delComponentConf.item.componentId}}】？</p>
                <p class="del-tip" v-if="delComponentConf.item.type === 'render-grid'">删除grid元素会连带删除grid中所有子元素</p>
                <p class="del-tip" v-else-if="delComponentConf.isCustomOffline">已下架的自定义组件删除后将不能再被使用</p>
            </div>
        </bk-dialog>
        <page-dialog ref="pageDialog" :action="action" />
        <novice-guide ref="guide" :data="guideStep" />
        <variable-form />
        <save-template-dialog />
        <page-from-template-dialog ref="pageFromTemplateDialog" />
    </main>
</template>

<script>
    import { mapState, mapGetters, mapMutations, mapActions } from 'vuex'
    import cloneDeep from 'lodash.clonedeep'
    import LC from '@/element-materials/core'
    import {
        // uuid,
        // walkGrid,
        circleJSON
    } from '@/common/util'
    import NoviceGuide from '@/components/novice-guide'
    import VariableForm from '@/components/variable/variable-form'
    import ExtraLinks from '@/components/ui/extra-links'
    import PageDialog from '@/components/project/page-dialog'
    import SaveTemplateDialog from '@/components/template/save-template-dialog'
    import PageFromTemplateDialog from '@/components/project/page-from-template-dialog.vue'
    import safeStringify from '@/common/json-safe-stringify'
    import MaterialPanel from './components/material-panel'
    import ModifierPanel from './components/modifier-panel'
    import OperationArea from './components/operation-area'
    import ExtraAction from './components/action-bar/extra-index'

    export default {
        components: {
            NoviceGuide,
            VariableForm,
            ExtraLinks,
            PageDialog,
            SaveTemplateDialog,
            PageFromTemplateDialog,
            MaterialPanel,
            ModifierPanel,
            OperationArea,
            ExtraAction
        },
        data () {
            return {
                lockNotify: null,
                lockCheckTimer: null,
                wholeComponentList: [],
                customComponentList: [],
                projectDetail: {},
                delComponentConf: {
                    visiable: false,
                    headerPosition: 'left',
                    item: {},
                    isCustomOffline: false
                },
                contentLoading: true,
                isCustomComponentLoading: true,
                isSaving: false,
                action: 'create',
                contentTab: 'edit'
            }
        },
        computed: {
            ...mapGetters(['user']),
            ...mapGetters(['mainContentLoading']),
            ...mapGetters('drag', [
                'draggableSourceGroup',
                'draggableTargetGroup',
                'curSelectedComponentData',
                'curTemplateData',
                'copyData'
            ]),
            ...mapGetters('page', [
                'pageDetail',
                'pageList'
            ]),
            ...mapGetters('functions', ['funcGroups']),
            ...mapGetters('layout', ['pageLayout']),
            ...mapGetters('components', ['interactiveComponents']),
            ...mapGetters('variable', ['variableList']),
            ...mapState('route', ['layoutPageList']),
            copyIconStyle () {
                return {
                    position: 'absolute',
                    right: '10px',
                    top: '50%',
                    transform: 'translateY(-50%)'
                }
            },
            projectId () {
                return this.$route.params.projectId || ''
            },
            
            pageId () {
                return this.$route.params.pageId || ''
            }
        },
        // watch: {
        //     targetData: {
        //         deep: true,
        //         handler () {
        //             this.lockStatsuPolling('lock')
        //         }
        //     }
        // },
        async created () {
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
            await this.fetchData()

            // 设置初始targetData
            let initData = []
            try {
                const content = this.pageDetail.content
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

            // 设置权限相关的信息
            this.$store.dispatch('member/setCurUserPermInfo', { id: this.projectId })
        },
        mounted () {
            window.addEventListener('unload', this.relasePage)
        },
        beforeDestroy () {
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
            ...mapMutations('drag', [
                'setTargetData',
                'setDraggableTargetGroup',
                'setCopyData',
                'pushTargetHistory',
                'backTargetHistory',
                'forwardTargetHistory'
            ]),

            ...mapActions('functions', [
                'getAllGroupFuncs'
            ]),
            ...mapActions('variable', ['getAllVariable']),
            handleContentTabChange (contentTab) {
                this.contentTab = contentTab
            },
            /**
             * @desc 自定义组件加载完成
             */
            handleCustomComponentLoaded () {
                this.isCustomComponentLoading = false
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
                    this.contentLoading = true
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
                    // update targetdata
                    const content = pageDetail.content
                    if (content) {
                        const targetData = JSON.parse(content)
                        pageDetail.content = safeStringify(targetData)
                    }

                    this.$store.commit('page/setPageDetail', pageDetail || {})
                    this.$store.commit('page/setPageList', pageList || [])
                    this.$store.commit('project/setCurrentProject', projectDetail || {})
                    this.projectDetail = projectDetail || {}
                } catch (e) {
                    console.error(e)
                } finally {
                    this.contentLoading = false
                }
            },

            /**
             * 检测是否能删除组件
             *
             * @return {boolean} 是否可以删除
             */
            checkIsDelComponent () {
                let msg = ''
                const { type, componentId, slotContainer } = this.curSelectedComponentData
                if (slotContainer === true) {
                    msg = 'slot容器不能刪除'
                } else if (type === 'render-grid'
                    && this.targetData.length === 1 && componentId === this.targetData[0].componentId
                ) {
                    msg = '画布中至少要有一个栅格布局'
                }
                if (msg) {
                    this.$bkMessage({
                        theme: 'warning',
                        limit: 1,
                        message: msg
                    })
                    return false
                }
                return true
            },

            handleStartGuide () {
                this.$refs.guide.start()
            },

            beforeunloadConfirm (event) {
                const confirmationMessage = '...';
                (event || window.event).returnValue = confirmationMessage
                return confirmationMessage
            },

            /**
             * 左侧组件列表 hover 事件
             *
             * @param {Object} e 事件对象
             * @param {Object} component 组件对象
             */
            handleComponentMouseenter (e, component) {
                let popoverInstance = e.target._tippy
                // const componentPreviewImg = `component-preview/${component.name}.png`
                const componentPreviewImg = 'component-preview.png'
                if (!popoverInstance) {
                    popoverInstance = this.$bkPopover(e.target, {
                        content: `<img width="210" src="${require(`@/images/${componentPreviewImg}`)}" />`,
                        boundary: 'viewport',
                        placement: 'right-start',
                        animation: 'fade',
                        duration: [500, 50],
                        theme: 'light popover-component',
                        onShow (instance) {
                            const left = 300 - instance.reference.offsetLeft - 60
                            instance.set({
                                distance: left
                            })
                        },
                        delay: 0
                    })
                }
                popoverInstance.show()
            },

            /**
             * 显示删除选中的元素弹框
             */
            showDeleteElement () {
                if (!this.checkIsDelComponent()) {
                    return
                }
                this.delComponentConf.visiable = true
                this.delComponentConf.item = Object.assign({}, this.curSelectedComponentData)
                const { type } = this.curSelectedComponentData
                const customComp = this.customComponentList.find(item => item.type === type)
                this.delComponentConf.isCustomOffline = customComp && customComp.meta.offline
            },

            /**
             * 确认删除选中的元素
             */
            confirmDelComponent () {
                const targetData = cloneDeep(this.targetData)
                const { componentId } = this.delComponentConf.item

                const del = (target, cid) => {
                    const len = target.length
                    for (let i = 0; i < len; i++) {
                        const item = target[i]
                        if (item.componentId === cid) {
                            target.splice(i, 1)
                            return target
                        }
                        if (item.children) {
                            del(item.children, cid)
                        } else if (item.renderSlots.default && item.renderSlots.default.type === 'form-item') {
                            // form表单内的元素不允许通过画布删除
                        } else if (
                            item.renderSlots.default && (item.renderSlots.default.type === 'column' || item.renderSlots.default.type === 'free-layout-item')
                        ) {
                            del(item.renderSlots.default.val, cid)
                        } else {
                            const renderSlots = item.renderSlots || {}
                            const slotKeys = Object.keys(renderSlots)
                            slotKeys.forEach((key) => {
                                const renderSlot = renderSlots[key]
                                if (renderSlot && renderSlot.name === 'layout') {
                                    del([renderSlot.val], cid)
                                }
                            })
                        }
                    }
                    return ''
                }
                const pos = this.$td().getNodePosition(componentId)
                if (pos === undefined) return
                const pushData = {
                    parentId: pos.parent && pos.parent.componentId,
                    component: this.delComponentConf.item,
                    columnIndex: pos.columnIndex,
                    childrenIndex: pos.childrenIndex,
                    type: 'remove'
                }
                del(targetData, componentId)
                this.setTargetData(targetData)
                this.pushTargetHistory(pushData)
                this.delComponentConf.visiable = false
            },

            /**
             * 取消删除选中的元素弹框
             */
            cancelDelComponent () {
                this.delComponentConf.visiable = false
            },

            /**
             * 删除选中元素弹框 afterLeave 回调
             */
            afterLeaveDelComponent () {
                this.delComponentConf.item = Object.assign({}, {})
            },

            handlePreview () {
                this.handleSave(() => {
                    let errTips = ''
                    try {
                        localStorage.removeItem('layout-target-data')
                        localStorage.setItem('layout-target-data', circleJSON(this.targetData))
                        const routerUrl = `/preview/project/${this.projectId}/?pageCode=${this.pageDetail.pageCode}`
                        window.open(routerUrl, '_blank')
                    } catch (err) {
                        errTips = err.message || err || '预览异常'
                    }
                    errTips && this.$bkMessage({
                        theme: 'error',
                        message: errTips,
                        limit: 1
                    })
                }, 'preview')
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
                const me = this
                if (pageId === me.pageId) {
                    return
                }
                me.$bkInfo({
                    title: '确认离开?',
                    subTitle: `您将离开画布编辑页面，请确认相应修改已保存`,
                    confirmFn: async () => {
                        me.$router.push({
                            params: {
                                projectId: me.projectId,
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
