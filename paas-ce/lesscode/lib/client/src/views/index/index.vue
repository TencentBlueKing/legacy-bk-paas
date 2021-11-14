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
                        <bk-select ext-cls="select-page" ext-popover-cls="select-page-dropdown"
                            ref="pageSelect"
                            v-model="pageDetail.id"
                            :clearable="false"
                            :searchable="true"
                            @selected="changeProjectPage">
                            <div slot="trigger">
                                <div class="name-content" :title="`${pageDetail.pageName}【${projectDetail.projectName}】`">
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
                    <ul class="function-and-tool-list" v-for="(group, index) in toolsGroupList"
                        :key="index">
                        <li class="tool-item" v-for="(item, innerIndex) in group"
                            :key="innerIndex"
                            :class="{ active: isToolItemActive(item) }"
                            v-bk-tooltips="{ placement: 'bottom', content: item.tips, disabled: !item.tips }"
                            @click="item.func">
                            <template v-if="item.text === '快捷键'">
                                <div class="quick-operation" v-bk-clickoutside="toggleShowQuickOperation">
                                    <div class="tool-item" @click="toggleShowQuickOperation(true)">
                                        <i class="bk-drag-icon bk-drag-keyboard"></i>
                                        <span>快捷键</span>
                                    </div>
                                    <section class="operation-main" v-if="showQuickOperation === true">
                                        <h5 class="operation-title"><span class="title-main">快捷键说明</span><i class="bk-icon icon-close" @click.stop="toggleShowQuickOperation(false)"></i></h5>
                                        <ul class="operation-list">
                                            <li v-for="(operation, shortcutIndex) in quickOperationList" :key="shortcutIndex" class="operation-item">
                                                <span class="operation-keys">
                                                    <span v-for="(key, keyIndex) in operation.keys" :key="key">
                                                        <span class="operation-key">{{ key }}</span><span v-if="keyIndex !== operation.keys.length - 1" class="operation-plus">+</span>
                                                    </span>
                                                </span>
                                                <span class="operation-name">{{ operation.name }}</span>
                                            </li>
                                        </ul>
                                    </section>
                                </div>
                            </template>
                            <template v-else>
                                <i :class="item.icon"></i>
                                <span>{{item.text}}</span>
                            </template>
                        </li>
                    </ul>
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
                :operaion="actionSelected"
                :project="projectDetail"
                :type="actionSelected" />
            <modifier-panel />
        </div>
        <Methods :show.sync="isShowFun" />
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
    import html2canvas from 'html2canvas'
    import { uuid, walkGrid, getNodeWithClass, circleJSON } from '@/common/util'
    import { getCurUsedFuncs, replaceFuncKeyword } from '@/components/methods/function-helper.js'
    import Methods from '@/components/methods'
    import NoviceGuide from '@/components/novice-guide'
    import VariableForm from '@/components/variable/variable-form'
    import ExtraLinks from '@/components/ui/extra-links'
    import PageDialog from '@/components/project/page-dialog'
    import SaveTemplateDialog from '@/components/template/save-template-dialog'
    import PageFromTemplateDialog from '@/components/project/page-from-template-dialog.vue'
    import { bus } from '@/common/bus'
    import safeStringify from '@/common/json-safe-stringify'
    import previewErrorImg from '@/images/preview-error.png'
    import LC from '@/element-materials/core'
    import MaterialPanel from './components/material-panel'
    import ModifierPanel from './components/modifier-panel'
    import OperationArea from './components/operation-area'

    export default {
        components: {
            Methods,
            NoviceGuide,
            VariableForm,
            ExtraLinks,
            PageDialog,
            SaveTemplateDialog,
            PageFromTemplateDialog,
            MaterialPanel,
            ModifierPanel,
            OperationArea
        },
        data () {
            return {
                lockNotify: null,
                lockCheckTimer: null,
                canvasHeight: 0,
                resizeObserve: null,
                wholeComponentList: [],
                customComponentList: [],
                projectDetail: {},
                actionSelected: 'edit',
                isShowFun: false,
                delComponentConf: {
                    visiable: false,
                    headerPosition: 'left',
                    item: {},
                    isCustomOffline: false
                },
                hasCtrl: false,
                startDragPosition: {},
                showQuickOperation: false,
                quickOperationList: [
                    { keys: ['Ctrl / Cmd', 'C'], name: '复制' },
                    { keys: ['Ctrl / Cmd', 'V'], name: '粘贴' },
                    { keys: ['Ctrl / Cmd', 'Z'], name: '撤销' },
                    { keys: ['Ctrl / Cmd', 'Y'], name: '恢复' },
                    { keys: ['Ctrl / Cmd', 'S'], name: '保存' },
                    { keys: ['Delete / Backspace'], name: '删除' }
                ],
                isInDragArea: false,
                contentLoading: true,
                isCustomComponentLoading: true,
                isSaving: false,
                action: 'create',
                toolsGroupList: [
                    [
                        { icon: 'bk-drag-icon bk-drag-huabu', key: 'edit', text: '画布', func: () => this.handleToolAction('edit') },
                        { icon: 'bk-drag-icon bk-drag-yuanma', key: 'vueCode', text: '源码', func: () => this.handleToolAction('vueCode') },
                        { icon: 'bk-drag-icon bk-drag-json', key: 'jsonSource', text: 'Json', func: () => this.handleToolAction('jsonSource') },
                        { icon: 'bk-drag-icon bk-drag-yemianhanshu', key: 'pageFunction', text: '页面函数', func: () => this.handleToolAction('pageFunction') },
                        { icon: 'bk-drag-icon bk-drag-variable-manage', key: 'pageVariable', text: '页面变量', func: () => this.handleToolAction('pageVariable') },
                        { icon: 'bk-drag-icon bk-drag-set', key: 'setting', text: '页面设置', func: () => this.handleToolAction('setting') }
                    ],
                    [
                        { icon: 'bk-drag-icon bk-drag-save', text: '保存', func: this.handleSave },
                        { icon: 'bk-drag-icon bk-drag-play', text: '预览', func: this.handlePreview },
                        { icon: 'bk-drag-icon bk-drag-template-fill', text: '存为模板', func: this.toggleShowTemplateDialog, tips: '将画布内容区域（不包含导航部分）存为模板' },
                        { icon: 'bk-drag-icon bk-drag-delete', text: '清空', func: this.handleClearAll },
                        { icon: 'bk-drag-icon bk-drag-hanshuku', text: '函数库', func: this.showFunManage },
                        { icon: 'bk-drag-icon bk-drag-keyboard', text: '快捷键', func: () => this.toggleShowQuickOperation(true) }
                    ]
                ]
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
            },

            targetData: {
                get () {
                    console.warn('get Target')
                    return this.$store.state.drag.targetData
                },
                set (value) {
                    console.warn('set Target')
                    this.setTargetData(value)
                }
            },
            showNotVisibleMask () {
                return this.curSelectedComponentData
                    && this.curSelectedComponentData.interactiveShow === false
                    && this.interactiveComponents.includes(this.curSelectedComponentData.type)
            }
        },
        watch: {
            targetData: {
                deep: true,
                handler () {
                    this.lockStatsuPolling('lock')
                }
            }
        },
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
                        document.body.querySelector('[data-name="nav-tab-tree"]').click()
                    },
                    leave: () => {
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
                        const $dragAreaEle = document.body.querySelector('.target-drag-area')
                        const $gridEle = $dragAreaEle.querySelector('.drag-area')
                        if ($gridEle) {
                            $gridEle.click()
                            return
                        }
                        const $freeLayoutEle = $dragAreaEle.querySelector('.bk-lesscode-free-layout')
                        if ($freeLayoutEle) {
                            $freeLayoutEle.click()
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

            // for test
            window.test = this.test
            window.test1 = this.test1
        },
        mounted () {
            window.addEventListener('keydown', this.quickOperation)
            window.addEventListener('keyup', this.judgeCtrl)
            window.addEventListener('click', this.toggleQuickOperation, true)
            window.addEventListener('unload', this.relasePage)

            bus.$on('on-delete-component', this.showDeleteElement)
            this.$once('hook:beforeDestroy', () => {
                bus.$off('on-delete-component', this.showDeleteElement)
            })
        },
        beforeDestroy () {
            window.removeEventListener('keydown', this.quickOperation)
            window.removeEventListener('keyup', this.judgeCtrl)
            window.removeEventListener('click', this.toggleQuickOperation, true)
            window.removeEventListener('beforeunload', this.beforeunloadConfirm)
            window.removeEventListener('unload', this.relasePage)
            this.resizeObserve.disconnect()
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
            isToolItemActive (item) {
                if (item.text === '快捷键') {
                    return this.showQuickOperation === true
                }
                return item.key === this.actionSelected
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
                        this.updateTargetData(targetData)
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
             * 在初始化和切换tab的时候更新画布数据
             * 将targetdata与其他业务结合
             */
            updateTargetData (targetData) {
                const getVariableVal = (data) => {
                    function getVariableValue ({ valueType, defaultValueType, defaultValue }) {
                        let value
                        if (defaultValueType === 0) {
                            value = defaultValue.all
                        }
                        if (defaultValueType === 1) {
                            value = defaultValue.stag
                        }
                        if ([3, 4].includes(valueType)) value = JSON.parse(value)
                        if (valueType === 6) value = undefined
                        return value
                    }

                    const { val, valType } = data
                    let variableVal

                    if (valType === 'variable' && val !== '') {
                        const curVariable = this.variableList.find((variable) => (variable.variableCode === val)) || {}
                        variableVal = getVariableValue(curVariable)
                    }

                    return variableVal
                }

                const callBack = (component) => {
                    const renderDirectives = component.renderDirectives || []
                    const renderProps = component.renderProps || {}
                    // update prop val
                    Object.keys(renderProps).forEach((key) => {
                        const renderProp = renderProps[key] || {}
                        const { payload = {} } = renderProp
                        const variableData = payload.variableData || {}

                        const data = variableData.val
                            ? variableData
                            : renderDirectives.find((dir) => ((dir.type + dir.prop) === (`v-bind${key}`) && ![undefined, ''].includes(dir.val)))
                        if (data) {
                            const varVal = getVariableVal(data)
                            if (varVal !== undefined) {
                                renderProp.val = varVal
                            }
                        }
                    })
                }

                targetData.forEach((grid, index) => walkGrid(targetData, grid, callBack, callBack, index))
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

            toggleShowTemplateDialog (isShow) {
                const activeNode = LC.getRoot()
                LC.triggerEventListener('saveTemplate', {
                    target: activeNode,
                    type: 'saveTemplate',
                    isWholePage: true,
                    value: JSON.parse(JSON.stringify(activeNode))
                })
            },

            toggleQuickOperation (event) {
                const mainNode = getNodeWithClass(event.target, 'target-drag-area')
                this.isInDragArea = mainNode && mainNode.classList.contains('target-drag-area')
            },

            toggleShowQuickOperation (val) {
                this.showQuickOperation = val
            },

            judgeCtrl (event) {
                switch (event.keyCode) {
                    case 91:
                    case 224:
                    case 93:
                    case 17:
                        this.hasCtrl = false
                        break
                }
            },

            quickOperation (event) {
                const vm = this
                const funcChainMap = {
                    stopped: false,
                    isInDragArea: function () {
                        if (!vm.isInDragArea) this.stopped = true
                        return this
                    },
                    hasCtrl: function () {
                        if (!vm.hasCtrl) this.stopped = true
                        return this
                    },
                    preventDefault: function () {
                        if (!this.stopped) event.preventDefault()
                        return this
                    },
                    isDelComponentConfirm: function () {
                        if (!vm.delComponentConf.visiable) this.stopped = true
                        return this
                    },
                    exec: function (callBack) {
                        if (!this.stopped) callBack()
                        return this
                    }
                }

                switch (event.keyCode) {
                    case 91:
                    case 224:
                    case 93:
                    case 17:
                        this.hasCtrl = true
                        break
                    case 67:
                        funcChainMap.isInDragArea().exec(this.putComponentData)
                        break
                    case 83:
                        funcChainMap.isInDragArea().hasCtrl().preventDefault().exec(this.handleSave)
                        break
                    case 86:
                        funcChainMap.isInDragArea().exec(this.copyComponent)
                        break
                    case 88:
                        funcChainMap.isInDragArea().exec(this.cutComponent)
                        break
                    case 90:
                        funcChainMap.isInDragArea().hasCtrl().exec(this.backTargetHistory)
                        break
                    case 89:
                        funcChainMap.isInDragArea().hasCtrl().preventDefault().exec(this.forwardTargetHistory)
                        break
                    case 8:
                    case 46:
                        funcChainMap.isInDragArea().preventDefault().exec(this.showDeleteElement)
                        break
                    case 13:
                        funcChainMap.isDelComponentConfirm().exec(this.confirmDelComponent)
                        break
                }
            },

            beforeunloadConfirm (event) {
                const confirmationMessage = '...';
                (event || window.event).returnValue = confirmationMessage
                return confirmationMessage
            },

            cutComponent () {
                if (!this.hasCtrl || Object.keys(this.curSelectedComponentData || {}).length <= 0) return

                if (!this.checkIsDelComponent()) {
                    return
                }

                const copyData = cloneDeep(this.curSelectedComponentData)
                this.setCopyData(copyData)
                this.delComponentConf.item = Object.assign({}, this.curSelectedComponentData)
                this.confirmDelComponent()
            },

            putComponentData () {
                if (!this.hasCtrl) return
                const copyData = cloneDeep(this.curSelectedComponentData)
                this.setCopyData(copyData)
            },

            copyComponent () {
                if (!this.hasCtrl || Object.keys(this.copyData).length <= 0) return
                const copyNode = this.$td(this.curSelectedComponentData.componentId).appendChild(this.copyData, true)
                const pos = copyNode.getNodePosition()
                if (pos) {
                    const pushData = {
                        parentId: pos.parent && pos.parent.componentId,
                        component: copyNode.value(),
                        columnIndex: pos.columnIndex,
                        childrenIndex: pos.childrenIndex,
                        type: 'add'
                    }

                    this.pushTargetHistory(pushData)
                }
            },

            /***
             * 显示函数管理面版
             */
            showFunManage () {
                this.isShowFun = true
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
             * 选中画布中的元素时触发，在画布中的只有 render-grid 和 free-layout 元素
             * 选中 render-grid 和 free-layout 内部的元素不会触发
             *
             * @param {Object} e 事件对象
             */
            onCanvasChoose (e) {
                const evt = e[0]
                const curChooseComponent = this.targetData[evt.oldIndex]
                this.startDragPosition = this.$td().getNodePosition(curChooseComponent.componentId)

                let name = ''
                if (curChooseComponent.type === 'render-grid') {
                    name = 'render-grid'
                } else if (curChooseComponent.type === 'free-layout') {
                    name = 'free-layout'
                }

                this.setDraggableTargetGroup(Object.assign({}, this.draggableTargetGroup, {
                    name
                }))
            },

            log (evt, column) {
                const addEle = evt.added
                const removedEle = evt.removed
                const moveEle = evt.moved
                const element = (addEle || removedEle || moveEle).element
                const pos = this.$td().getNodePosition(element.componentId)
                const pushData = {
                    parentId: pos.parent && pos.parent.componentId,
                    component: element,
                    columnIndex: pos.columnIndex,
                    childrenIndex: pos.childrenIndex
                }
                if (addEle) {
                    pushData.type = 'add'
                }
                if (removedEle) {
                    pushData.type = 'remove'
                    pushData.parentId = this.startDragPosition.parent && this.startDragPosition.parent.componentId
                    pushData.columnIndex = this.startDragPosition.columnIndex
                    pushData.childrenIndex = this.startDragPosition.childrenIndex
                }
                if (moveEle) {
                    pushData.type = 'move'
                    pushData.sourceParentNodeId = pushData.parentId
                    pushData.sourceColumnIndex = pos.columnIndex
                    pushData.sourceChildrenIndex = moveEle.oldIndex
                    pushData.targetParentNodeId = pushData.parentId
                    pushData.targetColumnIndex = pos.columnIndex
                    pushData.targetChildrenIndex = moveEle.newIndex
                }
                this.pushTargetHistory(pushData)
            },

            targetAreaEndHandler (e) {
                // console.error('onEnd11111', e)
            },

            async handleToolAction (action) {
                // 点击源码的时候，需要让右侧属性面板消失
                // 如果停留在源码页面时属性面板不消失，这个时候修改属性会生效，预览的时候就会生效，但是源码并不会随着属性的变化而重新生成
                if (['setting', 'vueCode'].includes(action)) {
                    const processTargetResult = this.processTargetData()
                    if (processTargetResult.errMessage) {
                        this.$bkMessage({
                            theme: 'error',
                            message: processTargetResult.errMessage,
                            limit: 1,
                            ellipsisLine: 0
                        })
                        return
                    }
                }
                // 切换回编辑区，对画布数据进行更新
                if (action === 'edit' && this.actionSelected !== 'edit') {
                    const targetData = JSON.parse(safeStringify(this.targetData || []))
                    this.updateTargetData(targetData)
                    this.targetData = targetData
                }
                this.actionSelected = action
            },

            /**
             * 清空页面已拖拽的元素
             */
            async handleClearAll () {
                const isLock = await this.checkLockStatus('lock')
                if (isLock) return // 如果被锁，不可清空

                const me = this
                me.$bkInfo({
                    title: '确定清空所有组件元素？',
                    subTitle: '包含的已下架自定义组件将不能再被使用',
                    confirmFn () {
                        const mockCurSelectComponentData = {
                            componentId: 'grid-' + uuid(),
                            renderKey: uuid(),
                            name: 'grid',
                            type: 'render-grid',
                            tabPanelActive: 'props',
                            renderProps: {
                                'margin-horizontal': {
                                    type: 'number',
                                    val: 0
                                },
                                'margin-vertical': {
                                    type: 'number',
                                    val: 0
                                }
                            },
                            renderStyles: {},
                            renderEvents: {},
                            renderDirectives: [],
                            renderSlots: {
                                default: {
                                    type: 'column',
                                    val: [{ 'span': 1, 'children': [], 'width': '100%' }]
                                }
                            }
                        }
                        const pushData = {
                            oldTargetData: me.targetData,
                            newTargetData: [mockCurSelectComponentData],
                            type: 'clear'
                        }
                        me.pushTargetHistory(pushData)
                    }
                })
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

            async handleSave (callBack, from) {
                console.log('from save == ', LC.getRoot())
                // const isLock = await this.checkLockStatus('lock')
                // if (isLock) return // 如果被锁，不可保存

                // if (this.isSaving) {
                //     return
                // }

                // const processTargetDataResult = this.processTargetData()
                // if (processTargetDataResult.errMessage) {
                //     this.$bkMessage({
                //         theme: 'error',
                //         message: processTargetDataResult.errMessage,
                //         ellipsisLine: 0
                //     })
                //     return
                // }
                // this.isSaving = true

                // const { curFuncIds, draggedCustomComponentList, usedVariableMap } = processTargetDataResult

                // try {
                //     const customCompData = draggedCustomComponentList.map(item => ({
                //         compId: item.meta.id,
                //         versionId: item.meta.versionId
                //     }))
                //     const functionData = [...new Set(curFuncIds.filter(item => item))]
                //     const res = await this.$store.dispatch('page/update', {
                //         data: {
                //             from,
                //             projectId: this.projectId,
                //             pageCode: this.pageDetail.pageCode,
                //             pageData: {
                //                 id: parseInt(this.$route.params.pageId),
                //                 content: circleJSON(this.targetData || [])
                //             },
                //             customCompData,
                //             functionData,
                //             templateData: this.processTemplateData(),
                //             usedVariableMap
                //         }
                //     })
                //     this.savePreviewImg()
                //     const projectId = this.$route.params.projectId || 1
                //     this.getAllGroupFuncs(projectId)
                //     res && this.$bkMessage({
                //         theme: 'success',
                //         message: '保存成功',
                //         limit: 1
                //     })
                //     if (typeof callBack === 'function') callBack()
                // } catch (err) {
                //     console.log(err)
                // } finally {
                //     this.isSaving = false
                // }
            },

            /**
             * 遍历一次 targetData
             * 1. 找出使用的函数 id
             * 2. 校验 targetData
             * 3. more
             */
            processTargetData () {
                // 记录已使用的变量
                const usedVariableMap = {}
                function addUsedVariable (id, dir) {
                    const { modifiers, prop, type, val, valType, slot } = dir
                    function generateUseInfo (variableId) {
                        const useInfo = { type, componentId: id, prop, modifiers, val, slot }
                        const useInfos = (usedVariableMap[variableId] || (usedVariableMap[variableId] = [], usedVariableMap[variableId]))
                        useInfos.push(useInfo)
                    }
                    if (val !== '' && !(val.startsWith('form') && val.indexOf('.') > 0) && valType === 'variable') {
                        const variable = this.variableList.find((variable) => (variable.variableCode === val))
                        if (!variable) {
                            errMessage = `组件【${id}】使用的变量【${val}】不存在，请修改后再试`
                        } else {
                            generateUseInfo(variable.id)
                        }
                    }
                    if (val !== '' && valType === 'expression') {
                        this.variableList.forEach(({ variableCode, id }) => {
                            if (val.includes(variableCode)) generateUseInfo(id)
                        })
                    }
                }
                const typeMap = {
                    array: '[object Array]',
                    string: '[object String]',
                    boolean: '[object Boolean]',
                    number: '[object Number]',
                    float: '[object Number]'
                }
                let errMessage = ''
                const draggedCustomComponentList = []

                const callBack = (component) => {
                    const customComp = this.wholeComponentList.find(item => item.type === component.type)
                    const dragged = draggedCustomComponentList.findIndex(item => item.type === component.type) !== -1
                    if (customComp && !dragged) {
                        draggedCustomComponentList.push(customComp)
                    }

                    const renderProps = component.renderProps || {}
                    Object.keys(renderProps).forEach((key) => {
                        const { type, val, payload = {} } = renderProps[key] || {}

                        const corValType = typeMap[type]
                        if (corValType && corValType !== Object.prototype.toString.apply(val)) {
                            errMessage = `组件【${component.componentId}】的属性【${key}】，类型和值不匹配，请修改后再试`
                        }
                        if (type === 'remote' && key !== 'remoteOptions') {
                            const hasMethod = payload && payload.methodCode
                            if (!hasMethod) errMessage = `组件【${component.componentId}】的属性【${key}】，类型为 remote 但未选择远程函数，请修改后再试`
                        }
                    })

                    const renderSlots = component.renderSlots || {}
                    Object.keys(renderSlots).forEach((key) => {
                        const { type, payload = {} } = renderSlots[key] || {}

                        if (payload.variableData && payload.variableData.val) {
                            const { val, valType } = payload.variableData
                            const dir = { slot: key, type: 'slots', val, valType }
                            addUsedVariable.call(this, component.componentId, dir)
                        }

                        if (type === 'remote') {
                            const hasMethod = payload.methodData && payload.methodData.methodCode
                            if (!hasMethod) errMessage = `组件【${component.componentId}】的【${key}】插槽，类型为 remote 但未选择远程函数，请修改后再试`
                        }
                    })

                    const renderDirectives = component.renderDirectives || []
                    renderDirectives.forEach((dir) => {
                        addUsedVariable.call(this, component.componentId, dir)
                    })
                }
                this.targetData.forEach((grid, index) => walkGrid(this.targetData, grid, callBack, callBack, index))

                // 检查函数内容
                const [usedFunctionMap, message] = getCurUsedFuncs()
                if (message) errMessage = message
                const curFuncIds = Object.keys(usedFunctionMap)
                curFuncIds.forEach((key) => {
                    const { funcName, funcBody, funcCode } = usedFunctionMap[key]
                    replaceFuncKeyword(funcBody, (all, first, second, dirKey, funcStr, funcCode) => {
                        if (dirKey) {
                            const curDir = this.variableList.find((variable) => (variable.variableCode === dirKey))
                            if (!curDir) {
                                errMessage = `页面中使用了函数【${funcName}】，该函数使用的变量【${dirKey}】不存在，请修改后再试`
                            }
                        }
                    })
                    // 使用到的函数名和变量名不能重复
                    Object.keys(usedVariableMap).forEach((id) => {
                        const useInfos = usedVariableMap[id]
                        const variableCode = (useInfos[0] || {}).val
                        if (variableCode === funcCode) {
                            errMessage = `页面中使用了函数【${funcCode}】，与使用的变量【${variableCode}】的标识存在冲突，请修改后再试`
                        }
                    })
                })
                return {
                    curFuncIds,
                    errMessage,
                    draggedCustomComponentList,
                    usedVariableMap
                }
            },

            /**
             * 遍历一次 templateData
             * 校验 templateData
             */
            processTemplateData () {
                const {
                    layoutType,
                    logo,
                    siteName,
                    menuList = [],
                    topMenuList = [],
                    renderProps = {}
                } = this.curTemplateData

                if (layoutType === 'empty') {
                    return {}
                } else {
                    return {
                        logo,
                        siteName,
                        menuList,
                        topMenuList,
                        renderProps
                    }
                }
            },

            savePreviewImg () {
                if (this.actionSelected === 'edit') {
                    // dom2Img(document.querySelector('.lesscode-editor-layout'), imgData => {
                    //     this.$store.dispatch('page/update', {
                    //         data: {
                    //             projectId: this.projectId,
                    //             pageCode: this.pageDetail.pageCode,
                    //             pageData: {
                    //                 id: parseInt(this.$route.params.pageId),
                    //                 previewImg: imgData || previewErrorImg
                    //             }
                    //         }
                    //     })
                    // })
                    html2canvas(document.querySelector('.main-content')).then(async (canvas) => {
                        const imgData = canvas.toDataURL('image/png')
                        this.$store.dispatch('page/update', {
                            data: {
                                projectId: this.projectId,
                                pageData: {
                                    id: parseInt(this.$route.params.pageId),
                                    previewImg: imgData || previewErrorImg
                                }
                            }
                        })
                    })
                }
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

            changeProjectPage (pageId) {
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
            },

            test () {
                console.warn(safeStringify(this.targetData))
                console.warn(this.targetData)
            },
            test1 (data) {
                if (data) {
                    this.setTargetData(data)
                } else {
                    this.setTargetData([{ 'componentId': 'grid8B6FFD74', 'renderKey': 'grid8B6FFD74', 'name': 'grid', 'type': 'render-grid', 'renderProps': { 'margin-horizontal': { 'type': 'number', 'val': 0 }, 'margin-vertical': { 'type': 'number', 'val': 0 }, 'slots': { 'type': 'column', 'val': [{ 'span': 1, 'children': [{ 'componentId': 'input8B753E61', 'renderKey': 'input8B753E61', 'name': 'input', 'type': 'bk-input', 'renderProps': { 'value': { 'type': 'string', 'val': 'hello world' }, 'type': { 'type': 'string', 'options': ['text', 'textarea', 'password', 'number', 'email', 'url', 'date'], 'val': 'text' }, 'font-size': { 'type': 'string', 'options': ['normal', 'medium', 'large'], 'val': 'normal' }, 'disabled': { 'type': 'boolean', 'val': false }, 'readonly': { 'type': 'boolean', 'val': false }, 'clearable': { 'type': 'boolean', 'val': true }, 'show-controls': { 'type': 'boolean', 'val': true } }, 'renderStyles': {}, 'renderEvents': {}, 'renderDirectives': [] }, { 'componentId': 'input482301F3', 'renderKey': 'input482301F3', 'name': 'input', 'type': 'bk-input', 'renderProps': { 'value': { 'type': 'string', 'val': 'hello world' }, 'type': { 'type': 'string', 'options': ['text', 'textarea', 'password', 'number', 'email', 'url', 'date'], 'val': 'text' }, 'font-size': { 'type': 'string', 'options': ['normal', 'medium', 'large'], 'val': 'normal' }, 'disabled': { 'type': 'boolean', 'val': false }, 'readonly': { 'type': 'boolean', 'val': false }, 'clearable': { 'type': 'boolean', 'val': true }, 'show-controls': { 'type': 'boolean', 'val': true } }, 'renderStyles': {}, 'renderEvents': {}, 'renderDirectives': [] }, { 'componentId': 'inputB0159B6D', 'renderKey': 'inputB0159B6D', 'name': 'input', 'type': 'bk-input', 'renderProps': { 'value': { 'type': 'string', 'val': 'hello world' }, 'type': { 'type': 'string', 'options': ['text', 'textarea', 'password', 'number', 'email', 'url', 'date'], 'val': 'text' }, 'font-size': { 'type': 'string', 'options': ['normal', 'medium', 'large'], 'val': 'normal' }, 'disabled': { 'type': 'boolean', 'val': false }, 'readonly': { 'type': 'boolean', 'val': false }, 'clearable': { 'type': 'boolean', 'val': true }, 'show-controls': { 'type': 'boolean', 'val': true } }, 'renderStyles': {}, 'renderEvents': {}, 'renderDirectives': [] }], 'width': '50%' }, { 'span': 1, 'children': [{ 'componentId': 'transfer01163C24', 'renderKey': 'transfer01163C24', 'name': 'transfer', 'type': 'bk-transfer', 'renderProps': { 'display-key': { 'type': 'string', 'val': 'name' }, 'setting-key': { 'type': 'string', 'val': 'id' }, 'sortable': { 'type': 'boolean', 'val': false } }, 'renderStyles': {}, 'renderEvents': {}, 'renderDirectives': [] }], 'width': '50%' }] } }, 'renderStyles': {}, 'renderEvents': {}, 'renderDirectives': [] }])
                }
            }
        }
    }
</script>

<style lang="postcss">
    @import './index.css';
</style>
