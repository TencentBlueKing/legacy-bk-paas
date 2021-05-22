<template>
    <div :class="$style['bind-route-selector']">
        <bk-select :class="$style['select']"
            searchable
            :clearable="false"
            placeholder="未绑定"
            :loading="loading"
            :show-on-init="autofocus"
            v-model="bindValue">
            <bk-option-group
                v-for="(group, index) in groupList"
                :name="group.name"
                :key="index">
                <bk-option v-for="option in group.children"
                    v-bk-tooltips="{ disabled: !option.disabled, content: option.disabledReason }"
                    :key="option.id"
                    :disabled="option.disabled"
                    :id="option.id"
                    :name="option.name">
                </bk-option>
            </bk-option-group>
        </bk-select>
    </div>
</template>

<script>
    export default {
        name: 'BindRouteSelector',
        props: {
            active: {
                type: Object,
                required: true
            },
            pageList: {
                type: Array
            },
            routeGroup: {
                type: Array
            },
            autofocus: {
                type: Boolean,
                default: true
            }
        },
        data () {
            return {
                bindValue: '',
                loading: false
            }
        },
        computed: {
            useRouteList () {
                const routeList = this.routeGroup.map(({ children }) => children)
                    .reduce((pre, cur) => pre.concat(cur), [])
                    .map(({ id, layoutPath, path, pageId, redirect }) => ({
                        id: this.getRouteId(id),
                        rawId: id,
                        name: `${layoutPath}${layoutPath.endsWith('/') ? '' : '/'}${path}`,
                        pageId,
                        redirect
                    })).filter(({ rawId }) => rawId !== this.active.id)
                return routeList
            },
            usePageList () {
                return this.pageList.map(({ id, name }) => ({ id: this.getPageId(id), name, rawId: id }))
            },
            groupList () {
                // disabled态处理-已绑定路由的页面
                this.usePageList.forEach(page => {
                    let disabled = page.rawId !== this.active.pageId
                        && this.useRouteList.findIndex(route => route.pageId === page.rawId) !== -1

                    // 页面和跳转路由都绑定了，页面不允许选择，优先使用跳转路由
                    if (this.active.pageId !== -1 && this.active.redirect) {
                        disabled = true
                    }

                    page.disabled = disabled
                    if (disabled) {
                        page.disabledReason = '已绑定路由'
                    }
                })
                this.usePageList.sort((p1, p2) => p1.disabled - p2.disabled)

                // disabled态处理-未绑定页面的路由，跳转路径拼装
                this.useRouteList.forEach(route => {
                    const disabled = route.pageId === -1 && !route.redirect
                    route.disabled = disabled
                    if (disabled) {
                        route.disabledReason = '未绑定页面或跳转路由'
                    }

                    const getRedirectPath = function (route, list) {
                        const redirectPath = []
                        if (route.redirect) {
                            redirectPath.push(route.redirect)
                            const redirectRoute = list.find(({ rawId }) => rawId === route.redirect)
                            if (redirectRoute) {
                                redirectPath.push(...getRedirectPath(redirectRoute, list))
                            }
                        }
                        return redirectPath
                    }
                    route.redirectPath = getRedirectPath(route, this.useRouteList)
                })

                // disabled态处理-环状检查
                this.useRouteList.forEach(route => {
                    if (!route.disabled) {
                        const disabled = route.redirectPath.includes(this.active.id)
                        route.disabled = disabled
                        if (disabled) {
                            route.disabledReason = '禁止循环跳转'
                        }
                    }
                })
                this.useRouteList.sort((r1, r2) => r1.disabled - r2.disabled)

                return [
                    {
                        id: 'page',
                        name: '页面',
                        children: this.usePageList
                    },
                    {
                        id: 'route',
                        name: '路由',
                        children: this.useRouteList
                    }
                ]
            }
        },
        watch: {
            active: 'setValue',
            bindValue (value) {
                const [type] = value.split('-')
                const dataSource = type === 'page' ? this.usePageList : this.useRouteList
                const binding = dataSource.find(item => item.id === value)
                this.$emit('change', binding)
            }
        },
        created () {
            this.setValue()
        },
        methods: {
            setValue () {
                const { pageId, redirect: redirectRouteId } = this.active
                if (redirectRouteId) {
                    this.bindValue = this.getRouteId(redirectRouteId)
                } else if (pageId !== -1) {
                    this.bindValue = this.getPageId(pageId)
                }
            },
            getPageId (id) {
                return `page-${id}`
            },
            getRouteId (id) {
                return `route-${id}`
            }
        }
    }
</script>

<style lang="postcss" module>
    .bind-route-selector {
        .select {
            width: 100%;
            background: #fff;
        }
    }
</style>
