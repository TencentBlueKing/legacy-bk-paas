<template>
    <section class="group-list">
        <h3 class="list-head">
            <bk-input
                class="head-input"
                placeholder="请输入"
                right-icon="bk-icon icon-search"
                clearable
                v-model="searchGroupString"
                @change="handerSearchGroup"
            ></bk-input>
            <bk-popconfirm
                trigger="click"
                confirm-text=""
                cancel-text="">
                <div slot="content">
                    <bk-input
                        class="add-function-group"
                        placeholder="请输入函数分类，多个分类 / 分隔，回车保存"
                        right-icon="loading"
                        ref="addGroupInput"
                        v-bkloading="{ isLoading: isLoadingCreateGroup }"
                        v-model="newGroupName"
                        @enter="handleCreateGroup"
                    ></bk-input>
                </div>
                <i class="bk-icon icon-plus" v-bk-tooltips.top="'添加分类'"></i>
            </bk-popconfirm>
        </h3>

        <vue-draggable
            class="group-list"
            :group="{ name: 'group-list' }"
            :disabled="!!searchGroupString"
            :list="renderGroupList"
            v-bkloading="{ isLoading: isLoadingGroupList }"
            @change="handleGroupSort"
        >
            <li
                v-for="group in renderGroupList"
                :key="group.id"
                :class="['function-item', { select: group.id === activeGroup.id }]"
                @click="chooseGroup(group)">
                <i class="bk-drag-icon bk-drag-grag-fill hover-show"></i>
                <i class="bk-drag-icon bk-drag-folder-fill"></i>
                <span
                    :class="['item-name', { 'show-tool-name': group.showChange }]"
                    :title="group.groupName"
                >{{ group.groupName }}</span>
                <bk-popconfirm
                    trigger="click"
                    confirm-text=""
                    cancel-text=""
                    class="item-tool-box edit-box"
                    :on-hide="() => group.showChange = false"
                >
                    <div slot="content">
                        <bk-input
                            placeholder="请输入函数分类"
                            :class="['add-function-group']"
                            :ref="group.id"
                            v-model="group.tempName"
                            v-bkloading="{ isLoading: isLoadingCreateGroup }"
                            @enter="submitChangeGroup(group, $event)"
                        ></bk-input>
                    </div>
                    <span
                        :class="['item-tool', 'hover-show', { 'click-show': group.showChange }]"
                        @click="handleChangeGroup(group)"
                    >
                        <i class="bk-icon icon-edit2"></i>
                    </span>
                </bk-popconfirm>
                <bk-popover
                    class="item-tool-box del-box"
                    :disabled="getDeletePermission(group).hasPermission"
                    :content="getDeletePermission(group).message"
                >
                    <span
                        :class="['item-tool', 'hover-show', { 'click-show': group.showChange }]"
                        @click="submitDeleteGroup(group)">
                        <i :class="['bk-icon icon-close', { disable: !getDeletePermission(group).hasPermission }]"></i>
                    </span>
                </bk-popover>
                <span class="item-num">
                    {{ group.funcCount }}
                </span>
            </li>
            <bk-exception
                class="exception-wrap-item exception-part"
                type="empty"
                scene="part"
                v-if="renderGroupList.length <= 0"
            >
                <div>暂无数据</div>
            </bk-exception>
        </vue-draggable>

        <bk-dialog v-model="delObj.show"
            render-directive="if"
            theme="primary"
            ext-cls="delete-dialog-wrapper"
            title="确定删除？"
            width="400"
            footer-position="center"
            :mask-close="false"
            :auto-close="false"
        >
            <p class="delete-content">{{ delObj.nameTips }}</p>
            <div class="dialog-footer" slot="footer">
                <bk-button
                    theme="danger"
                    :loading="delObj.loading"
                    @click="confirmDeleteGroup">删除</bk-button>
                <bk-button @click="delObj.show = false" :disabled="delObj.loading">取消</bk-button>
            </div>
        </bk-dialog>
    </section>
</template>

<script>
    import {
        mapGetters,
        mapActions
    } from 'vuex'

    export default {
        data () {
            return {
                searchGroupString: '',
                newGroupName: '',
                isLoadingCreateGroup: false,
                isLoadingGroupList: false,
                activeGroup: {},
                groupList: [],
                renderGroupList: [],
                delObj: {
                    id: '',
                    loading: false,
                    show: false
                }
            }
        },

        computed: {
            ...mapGetters(['user']),
            ...mapGetters('member', ['userPerm']),
            ...mapGetters('projectVersion', ['currentVersionId']),

            projectId () {
                return parseInt(this.$route.params.projectId)
            }
        },

        created () {
            this.initData()
        },

        methods: {
            ...mapActions('functions', [
                'getGroupList',
                'getFunctionList',
                'deleteFunctionGroup',
                'editFunctionGroups',
                'createFunctionGroup'
            ]),

            initData () {
                this.isLoadingGroupList = true
                Promise.all([
                    this.getGroupList({ projectId: this.projectId, versionId: this.currentVersionId }),
                    this.getFunctionList({ projectId: this.projectId, versionId: this.currentVersionId })
                ]).then(([groupList, functionList]) => {
                    this.groupList = groupList.map((group) => {
                        const filterFunList = functionList.filter(fun => fun.funcGroupId === group.id)
                        group.funcCount = filterFunList.length
                        return group
                    })
                    this.renderGroupList = this.groupList
                    const defaultGroup = this.activeGroup.id
                        ? this.activeGroup
                        : this.groupList[0] || {}
                    this.chooseGroup(defaultGroup)
                }).catch((err) => {
                    this.messageError(err.message || err)
                }).finally(() => {
                    this.isLoadingGroupList = false
                })
            },

            handerSearchGroup () {
                const searchReg = new RegExp(this.searchGroupString?.trim(), 'i')
                this.renderGroupList = this.groupList.filter((group) => searchReg.test(group.groupName))
            },

            handleGroupSort () {
                let order = 0
                this.groupList.forEach((group) => {
                    group.order = order
                    order++
                })
                this.editFunctionGroups({
                    projectId: this.projectId,
                    functionGroups: this.groupList
                }).catch((err) => {
                    this.messageError(err.message || err)
                })
            },

            getDeletePermission (group) {
                if (this.userPerm.roleId === 2 && this.user.username !== group.createUser) {
                    return {
                        hasPermission: false,
                        message: '无删除权限'
                    }
                }

                if (group.funcCount > 0) {
                    return {
                        hasPermission: false,
                        message: '该分类下有函数，不能删除'
                    }
                }

                return {
                    hasPermission: true
                }
            },

            chooseGroup (group) {
                this.activeGroup = group
                this.$emit('groupChange', group)
            },

            handleChangeGroup (group) {
                this.$set(group, 'tempName', group.groupName)
                this.$set(group, 'showChange', true)
                setTimeout(() => {
                    const el = this.$refs[group.id][0]
                    if (el) el.focus()
                }, 200)
            },

            submitChangeGroup (group, groupName) {
                this.checkGroupName(groupName).then(() => {
                    this.isLoadingCreateGroup = true
                    this.editFunctionGroups({
                        projectId: this.projectId,
                        functionGroups: [{
                            ...group,
                            groupName
                        }]
                    }).then(() => {
                        this.clickEmptyArea()
                        this.messageSuccess('修改成功')
                        this.initData()
                    }).finally(() => {
                        this.isLoadingCreateGroup = false
                    })
                }).catch((err) => {
                    this.messageError(err.message || err)
                })
            },

            submitDeleteGroup (group) {
                if (!this.getDeletePermission(group).hasPermission) return

                this.delObj.show = true
                this.delObj.id = group.id
                this.delObj.nameTips = `删除分类（${group.groupName}）`
            },

            confirmDeleteGroup () {
                this.delObj.loading = true
                this.deleteFunctionGroup({
                    funcGroupId: this.delObj.id
                }).then(() => {
                    this.messageSuccess('删除成功')
                    this.initData()
                    this.delObj.show = false
                }).finally(() => {
                    this.delObj.loading = false
                })
            },

            handleCreateGroup () {
                this.checkGroupName(this.newGroupName).then(() => {
                    this.isLoadingCreateGroup = true
                    const postData = {
                        groupName: this.newGroupName,
                        projectId: this.projectId,
                        versionId: this.versionId
                    }
                    this.createFunctionGroup(postData).then((res) => {
                        this.newGroupName = ''
                        this.clickEmptyArea()
                        this.messageSuccess('添加成功')
                        this.initData()
                    }).finally(() => {
                        this.isLoadingCreateGroup = false
                    })
                }).catch((err) => {
                    this.messageError(err.message || err)
                })
            },

            checkGroupName (name = '') {
                return new Promise((resolve, reject) => {
                    const nameList = name.split('/')
                    const nameNum = {}
                    let hasRepeatName = false
                    nameList.forEach((name) => {
                        if (nameNum[name]) hasRepeatName = true
                        else nameNum[name] = 1
                    })
                    if (hasRepeatName) {
                        reject(new Error('不能创建相同名字的分类'))
                    } else if (nameList.some(x => x === '')) {
                        reject(new Error('分类名不能为空'))
                    } else if (this.groupList.find(group => nameList.includes(group.groupName))) {
                        reject(new Error('分类名重复，请修改后重试'))
                    } else {
                        resolve()
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
    .group-list {
        height: 100%;
    }

    .function-item {
        height: 40px;
        display: flex;
        align-items: center;
        max-width: 100%;
        padding: 0 20px 0 14px;
        cursor: pointer;
        color: #63656e;
        position: relative;
        /deep/ &.sortable-ghost {
            border: 1px dashed #3a84ff;
            padding: 0 19px 0 13px;
            box-sizing: border-box;
        }
        .bk-drag-icon {
            color: #979ba5;
        }
        &.select {
            background: #e1ecff;
            color: #3a84ff;
            .item-num {
                background: #a2c5fd;
                color: #ffffff;
            }
            .bk-drag-folder-fill {
                color: #3a84ff;
            }
        }
        .disable {
            &.bk-icon {
                height: 32px;
                width: 32px;
                line-height: 32px;
                text-align: center;
                font-size: 20px;
                color: #cacdd6;
                cursor: not-allowed;
            }
        }
        .item-name {
            flex: 1;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            &.show-tool-name {
                padding-right: 75px;
            }
        }
        .item-tool-box {
            position: absolute;
            &.edit-box {
                right: 95px;
            }
            &.del-box {
                right: 55px;
            }
        }
        .item-tool {
            cursor: pointer;
            height: 32px;
            width: 32px;
            line-height: 32px;
            text-align: center;
            .bk-icon {
                font-size: 20px;
            }
            &:hover {
                border-radius: 100px;
                background: #fafbfd;
            }
        }
        .bk-drag-folder-fill {
            margin: 0 13px 0 4px;
        }
        .item-num {
            margin-left: 8px;
            height: 20px;
            border-radius: 2px;
            background: #f0f1f5;
            color: #979ba5;
            font-size: 12px;
            line-height: 20px;
            padding: 0 6px;
        }
        .hover-show {
            display: none;
        }
        .click-show {
            display: block;
        }
        &:hover {
            background: #e1ecff;
            color: #3a84ff;
            padding-left: 0;
            .bk-drag-folder-fill {
                color: #3a84ff;
            }
            .hover-show {
                display: block;
            }
            .item-num {
                background: #a2c5fd;
                color: #ffffff;
            }
            .item-name {
                padding-right: 75px;
            }
        }
    }

    .list-head {
        width: 100%;
        display: flex;
        align-items: center;
        font-weight: normal;
        margin: 0;
        padding: 16px 13px 15px 18px;
        .head-input {
            margin-right: 7px;
        }
        .icon-plus {
            cursor: pointer;
            font-size: 26px;
            &:hover {
                color: #3a84ff;
            }
        }
    }

    .group-list {
        height: calc(100% - 63px);
        overflow-y: auto;
        .exception-wrap-item {
            position: absolute;
            top: 50%;
            transform: translateY(-50%);
        }
    }

    .add-function-group {
        width: 340px;
        margin-top: 6px;
    }

    /deep/ .delete-dialog-wrapper {
        .delete-content {
            text-align: center;
            font-size: 14px;
            color: #63656e;
            margin: 0;
            word-break: break-all;
        }
        .bk-dialog-footer {
            text-align: center;
            padding: 0 65px 30px;
            background-color: #fff;
            border: none;
            border-radius: 0;
        }
        .dialog-footer {
            button {
                width: 86px;
                &:first-child {
                    margin-right: 10px;
                }
            }
        }
    }
</style>
