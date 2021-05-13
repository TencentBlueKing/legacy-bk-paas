<template>
    <ul :class="$style['route-group']"
        :style="{ '--level': level }">
        <li :class="$style['route-item']"
            v-for="(route, index) in list"
            :key="`${parent ? parent.path : ''}-${route.path}-${index}`">
            <i :class="['bk-drag-icon bk-drag-angle-up-fill', { 'bk-drag-angle-right-fill': !expandedLocal }, $style['arrow']]"
                @click="expandedLocal = !expandedLocal"
                v-if="route.children.length">
            </i>
            <div :class="$style['route-row']">
                <div :class="[$style['path'], { [$style['editing']]: editState.route === route }]">
                    <div :class="$style['path-name']">
                        <span v-if="editState.route !== route">{{route.path}}</span>
                        <div :class="$style['edit-form']" v-else>
                            <bk-input
                                :ref="`input-${editState.route.id}`"
                                v-model.trim="editState.value"
                                @enter="handleConfirmSubRoute"
                                @blur="handleSubRouteInputBlur"
                                placeholder="请输入路由名称，回车结束"
                            />
                        </div>
                    </div>
                    <div :class="$style['opts']">
                        <bk-dropdown-menu :ref="`addDropdown${route.id}`" v-if="level === 0">
                            <div slot="dropdown-trigger" :class="$style['add-trigger']">
                                <i :class="['bk-icon icon-plus', $style['icon']]"></i>
                            </div>
                            <ul class="bk-dropdown-list" slot="dropdown-content">
                                <!-- <li><a href="javascript:;">布局模板</a></li> -->
                                <li><a href="javascript:;" @click="handleAddSubRoute(route)">子级路由</a></li>
                            </ul>
                        </bk-dropdown-menu>
                        <i :class="['bk-icon icon-edit2 ml10', $style['icon']]" @click="handleEditRoute(route)"></i>
                        <!-- <i :class="['bk-icon icon-close ml10', $style['icon']]"></i> -->
                    </div>
                </div>
                <div :class="$style['page']">
                    <div :class="$style['page-name']">
                        ginmeet.html
                    </div>
                </div>
            </div>

            <route-tree :ref="`treeComp-${route.id}`"
                v-show="expandedLocal"
                :expanded="true"
                :list="route.children"
                :parent="route"
                :level="level + 1" />
        </li>
    </ul>
</template>

<script>
    export default {
        name: 'route-tree',
        props: {
            list: {
                required: true,
                type: Array
            },
            parent: Object,
            level: Number,
            expanded: Boolean
        },
        data () {
            return {
                expandedLocal: this.expanded || true,
                editState: {
                    type: '',
                    value: null,
                    route: null
                }
            }
        },
        computed: {
            projectId () {
                return this.$route.params.projectId
            }
        },
        created () {
            console.log('create')
            this.$on('editsub', (parent) => {
                console.log('xddd', parent)
            })
        },
        mounted () {
            document.addEventListener('keyup', this.handleKeyup)
        },
        beforeDestroy () {
            document.removeEventListener('keyup', this.handleKeyup)
        },
        methods: {
            log (evt) {
                console.log(evt)
            },
            handleAddSubRoute (route) {
                console.log('crea')
                const childTreeComp = this.$refs[`treeComp-${route.id}`][0]
                const newRoute = {
                    id: Date.now(),
                    path: '',
                    children: []
                }
                childTreeComp.editState.type = 'new'
                childTreeComp.editState.value = newRoute.path
                childTreeComp.editState.route = newRoute
                childTreeComp.editState.parent = route
                route.children.push(newRoute)

                this.$nextTick(() => {
                    const component = childTreeComp.$refs[`input-${newRoute.id}`]
                    component[0] && component[0].focus && component[0].focus()
                })

                // this.$refs[`addDropdown${route.id}`][0].hide()
            },
            handleEditRoute (route) {
                console.log('route:', route.id, route.path, this.$el)
                // if (parent)
                // const compInst = current.id ? this.$refs[`treeComp-${current.id}`][0] : this
                // console.log(current, 'routerouteroute', route, compInst)
                this.editState.type = ''
                this.editState.value = route.path
                this.editState.route = route

                this.$nextTick(() => {
                    const component = this.$refs[`input-${route.id}`]
                    component[0] && component[0].focus && component[0].focus()
                })

                this.$emit('editsub', this.$parent)
            },
            handleConfirmSubRoute () {
                console.log(this.editState.parent.id, this.editState.parent.path, this.editState.value)
            },
            handleSubRouteInputBlur (value) {
                console.log(this.editState, 'handleSubRouteInputBlur', this.$el)
                // if (!value) {
                // return
                // }
                // const id = this.editState.route.id

                // if (this.editState.type === 'new') {
                //     const i = this.editState.parent.children.findIndex(item => item.id === id)
                //     this.editState.parent.children.splice(i, 1)
                // }
                // this.$nextTick(() => {
                //     this.editState.value = null
                //     this.editState.route = null
                // })
            }
        }
    }
</script>

<style lang="postcss" module>
    .route-group {
        padding-left: 36px;

        > .route-item {
            position: relative;

            .route-row {
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
                            display: flex;
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
                        display: none;
                        margin-left: 24px;
                        margin-right: calc(var(--level) * 36px + 24px + 34px);
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
                            display: flex;
                            visibility: hidden;
                        }
                    }
                }
                .page {
                    flex: 1;
                    width: 50%;
                    margin-left: calc(var(--level) * -36px + -10px);

                    .page-name {
                        white-space: nowrap;
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
                        }
                    }
                }
            }

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

        > .route-item:not(:last-child) {
            &::after {
                content: '';
                position: absolute;
                width: 1px;
                height: calc(100% - 12px);
                left: -10px;
                top: 24px;
                background: #DCDEE5;
            }
        }

        .edit-form {
            display: flex;
            align-items: center;
            height: 100%;
        }
    }
</style>
