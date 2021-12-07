<template>
    <div :class="[$style['routes'], 'page-content']" v-bkloading="{ isLoading: pageLoading, opacity: 1 }">
        <div :class="['info-flexible', $style['inner']]" v-show="!pageLoading">
            <div :class="$style['caption']">
                <div :class="$style['col']">路由配置</div>
                <div :class="$style['col']">绑定页面跳转路由</div>
            </div>
            <dl :class="$style['content']" v-if="routeGroup.length">
                <div v-if="type === 'MOBILE'" :class="$style['route-group']">
                    <dt :class="$style['group-title']">
                        <i :class="['bk-drag-icon bk-drag-angle-up-fill', $style['arrow']]"></i>
                        <div :class="$style['node-row']">
                            <div :class="[$style['path']]">
                                <div :class="$style['path-name']">/mobile</div>
                            </div>
                        </div>
                    </dt>
                    <div :class="$style['route-group']"
                        v-for="group in routeGroup"
                        :key="group.layoutId">
                        <dt :class="$style['group-title']">
                            <i v-show="group.children.length"
                                :class="['bk-drag-icon bk-drag-angle-up-fill', { 'bk-drag-angle-right-fill': foldeds[group.layoutId] }, $style['arrow']]"
                                @click="handleToggle(group.layoutId)">
                            </i>
                            <div :class="$style['node-row']">
                                <div :class="[
                                    $style['path'],
                                    { [$style['editing']]: layoutEditState.group === group.layoutId }
                                ]">
                                    <div :class="$style['path-name']" v-if="layoutEditState.group !== group.layoutId">{{group.layoutPath}}</div>
                                    <div v-else
                                        :class="[
                                            $style['edit-form'],
                                            'edit-route-form', { 'has-error': layoutEditState.error }
                                        ]">
                                        <div :class="[$style['form-el'], { [$style['is-loading']]: loadingState.layout.includes(group.layoutId) }]">
                                            <bk-input
                                                :ref="`input-layout-${group.layoutId}`"
                                                v-model.trim="layoutEditState.value"
                                                :maxlength="60"
                                                @enter="handleConfirmParentRoute"
                                                @input="handleParentRouteInput"
                                                placeholder="请输入路由名称，回车结束"
                                            />
                                            <i class="bk-icon icon-exclamation-circle-shape tips-icon"
                                                v-bk-tooltips="editState.error === 1 ? '请检查路径正确性' : '需由数字、字母、下划线、中划线(-)、冒号(:)或反斜杠(/)组成'"></i>
                                        </div>
                                        <div :class="$style['buttons']">
                                            <bk-button text size="small" theme="primary"
                                                :disabled="parentPathInputDisabled"
                                                @click="handleConfirmParentRoute">确定</bk-button>
                                            <span :class="$style['divider']">|</span>
                                            <bk-button text size="small" theme="primary" @click="handleParentRouteCancel">取消</bk-button>
                                        </div>
                                    </div>
                                    <div :class="[$style['opts'], { [$style['hide']]: editState.route !== null || removeLoading }]">
                                        <i :class="['bk-icon icon-edit2 ml10', $style['icon']]" @click="handleEditLayoutPath(group)"></i>
                                        <i :class="['bk-icon icon-plus', $style['icon']]"
                                            v-show="editState.type !== 'new'"
                                            v-bk-tooltips="'添加子路由'"
                                            @click="handleAddSubRoute(group)"></i>
                                    </div>
                                </div>
                            </div>
                        </dt>
                        <dd :class="$style['group-content']" v-show="!foldeds[group.layoutId]">
                            <div :class="$style['route-item']" v-for="route in group.children" :key="route.id">
                                <div :class="[$style['node-row'], { [$style['active']]: activeState.routeId === route.id }]">
                                    <div :class="[
                                        $style['path'],
                                        { [$style['editing']]: editState.route === route }
                                    ]">
                                        <div :class="$style['path-name']">
                                            <span v-if="editState.route !== route" :title="route.path">{{route.path | routeShow}}</span>
                                            <div
                                                :class="[
                                                    $style['edit-form'],
                                                    'edit-route-form', { 'has-error': editState.error }
                                                ]"
                                                v-else>
                                                <div :class="[$style['form-el'], { [$style['is-loading']]: loadingState.route.includes(route.id) }]">
                                                    <bk-input
                                                        :ref="`input-${editState.route.id}`"
                                                        v-model.trim="editState.value"
                                                        :maxlength="60"
                                                        @enter="handleConfirmSubRoute"
                                                        @input="handleSubRouteInput"
                                                        placeholder="请输入路由名称，回车结束"
                                                    />
                                                    <i class="bk-icon icon-exclamation-circle-shape tips-icon"
                                                        v-bk-tooltips="editState.error === 1 ? '请检查路径正确性' : '需由数字、字母、下划线、中划线(-)、冒号(:)或反斜杠(/)组成'"></i>
                                                </div>
                                                <div :class="$style['buttons']">
                                                    <bk-button text size="small" theme="primary"
                                                        :disabled="pathInputDisabled"
                                                        @click="handleConfirmSubRoute">确定</bk-button>
                                                    <span :class="$style['divider']">|</span>
                                                    <bk-button text size="small" theme="primary" @click="handleSubRouteCancel">取消</bk-button>
                                                </div>
                                            </div>
                                        </div>
                                        <div :class="[$style['opts'], { [$style['hide']]: editState.route !== null || removeLoading }]">
                                            <i :class="['bk-icon icon-edit2', $style['icon']]" @click="handleEditRoute(route)"></i>
                                            <bk-popconfirm trigger="click" width="320"
                                                confirm-text="删除"
                                                @confirm="handleConfirmDelRoute(route)"
                                                :on-hide="handleHideDelPopover">
                                                <div slot="content">
                                                    <div :class="$style['del-tips']">
                                                        <i :class="['bk-icon icon-info-circle-shape pr5', $style['content-icon']]"></i>
                                                        <div :class="$style['content-text']">删除路由后，绑定到此路由的页面则无法访问，指向此路由的跳转路由也将失效</div>
                                                    </div>
                                                </div>
                                                <i :class="['bk-icon icon-close ml10', $style['icon']]" @click="handleShowDelPopover(route)"></i>
                                            </bk-popconfirm>
                                        </div>
                                    </div>
                                    <div :class="[$style['bind'], { [$style['disabled']]: editState.route !== null || removeLoading }]">
                                        <div :class="$style['bind-name']" @click="handleEditBinding(route)" v-if="bindState.route !== route">
                                            {{getBindDisplayValue(route)}}
                                        </div>
                                        <bind-route-form v-else
                                            :selector-props="bindRouteSelectorProps"
                                            :project-id="projectId"
                                            @success="handleBindSuccess"
                                            @cancel="handleBindCancel" />
                                    </div>
                                </div>
                            </div>
                        </dd>
                    </div>
                </div>
                <div v-else :class="$style['route-group']"
                    v-for="group in routeGroup"
                    :key="group.layoutId">
                    <dt :class="$style['group-title']">
                        <i v-show="group.children.length"
                            :class="['bk-drag-icon bk-drag-angle-up-fill', { 'bk-drag-angle-right-fill': foldeds[group.layoutId] }, $style['arrow']]"
                            @click="handleToggle(group.layoutId)">
                        </i>
                        <div :class="$style['node-row']">
                            <div :class="[
                                $style['path'],
                                { [$style['editing']]: layoutEditState.group === group.layoutId }
                            ]">
                                <div :class="$style['path-name']" v-if="layoutEditState.group !== group.layoutId">{{group.layoutPath}}</div>
                                <div v-else
                                    :class="[
                                        $style['edit-form'],
                                        'edit-route-form', { 'has-error': layoutEditState.error }
                                    ]">
                                    <div :class="[$style['form-el'], { [$style['is-loading']]: loadingState.layout.includes(group.layoutId) }]">
                                        <bk-input
                                            :ref="`input-layout-${group.layoutId}`"
                                            v-model.trim="layoutEditState.value"
                                            :maxlength="60"
                                            @enter="handleConfirmParentRoute"
                                            @input="handleParentRouteInput"
                                            placeholder="请输入路由名称，回车结束"
                                        />
                                        <i class="bk-icon icon-exclamation-circle-shape tips-icon"
                                            v-bk-tooltips="editState.error === 1 ? '请检查路径正确性' : '需由数字、字母、下划线、中划线(-)、冒号(:)或反斜杠(/)组成'"></i>
                                    </div>
                                    <div :class="$style['buttons']">
                                        <bk-button text size="small" theme="primary"
                                            :disabled="parentPathInputDisabled"
                                            @click="handleConfirmParentRoute">确定</bk-button>
                                        <span :class="$style['divider']">|</span>
                                        <bk-button text size="small" theme="primary" @click="handleParentRouteCancel">取消</bk-button>
                                    </div>
                                </div>
                                <div :class="[$style['opts'], { [$style['hide']]: editState.route !== null || removeLoading }]">
                                    <i :class="['bk-icon icon-edit2 ml10', $style['icon']]" @click="handleEditLayoutPath(group)"></i>
                                    <i :class="['bk-icon icon-plus', $style['icon']]"
                                        v-show="editState.type !== 'new'"
                                        v-bk-tooltips="'添加子路由'"
                                        @click="handleAddSubRoute(group)"></i>
                                </div>
                            </div>
                        </div>
                    </dt>
                    <dd :class="$style['group-content']" v-show="!foldeds[group.layoutId]">
                        <div :class="$style['route-item']" v-for="route in group.children" :key="route.id">
                            <div :class="[$style['node-row'], { [$style['active']]: activeState.routeId === route.id }]">
                                <div :class="[
                                    $style['path'],
                                    { [$style['editing']]: editState.route === route }
                                ]">
                                    <div :class="$style['path-name']">
                                        <span v-if="editState.route !== route" :title="route.path">{{route.path | routeShow}}</span>
                                        <div
                                            :class="[
                                                $style['edit-form'],
                                                'edit-route-form', { 'has-error': editState.error }
                                            ]"
                                            v-else>
                                            <div :class="[$style['form-el'], { [$style['is-loading']]: loadingState.route.includes(route.id) }]">
                                                <bk-input
                                                    :ref="`input-${editState.route.id}`"
                                                    v-model.trim="editState.value"
                                                    :maxlength="60"
                                                    @enter="handleConfirmSubRoute"
                                                    @input="handleSubRouteInput"
                                                    placeholder="请输入路由名称，回车结束"
                                                />
                                                <i class="bk-icon icon-exclamation-circle-shape tips-icon"
                                                    v-bk-tooltips="editState.error === 1 ? '请检查路径正确性' : '需由数字、字母、下划线、中划线(-)、冒号(:)或反斜杠(/)组成'"></i>
                                            </div>
                                            <div :class="$style['buttons']">
                                                <bk-button text size="small" theme="primary"
                                                    :disabled="pathInputDisabled"
                                                    @click="handleConfirmSubRoute">确定</bk-button>
                                                <span :class="$style['divider']">|</span>
                                                <bk-button text size="small" theme="primary" @click="handleSubRouteCancel">取消</bk-button>
                                            </div>
                                        </div>
                                    </div>
                                    <div :class="[$style['opts'], { [$style['hide']]: editState.route !== null || removeLoading }]">
                                        <i :class="['bk-icon icon-edit2', $style['icon']]" @click="handleEditRoute(route)"></i>
                                        <bk-popconfirm trigger="click" width="320"
                                            confirm-text="删除"
                                            @confirm="handleConfirmDelRoute(route)"
                                            :on-hide="handleHideDelPopover">
                                            <div slot="content">
                                                <div :class="$style['del-tips']">
                                                    <i :class="['bk-icon icon-info-circle-shape pr5', $style['content-icon']]"></i>
                                                    <div :class="$style['content-text']">删除路由后，绑定到此路由的页面则无法访问，指向此路由的跳转路由也将失效</div>
                                                </div>
                                            </div>
                                            <i :class="['bk-icon icon-close ml10', $style['icon']]" @click="handleShowDelPopover(route)"></i>
                                        </bk-popconfirm>
                                    </div>
                                </div>
                                <div :class="[$style['bind'], { [$style['disabled']]: editState.route !== null || removeLoading }]">
                                    <div :class="$style['bind-name']" @click="handleEditBinding(route)" v-if="bindState.route !== route">
                                        {{getBindDisplayValue(route)}}
                                    </div>
                                    <bind-route-form v-else
                                        :selector-props="bindRouteSelectorProps"
                                        :project-id="projectId"
                                        @success="handleBindSuccess"
                                        @cancel="handleBindCancel" />
                                </div>
                            </div>
                        </div>
                    </dd>
                </div>
            </dl>
            <div :class="$style['empty']" v-else>
                <bk-exception class="exception-wrap-item exception-part" type="empty" scene="part">
                    <div :class="$style['empty-text']">暂无路由，先去<bk-link theme="primary" @click="handleCreatePage">创建页面</bk-link></div>
                </bk-exception>
            </div>
        </div>
    </div>
</template>

<script>
    import { mapGetters } from 'vuex'
    import { compile } from 'path-to-regexp'
    import BindRouteForm from './children/bind-route-form'

    export default {
        name: 'route-list',
        components: {
            [BindRouteForm.name]: BindRouteForm
        },
        filters: {
            routeShow (value) {
                if (value === '') {
                    return '/'
                }
                return value
            }
        },
        props: {
            type: {
                type: String,
                default: 'PC'
            }
        },
        data () {
            return {
                pageLoading: true,
                routeGroup: [],
                pageList: [],
                layoutList: [],
                foldeds: {},
                editState: {
                    type: '',
                    value: null,
                    route: null,
                    error: false
                },
                loadingState: {
                    layout: [],
                    route: [],
                    remove: []
                },
                activeState: {
                    routeId: null
                },
                layoutEditState: {
                    value: null,
                    group: null,
                    error: false
                },
                bindState: {
                    route: null
                },
                bindRouteSelectorProps: {
                    active: {},
                    routeGroup: [],
                    pageList: []
                },
                routeMap: { 'PC': [], 'MOBILE': [] },
                pageMap: { 'PC': [], 'MOBILE': [] }
            }
        },
        computed: {
            ...mapGetters('projectVersion', { versionId: 'currentVersionId' }),
            projectId () {
                return Number(this.$route.params.projectId)
            },
            pathInputDisabled () {
                const { value, route, error } = this.editState
                const disabled = route.path === value || error || this.loadingState.route.includes(route.id)
                return Boolean(disabled)
            },
            parentPathInputDisabled () {
                const { value, group, error } = this.layoutEditState
                const activeGroup = this.routeGroup.find(item => item.layoutId === group)
                const disabled = activeGroup.layoutPath === value || error || this.loadingState.layout.includes(group)
                return Boolean(disabled)
            },
            routeFlatList () {
                const list = this.routeGroup.map(({ children }) => children)
                    .reduce((pre, cur) => pre.concat(cur), [])
                    .map(({ id, layoutPath, path }) => ({
                        id,
                        fullPath: `${layoutPath}${layoutPath.endsWith('/') ? '' : '/'}${path}`
                    }))
                return list
            },
            removeLoading () {
                return this.loadingState.remove.length > 0
            }
        },
        watch: {
            type (val) {
                this.pageList = this.pageMap[val]
                this.routeGroup = this.routeMap[val]
                this.bindRouteSelectorProps.pageList = this.pageList
                this.bindRouteSelectorProps.routeGroup = this.routeGroup
            }
        },
        created () {
            this.fetchData()
        },
        methods: {
            fetchData () {
                this.getRouteList()
                this.getPageList()
            },
            async getRouteList () {
                this.pageLoading = true
                try {
                    const params = { projectId: this.projectId, versionId: this.versionId }
                    const [routeGroup, layoutList] = await Promise.all([
                        this.$store.dispatch('route/getProjectRouteTree', params),
                        this.$store.dispatch('layout/getList', params)
                    ])
                    this.layoutList = layoutList.map(({ id: layoutId, routePath: layoutPath, layoutType }) => ({ layoutId, layoutPath, layoutType }))

                    // 补全所有布局模板父路由，便于父路由下没有路由时能快速的创建
                    this.layoutList.forEach(({ layoutId, layoutPath, layoutType }) => {
                        const index = routeGroup.findIndex(item => item.layoutId === layoutId)
                        if (index === -1) {
                            routeGroup.push({
                                children: [],
                                layoutId,
                                layoutPath,
                                layoutType
                            })
                        }
                    })
                    const that = this
                    routeGroup.forEach(function (route) {
                        that.routeMap[route.layoutType].push(route)
                    })
                    this.routeMap['PC'].sort((g1, g2) => g1.layoutId - g2.layoutId)
                    this.routeMap['MOBILE'].sort((g1, g2) => g1.layoutId - g2.layoutId)
                    this.routeGroup = this.routeMap[this.type]
                    this.bindRouteSelectorProps.routeGroup = this.routeGroup
                } catch (e) {
                    console.error(e)
                } finally {
                    this.pageLoading = false
                }
            },
            async getPageList () {
                const list = await this.$store.dispatch('page/getLiteList', { projectId: this.projectId, versionId: this.versionId })
                const that = this
                list.forEach(function (page) {
                    const pageType = page.pageType === 'MOBILE' ? 'MOBILE' : 'PC'
                    that.pageMap[pageType].push({
                        id: page.id,
                        name: page.pageName
                    })
                })
                this.pageList = this.pageMap[this.type]
                this.bindRouteSelectorProps.pageList = this.pageList
            },
            handleEditLayoutPath (group) {
                this.unsetEditState()
                this.unsetBindState()

                this.layoutEditState.value = group.layoutPath
                this.layoutEditState.group = group.layoutId

                this.foucsInput(`input-layout-${group.layoutId}`)
            },
            handleAddSubRoute (group) {
                this.unsetBindState()

                const newRoute = {
                    id: Date.now(),
                    path: '',
                    layoutId: group.layoutId,
                    layoutPath: group.layoutPath
                }
                this.editState.type = 'new'
                this.editState.value = newRoute.path
                this.editState.route = newRoute

                const activeGroup = this.routeGroup.find(item => item.layoutId === group.layoutId)
                activeGroup.children.push(newRoute)

                this.foucsInput(`input-${newRoute.id}`)
            },
            handleEditRoute (route) {
                this.unsetParentEditState()
                this.unsetBindState()

                this.editState.type = ''
                this.editState.value = this.$options.filters.routeShow(route.path)
                this.editState.route = route

                this.foucsInput(`input-${route.id}`)
            },
            async handleConfirmSubRoute () {
                const { route, type } = this.editState
                const group = this.routeGroup.find(item => item.layoutId === route.layoutId)
                const activeRoute = group.children.find(item => item.id === route.id)

                if (this.pathInputDisabled) {
                    return
                }

                const loadingRouteId = route.id
                this.loadingState.route.push(loadingRouteId)
                try {
                    if (type === 'new') {
                        const routeCreated = await this.createRoute()
                        Object.assign(activeRoute, routeCreated, { pageId: -1, redirect: null })
                    } else {
                        const routeSaved = await this.saveRoute()
                        activeRoute.path = routeSaved.path
                    }

                    this.unsetEditState()
                } catch (e) {
                    console.error(e)
                } finally {
                    this.loadingState.route = this.loadingState.route.filter(exist => exist !== loadingRouteId)
                }
            },
            async handleConfirmParentRoute () {
                const { group, value } = this.layoutEditState
                const activeGroup = this.routeGroup.find(item => item.layoutId === group)

                if (this.parentPathInputDisabled) {
                    return
                }

                const data = {
                    id: activeGroup.layoutId,
                    projectId: this.projectId,
                    versionId: this.versionId,
                    routePath: '/' + value.replace(/^\/+|\/+$/g, '')
                }
                this.loadingState.layout.push(group)
                try {
                    await this.$store.dispatch('layout/setRoutePath', data)
                    activeGroup.layoutPath = data.routePath
                    activeGroup.children.forEach(route => (route.layoutPath = data.routePath))
                    this.unsetParentEditState()
                } catch (e) {
                    console.error(e)
                } finally {
                    this.loadingState.layout = this.loadingState.layout.filter(exist => exist !== group)
                }
            },
            handleParentRouteInput (value) {
                this.layoutEditState.error = this.checkRoutePath(value)
            },
            handleParentRouteCancel () {
                if (!this.layoutEditState.group) {
                    return
                }

                const group = this.layoutEditState.group

                if (this.loadingState.layout.includes(group)) {
                    return
                }

                this.unsetParentEditState()
            },
            async handleConfirmDelRoute (route) {
                const { id: routeId, layoutId } = route
                this.loadingState.remove.push(routeId)
                try {
                    await this.$store.dispatch('route/remove', routeId)
                    const group = this.routeGroup.find(item => item.layoutId === layoutId)
                    const routeIndex = group.children.findIndex(item => item.id === routeId)
                    group.children.splice(routeIndex, 1)
                    // 重置跳转路由
                    this.routeGroup.forEach(group => {
                        group.children.forEach(route => {
                            if (route.redirect === routeId) {
                                route.redirect = null
                            }
                        })
                    })
                } catch (e) {
                    console.error(e)
                } finally {
                    this.loadingState.remove = this.loadingState.remove.filter(exist => exist !== routeId)
                }
            },
            handleShowDelPopover (route) {
                this.unsetEditState()
                this.unsetParentEditState()
                this.unsetBindState()
                this.activeState.routeId = route.id
            },
            handleHideDelPopover () {
                this.activeState.routeId = null
            },
            handleSubRouteCancel () {
                if (!this.editState.route) {
                    return
                }

                const { id, layoutId } = this.editState.route

                if (this.loadingState.route.includes(id)) {
                    return
                }

                if (this.editState.type === 'new') {
                    const activeGroup = this.routeGroup.find(item => item.layoutId === layoutId)
                    const index = activeGroup.children.findIndex(item => item.id === id)
                    activeGroup.children.splice(index, 1)
                }

                this.unsetEditState()
            },
            handleSubRouteInput (value) {
                this.editState.error = this.checkRoutePath(value)
            },
            async saveRoute () {
                const { value, route } = this.editState
                const res = this.$store.dispatch('route/save', {
                    data: {
                        pageRoute: {
                            id: route.id,
                            path: value
                        },
                        projectId: this.projectId,
                        versionId: this.versionId,
                        pageId: route.pageId
                    }
                })
                return res
            },
            async createRoute () {
                const { value, route } = this.editState
                const res = this.$store.dispatch('route/create', {
                    data: {
                        pageRoute: {
                            path: value,
                            layoutId: route.layoutId,
                            layoutPath: route.layoutPath
                        },
                        projectId: this.projectId,
                        versionId: this.versionId
                    }
                })
                return res
            },
            handleEditBinding (route) {
                if (this.editState.route) {
                    return
                }
                this.unsetParentEditState()

                this.bindState.route = route
                this.activeState.routeId = route.id
                this.bindRouteSelectorProps.active = route
            },
            unsetEditState () {
                this.editState.type = ''
                this.editState.value = null
                this.editState.route = null
                this.editState.error = false
            },
            unsetParentEditState () {
                this.layoutEditState.value = null
                this.layoutEditState.group = null
                this.layoutEditState.error = false
            },
            unsetBindState () {
                this.bindState.route = null
                this.activeState.routeId = null
            },
            handleCreatePage () {
                this.$router.push({
                    name: 'pageList',
                    params: {
                        projectId: this.projectId
                    }
                })
            },
            handleBindSuccess ({ routeId, pageId, redirect, name }) {
                for (const { children } of this.routeGroup) {
                    const targetRoute = children.find(route => route.id === routeId)
                    if (targetRoute) {
                        const changedRoute = { pageId, redirect }
                        changedRoute.pageName = pageId !== -1 ? name : null
                        Object.assign(targetRoute, changedRoute)
                        break
                    }
                }
                this.unsetBindState()
            },
            handleBindCancel () {
                this.unsetBindState()
            },
            handleToggle (group) {
                this.$set(this.foldeds, group, !this.foldeds[group])
            },
            getBindDisplayValue (route) {
                const { pageId, pageName, redirect } = route
                // 依据vue-router跳转路由优先
                if (redirect) {
                    const targetRoute = this.routeFlatList.find(item => item.id === redirect) || {}
                    return targetRoute.fullPath || '--'
                }
                if (pageId !== -1) {
                    return pageName
                }
                return '未绑定'
            },
            checkRoutePath (value) {
                let error = false
                try {
                    compile(value)
                    if (!/^[\w-_:\/?]+$/.test(value)) {
                        error = true
                    } else if (/\/{2,}/.test(value)) {
                        error = 1
                    }
                } catch (e) {
                    error = 1
                }
                return error
            },
            foucsInput (id) {
                this.$nextTick(() => {
                    const component = this.$refs[id]
                    component[0] && component[0].focus && component[0].focus()
                })
            }
        }
    }
</script>

<style lang="postcss" module>
    .routes {
        padding: 30px 24px;

        .inner {
            padding: 0;
            height: 100%;
        }
        .caption {
            display: flex;
            height: 42px;
            line-height: 42px;
            .col {
                font-size: 14px;
                font-weight: 700;
                flex: 1;
                padding-left: 24px;
                background: #F0F1F5;
                & + .col {
                    margin-left: 2px;
                }
            }
        }
        .content {
            padding: 8px 0 8px 24px;
            overflow: auto;
            height: calc(100% - 72px);
        }
    }

    .route-group {
        position: relative;
        margin-left: 36px;

        .group-title {
            .arrow {
                position: absolute;
                width: 20px;
                height: 20px;
                line-height: 20px;
                left: -36px;
                top: 7px;
                cursor: pointer;
                color: #979BA5;
                font-size: 12px;
            }
        }

        .group-content {
            margin-left: 36px;
        }

        .node-row {
            display: flex;
            position: relative;
            height: 36px;
            line-height: 36px;
            margin: 4px 0;
            cursor: default;

            &::before {
                content: '';
                position: absolute;
                width: 5px;
                height: 5px;
                left: -12px;
                top: 50%;
                margin-top: -2px;
                background: #979BA5;
                border-radius: 50%;
            }
            &:hover,
            &.active {
                background: #E1ECFF;
                color: #3A84FF;

                .path {
                    .opts {
                        visibility: visible;
                    }
                }
            }

            .path {
                display: flex;
                flex: none;
                position: relative;
                width: calc(50% - 36px);
                justify-content: space-between;

                .path-name {
                    flex: 1;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    padding-left: 4px;
                }

                .opts {
                    visibility: hidden;
                    margin-right: 12px;
                    align-items: center;

                    .icon {
                        width: 24px;
                        height: 24px;
                        font-size: 20px;
                        line-height: 24px;
                        cursor: pointer;
                        & + .icon {
                            margin-left: 8px;
                        }
                    }

                    .add-trigger {
                        width: 24px;
                        height: 24px;
                        line-height: 24px;
                        text-align: center;
                    }

                    &.hide {
                        visibility: hidden;
                    }
                }

                &.editing {
                    .opts {
                        visibility: hidden;
                    }
                }
            }
            .bind {
                display: flex;
                flex: none;
                align-items: center;
                width: calc(50% + 36px - 12px);
                margin-left: 12px;

                .bind-name {
                    width: 100%;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    margin-right: 14px;
                    margin: 5px 14px 5px 0;
                    height: 26px;
                    padding-left: 4px;
                    line-height: 26px;
                }

                &:not(.disabled) {
                    .bind-name {
                        &:hover {
                            color: #63656E;
                            background: #DCDEE5;
                            cursor: pointer;
                        }
                    }
                }
            }
        }

        .route-item {
            position: relative;

            .node-row {
                .path {
                    width: calc(50% - 36px - 18px);
                }
                .bind {
                    width: calc(50% + 36px + 6px);
                }
            }
        }

        .route-item:not(:last-child),
        &:not(:last-child) {
            &::after {
                content: '';
                position: absolute;
                width: 1px;
                height: calc(100% - 12px);
                left: -10px;
                top: 25px;
                background: #DCDEE5;
            }
        }

        .edit-form {
            display: flex;
            align-items: center;
            height: 100%;
            flex: 1;

            .form-el {
                &.is-loading {
                    &::after {
                        content: "";
                        display: inline-block;
                        width: 16px;
                        height: 16px;
                        position: absolute;
                        right: 8px;
                        top: 8px;
                        background: #fff url("../../../images/svg/loading.svg");
                    }
                }

                position: relative;
                display: flex;
                flex: 1;
            }
            .buttons {
                display: flex;
                align-items: center;
                margin-left: 2px;

                .bk-button-text {
                    width: 36px;
                    padding: 0 6px;
                }
                .divider {
                    color: #979BA5;
                }
            }
        }
    }

    .empty {
        display: flex;
        position: relative;
        align-items: center;
        justify-content: center;
        font-size: 14px;
        height: calc(100% - 42px);
        margin-top: -20px;

        .empty-text {
            display: flex;
        }
    }

    .del-tips {
        font-size: 14px;
        line-height: 24px;
        color: #63656e;
        padding-bottom: 10px;
        .content-icon {
            color: #ea3636;
            position: absolute;
            top: 20px;
        }
        .content-text {
            display: inline-block;
            margin-left: 20px;
        }
    }

    :global {
        .edit-route-form {
            position: relative;
            .tips-icon {
                display: none;
                position: absolute;
                right: 8px;
                top: 8px;
                color: #ea3636;
                cursor: pointer;
                font-size: 16px;
                background: #fff;
            }

            &.has-error {
                .bk-form-input {
                    border-color: #ff5656;
                    color: #ff5656;
                }

                .tips-icon {
                    display: block;
                }
            }

            .bk-button-text {
                padding: 0 6px;

                &.is-disabled {
                    color: #979BA5;
                }
            }
        }
    }
</style>
