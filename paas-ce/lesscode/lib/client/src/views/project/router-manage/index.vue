<template>
    <div :class="[$style['routes'], 'page-content']" v-bkloading="{ isLoading: pageLoading, opacity: 1 }">
        <div :class="['info-flexible', $style['inner']]" v-show="!pageLoading">
            <div :class="$style['caption']">
                <div :class="$style['col']">路由配置</div>
                <div :class="$style['col']">绑定的页面</div>
            </div>
            <dl :class="$style['content']" v-if="Object.keys(routeGroup).length">
                <div :class="$style['route-group']"
                    v-for="(group, groupIndex) in Object.keys(routeGroup)"
                    :key="groupIndex">
                    <dt :class="$style['group-title']">
                        <i :class="['bk-drag-icon bk-drag-angle-up-fill', { 'bk-drag-angle-right-fill': foldeds[group] }, $style['arrow']]"
                            @click="handleToggle(group)">
                        </i>
                        <div :class="$style['node-row']">
                            <div :class="$style['path']">
                                <div :class="$style['path-name']">{{group}}</div>
                                <div :class="$style['opts']">
                                    <i :class="['bk-icon icon-plus', $style['icon']]" v-bk-tooltips="'添加子路由'" @click="handleAddSubRoute(group)"></i>
                                    <!-- <i :class="['bk-icon icon-edit2 ml10', $style['icon']]" @click="handleEditLayoutPath(group)"></i> -->
                                </div>
                            </div>
                            <div :class="$style['bind']">
                                <div :class="$style['bind-name']"></div>
                            </div>
                        </div>
                    </dt>
                    <dd :class="$style['group-content']" v-show="!foldeds[group]">
                        <div :class="$style['route-item']" v-for="(route, routeIndex) in routeGroup[group]" :key="routeIndex">
                            <div :class="$style['node-row']">
                                <div :class="[
                                    $style['path'],
                                    { [$style['editing']]: editState.route === route }]">
                                    <div :class="$style['path-name']">
                                        <span v-if="editState.route !== route" :title="route.path">{{route.path | routeShow}}</span>
                                        <div
                                            :class="[
                                                $style['edit-form'],
                                                'edit-route-form', { 'has-error': editState.error }
                                            ]"
                                            v-else>
                                            <div :class="[$style['form-el'], { [$style['is-loading']]: loadingState.route.includes(`${route.layoutPath}-${route.path}`) }]">
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
                                    <div :class="$style['opts']">
                                        <i :class="['bk-icon icon-edit2', $style['icon']]" @click="handleEditRoute(route)"></i>
                                        <!-- <i :class="['bk-icon icon-close ml10', $style['icon']]"></i> -->
                                    </div>
                                </div>
                                <div :class="$style['bind']">
                                    <div :class="$style['bind-name']">{{route.pageName || '--'}}</div>
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
    import { compile } from 'path-to-regexp'

    export default {
        filters: {
            routeShow (value) {
                if (value === '') {
                    return '/'
                }
                return value
            }
        },
        data () {
            return {
                pageLoading: true,
                routeGroup: [],
                foldeds: {},
                editState: {
                    type: '',
                    value: null,
                    route: null,
                    error: false
                },
                loadingState: {
                    layout: [],
                    route: []
                }
            }
        },
        computed: {
            projectId () {
                return this.$route.params.projectId
            },
            pathInputDisabled () {
                const { value, route, error } = this.editState
                const activeRoute = this.routeGroup[route.layoutPath].find(item => item.id === route.id)
                const fullPath = `${route.layoutPath}-${route.path}`
                const disabled = activeRoute.path === value || error || this.loadingState.route.includes(fullPath)
                return Boolean(disabled)
            }
        },
        created () {
            this.getRouteList()
        },
        methods: {
            async getRouteList () {
                this.pageLoading = true
                try {
                    const params = { projectId: this.projectId }
                    const routeGroup = await this.$store.dispatch('route/getProjectRouteGroup', params)
                    this.routeGroup = routeGroup
                } catch (e) {
                    console.error(e)
                } finally {
                    this.pageLoading = false
                }
            },
            handleEditLayoutPath () {
                console.log('handleEditLayoutPath')
            },
            handleAddSubRoute (group) {
                const groupFirstRoute = this.routeGroup[group] ? this.routeGroup[group][0] : {}
                const newRoute = {
                    id: Date.now(),
                    path: '',
                    layoutId: groupFirstRoute.layoutId,
                    layoutPath: group
                }
                this.editState.type = 'new'
                this.editState.value = newRoute.path
                this.editState.route = newRoute
                this.routeGroup[group].push(newRoute)

                this.$nextTick(() => {
                    const component = this.$refs[`input-${newRoute.id}`]
                    component[0] && component[0].focus && component[0].focus()
                })
            },
            handleEditRoute (route) {
                this.editState.type = ''
                this.editState.value = this.$options.filters.routeShow(route.path)
                this.editState.route = route

                this.$nextTick(() => {
                    const component = this.$refs[`input-${route.id}`]
                    component[0] && component[0].focus && component[0].focus()
                })
            },
            async handleConfirmSubRoute () {
                const { route, type } = this.editState
                const fullPath = `${route.layoutPath}-${route.path}`
                const activeRoute = this.routeGroup[route.layoutPath].find(item => item.id === route.id)

                if (this.pathInputDisabled) {
                    return
                }

                this.loadingState.route.push(fullPath)
                try {
                    if (type === 'new') {
                        const routeCreated = await this.createRoute()
                        Object.assign(activeRoute, routeCreated)
                    } else {
                        const routeSaved = await this.saveRoute()
                        activeRoute.path = routeSaved.path
                    }

                    this.unsetEditState()
                } catch (e) {
                    console.error(e)
                } finally {
                    this.loadingState.route = this.loadingState.route.filter(exist => exist !== fullPath)
                }
            },
            handleSubRouteCancel () {
                if (!this.editState.route) {
                    return
                }

                const { id, path, layoutPath } = this.editState.route
                const routeGroup = this.routeGroup[layoutPath]
                const fullPath = `${layoutPath}-${path}`

                if (this.loadingState.route.includes(fullPath)) {
                    return
                }

                if (this.editState.type === 'new') {
                    const index = routeGroup.findIndex(item => item.id === id)
                    routeGroup.splice(index, 1)
                }

                this.unsetEditState()
            },
            handleSubRouteInput (value) {
                try {
                    compile(value)
                    this.editState.error = false
                    if (!/^[\w-_:\/?]+$/.test(value)) {
                        this.editState.error = true
                    } else if (/\/{2,}/.test(value)) {
                        this.editState.error = 1
                    }
                } catch (e) {
                    this.editState.error = 1
                }
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
                        projectId: this.projectId
                    }
                })
                return res
            },
            unsetEditState () {
                this.editState.value = null
                this.editState.route = null
                this.editState.error = false
            },
            handleCreatePage () {
                this.$router.push({
                    name: 'pageList',
                    params: {
                        projectId: this.projectId
                    }
                })
            },
            handleToggle (group) {
                this.$set(this.foldeds, group, !this.foldeds[group])
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
            &:hover {
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
                flex: 1;
                position: relative;
                width: 50%;

                .path-name {
                    flex: 1;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    padding-left: 4px;
                }

                .opts {
                    visibility: hidden;
                    margin-left: 12px;
                    margin-right: 54px;
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
                }

                &.editing {
                    .opts {
                        visibility: hidden;
                    }

                }
            }
            .bind {
                flex: 1;
                width: 50%;
                margin-left: -36px;

                .bind-name {
                    /* white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    margin-right: 14px;
                    margin: 5px 14px 5px 0;
                    height: 26px;
                    padding-left: 4px;
                    line-height: 26px;

                    &:hover {
                        color: #63656E;
                        background: #DCDEE5;
                        cursor: pointer;
                    } */
                }
            }
        }

        .route-item {
            position: relative;

            .node-row {
                .path {
                    .opts {
                        margin-right: 72px;
                    }
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
