<template>
    <li>
        <bk-input
            class="change-group-name"
            size="small"
            ref="inputRef"
            v-if="isChangeGroup"
            v-model="tempGroupName"
            v-bkloading="{ isLoading: isLoadingEditGroup }"
            @enter="handleChangeGroupName"
            @blur="toggleShowChangeName"
        ></bk-input>
        <h3
            class="group-item"
            v-else
            @click="toggleExpandGroup(group)"
        >
            <i class="bk-drag-icon bk-drag-grag-fill hover-show"></i>
            <i class="bk-drag-icon bk-drag-angle-up-fill fold-icon" v-if="isOpen"></i>
            <i class="bk-drag-icon bk-drag-angle-right-fill fold-icon" v-else></i>
            <i class="bk-drag-icon bk-drag-folder-fill"></i>
            <span class="item-name" :title="group.groupName">{{ group.groupName }}</span>
            <bk-popconfirm
                trigger="click"
                ext-cls="g-function-pop"
                confirm-text=""
                cancel-text=""
                class="mr7"
                placement="bottom-start"
                :tippy-options="{ appendTo: 'parent' }"
            >
                <div slot="content">
                    <ul class="more-list">
                        <li
                            class="list-item"
                            @click="toggleShowChangeName"
                        >重命名</li>
                        <li
                            :class="['list-item', { disable: !computedPermissionInfo.hasPermission }]"
                            v-bk-tooltips="{
                                disabled: computedPermissionInfo.hasPermission,
                                content: computedPermissionInfo.message,
                                placements: ['bottom']
                            }"
                            @click.stop="handleDeleteGroup"
                        >删除</li>
                    </ul>
                </div>
                <i class="bk-drag-icon bk-drag-more-dot item-tool hover-show"></i>
            </bk-popconfirm>
            <i
                class="bk-drag-icon bk-drag-add-line item-tool hover-show"
                v-bk-tooltips="{ content: '添加函数', placements: ['top'] }"
                @click.stop="handleCreateFunction"
            ></i>
            <span class="item-num">{{ (group.children || []).length }}</span>
        </h3>
        <ul v-if="isOpen">
            <slot />
        </ul>
    </li>
</template>

<script>
    import { mapActions, mapGetters } from 'vuex'
    import { getDefaultFunction } from 'shared/function'

    export default {
        props: {
            group: {
                type: Object
            }
        },

        data () {
            return {
                isChangeGroup: false,
                isOpen: true,
                isLoadingEditGroup: false,
                tempGroupName: ''
            }
        },

        computed: {
            ...mapGetters(['user']),
            ...mapGetters('member', ['userPerm']),

            computedPermissionInfo () {
                if (
                    this.userPerm.roleId === 2
                    && this.user.username !== this.group.createUser
                ) {
                    return {
                        hasPermission: false,
                        message: '无删除权限'
                    }
                }

                if (this.group?.children?.length > 0) {
                    return {
                        hasPermission: false,
                        message: '该分类下有函数，不能删除'
                    }
                }

                return {
                    hasPermission: true
                }
            },

            projectId () {
                return parseInt(this.$route.params.projectId)
            }
        },

        methods: {
            ...mapActions('functions', [
                'deleteFunctionGroup',
                'editFunctionGroups'
            ]),

            toggleExpandGroup () {
                const classList = Array.from(window.event.target.classList)
                if (classList.some(className => ['item-tool', 'list-item', 'tippy-arrow'].includes(className))) {
                    return
                }
                this.isOpen = !this.isOpen
            },

            toggleShowChangeName () {
                this.isChangeGroup = !this.isChangeGroup
                if (this.isChangeGroup) {
                    this.$nextTick(() => {
                        this.tempGroupName = this.group.groupName
                        this.$refs.inputRef?.focus()
                    })
                }
            },

            handleCreateFunction () {
                const newFunction = getDefaultFunction({
                    funcName: 'Untitled',
                    projectId: this.projectId,
                    funcGroupId: this.group.id
                })
                this.$emit('insert-function', newFunction)
                this.isOpen = true
            },

            handleChangeGroupName () {
                this.isLoadingEditGroup = true
                this.editFunctionGroups({
                    projectId: this.projectId,
                    functionGroups: [{
                        ...this.group,
                        groupName: this.tempGroupName
                    }]
                }).then(() => {
                    this.clickEmptyArea()
                    this.messageSuccess('修改成功')
                    this.$emit('refresh')
                }).finally(() => {
                    this.isLoadingEditGroup = false
                })
            },

            handleDeleteGroup () {
                if (!this.computedPermissionInfo.hasPermission) return

                this.clickEmptyArea()
                this.$bkInfo({
                    title: `确认要删除函数分组【${this.group.groupName}】？`,
                    confirmLoading: true,
                    theme: 'danger',
                    confirmFn: () => {
                        return this.deleteFunctionGroup({
                            funcGroupId: this.group.id
                        }).then(() => {
                            this.messageSuccess('删除成功')
                            this.$emit('refresh')
                        })
                    }
                })
            },

            clickEmptyArea () {
                const btn = document.createElement('button')
                document.body.appendChild(btn)
                btn.click()
                document.body.removeChild(btn)
            }
        }
    }
</script>

<style lang="postcss" scoped>
    .group-item {
        height: 32px;
        display: flex;
        align-items: center;
        padding: 0 9px 0 20px;
        margin: 0;
        font-weight: normal;
        font-size: 12px;
        cursor: pointer;
        position: relative;
        .item-num {
            margin-left: 10px;
            height: 20px;
            border-radius: 2px;
            background: #f0f1f5;
            color: #979ba5;
            font-size: 12px;
            line-height: 20px;
            padding: 0 6px;
            position: absolute;
            right: 9px;
            top: 6px;
        }
        i.hover-show {
            display: none;
        }
        .mr7 {
            margin-right: 7px;
        }
        .item-name {
            flex: 1;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        }
        &:hover, &.select {
            background: #e1ecff;
            color: #3a84ff;
            padding-left: 4px;
            .bk-drag-icon {
                color: #3a84ff;
            }
            .hover-show {
                display: block;
            }
            .item-num {
                background: #a2c5fd;
                color: #ffffff;
            }
        }
        .bk-drag-icon {
            color: #c4c6cc;
            font-size: 12px;
            &.bk-drag-grag-fill {
                color: #c4c6cc;
                margin-right: 4px;
            }
            &.bk-drag-folder-fill {
                margin: 0 12px 0 8px;
                font-size: 14px;
            }
            &.bk-drag-add-line {
                margin-right: 36px;
            }
        }
        .fold-icon {
            font-size: 10px;
        }
    }
    .item-tool {
        height: 22px;
        width: 22px;
        line-height: 22px;
        text-align: center;
        font-size: 16px;
        display: inline-block;
        cursor: pointer;
        &:hover {
            border-radius: 100px;
            background: #fafbfd;
        }
    }
    ::v-deep .more-list {
        padding: 5px 0;
        width: 77px;
        .list-item {
            margin: 0;
            padding: 0 11px;
            line-height: 32px;
            &:hover {
                background: #e1ecff;
                color: #3a84ff;
                cursor: pointer;
            }
            &.disable {
                cursor: not-allowed;
                color: rgb(196, 198, 204);
                background: rgb(255, 255, 255);
            }
        }
    }
</style>
