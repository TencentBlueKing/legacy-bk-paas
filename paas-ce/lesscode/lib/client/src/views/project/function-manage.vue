<template>
    <article>
        <layout>
            <section slot="left" class="function-left">
                <h3 class="list-head">
                    <bk-input class="head-input" placeholder="请输入" :clearable="true" right-icon="bk-icon icon-search" v-model="searchGroupStr"></bk-input>
                    <bk-popconfirm trigger="click" confirm-text="" cancel-text="" :on-hide="() => (groupNameErrMessage = '')">
                        <div slot="content">
                            <bk-input :class="['add-function-group', { 'input-error': groupNameErrMessage }]"
                                placeholder="请输入函数分类，多个分类 / 分隔，回车保存"
                                @enter="addFunctionGroup"
                                @focus="groupNameErrMessage = ''"
                                @input="groupNameErrMessage = ''"
                                v-model="groupNameStr"
                                right-icon="loading"
                                v-bkloading="{ isLoading: isAddLoading }"
                                ref="addGroupInput"
                            ></bk-input>
                            <p class="input-err-message" v-if="groupNameErrMessage">{{ groupNameErrMessage }}</p>
                        </div>
                        <i class="bk-icon icon-plus" @click="handleAddGroup" v-bk-tooltips.top="'添加分类'"></i>
                    </bk-popconfirm>
                </h3>

                <vue-draggable v-model="groupList"
                    class="group-list"
                    :group="{ name: 'group-list' }"
                    :sort="searchGroupStr === ''"
                    v-bkloading="{ isLoading: isLoadingGroup }"
                >
                    <li v-for="group in groupList" :key="group.id" :class="['function-item', { select: group.id === curGroupId }]" @mousedown.self="curGroupId = group.id">
                        <i class="bk-drag-icon bk-drag-grag-fill hover-show" @mousedown.self="curGroupId = group.id"></i>
                        <i class="bk-drag-icon bk-drag-folder-fill" @mousedown.self="curGroupId = group.id"></i>
                        <span :class="['item-name', { 'show-tool-name': group.showChange }]" @mousedown.self="curGroupId = group.id" :title="group.groupName">{{ group.groupName }}</span>
                        <bk-popconfirm trigger="click" confirm-text="" cancel-text="" class="item-tool-box edit-box" :on-hide="() => (groupNameErrMessage = '', group.showChange = false)">
                            <div slot="content">
                                <bk-input :class="['add-function-group', { 'input-error': groupNameErrMessage }]"
                                    placeholder="请输入函数分类"
                                    @enter="changeGroupName(group, $event)"
                                    @focus="groupNameErrMessage = ''"
                                    @input="groupNameErrMessage = ''"
                                    v-model="group.tempName"
                                    v-bkloading="{ isLoading: isAddLoading }"
                                    :ref="group.id"
                                ></bk-input>
                                <p class="input-err-message" v-if="groupNameErrMessage">{{ groupNameErrMessage }}</p>
                            </div>
                            <span :class="['item-tool', 'hover-show', { 'click-show': group.showChange }]" @click="openChange(group)"><i class="bk-icon icon-edit2"></i></span>
                        </bk-popconfirm>
                        <bk-popover :disabled="group.functionList.length <= 0" content="该分类下有函数，不能删除" class="item-tool-box del-box">
                            <i :class="['bk-icon', 'icon-close', 'hover-show', 'disable', { 'click-show': group.showChange }]" v-if="+group.functionList.length"></i>
                            <span :class="['item-tool', 'hover-show', { 'click-show': group.showChange }]" @click="deleteItem(group.id, `删除分类（${group.groupName}）`, true)" v-else><i class="bk-icon icon-close"></i></span>
                        </bk-popover>
                        <span class="item-num" @mousedown.self="curGroupId = group.id">{{ (group.functionList || []).length }}</span>
                    </li>
                    <bk-exception class="exception-wrap-item exception-part" type="empty" scene="part" v-if="groupList.length <= 0">
                        <div v-if="!searchGroupStr">暂无分类</div>
                        <div v-else>暂无搜索结果</div>
                    </bk-exception>
                </vue-draggable>
            </section>

            <section class="function-main">
                <h3 class="function-head">
                    <bk-button theme="primary" @click="addFunction">新建</bk-button>
                    <bk-input class="head-input" placeholder="请输入" :clearable="true" right-icon="bk-icon icon-search" v-model="searchFunStr"></bk-input>
                </h3>

                <bk-table :data="curFuncList"
                    :outer-border="false"
                    :header-border="false"
                    :header-cell-style="{ background: '#f0f1f5' }"
                    v-bkloading="{ isLoading: isLoadingFunc }"
                    class="function-table"
                >
                    <bk-table-column label="函数名称" prop="funcName" show-overflow-tooltip>
                        <template slot-scope="props">
                            <span>{{ props.row.funcName || '--' }}</span>
                        </template>
                    </bk-table-column>
                    <bk-table-column label="所属分类" prop="funcGroupId" :formatter="groupFormatter" show-overflow-tooltip></bk-table-column>
                    <bk-table-column label="简介" prop="funcSummary" show-overflow-tooltip>
                        <template slot-scope="props">
                            <span>{{ props.row.funcSummary || '--' }}</span>
                        </template>
                    </bk-table-column>
                    <bk-table-column label="更新人" prop="updateUser">
                        <template slot-scope="props">
                            <label-list :list="[props.row.updateUser].filter(x => x)"></label-list>
                        </template>
                    </bk-table-column>
                    <bk-table-column label="更新时间" prop="updateTime" :formatter="timeFormatter" show-overflow-tooltip sortable></bk-table-column>
                    <bk-table-column label="引用界面">
                        <template slot-scope="props">
                            <label-list :list="(props.row.pages || []).map(x => x.pageName)"></label-list>
                        </template>
                    </bk-table-column>
                    <bk-table-column label="操作" width="180">
                        <template slot-scope="props">
                            <span class="table-bth" @click="editFunction(props.row)">编辑</span>
                            <span class="table-bth" @click="copyRow(props.row)">复制</span>
                            <span class="table-bth" @click="deleteItem(props.row.id, `删除函数【${props.row.funcName}】`, false)" v-if="(props.row.pages || []).length <= 0">删除</span>
                            <span class="table-bth disable" v-bk-tooltips="{ content: '该函数被页面引用，请修改后再删除', placements: ['top'] }" v-else>删除</span>
                        </template>
                    </bk-table-column>
                </bk-table>
            </section>
        </layout>

        <bk-sideslider :is-show.sync="funcObj.show" :quick-close="true" :title="funcObj.title" :width="796" @hidden="closeAddFunction">
            <func-form :func-data="funcObj.form" class="add-function" ref="func" slot="content"></func-form>
            <section slot="footer" class="add-footer">
                <bk-button theme="primary" @click="submitFunc">提交</bk-button>
                <bk-button @click="closeAddFunction">取消</bk-button>
            </section>
        </bk-sideslider>

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
            <p class="delete-content">{{ delObj.name }}</p>
            <div class="dialog-footer" slot="footer">
                <bk-button
                    theme="danger"
                    :loading="delObj.loading"
                    @click="requestDelete">删除</bk-button>
                <bk-button @click="delObj.show = false" :disabled="delObj.loading">取消</bk-button>
            </div>
        </bk-dialog>
    </article>
</template>

<script>
    import { mapActions, mapGetters } from 'vuex'
    import dayjs from 'dayjs'
    import layout from '@/views/system/component-manage/all/components/layout'
    import funcForm from '@/components/methods/funcForm'
    import labelList from '@/components/methods/label-list.vue'

    export default {
        components: {
            layout,
            labelList,
            funcForm
        },

        data () {
            return {
                isAddLoading: false,
                searchGroupStr: '',
                searchFunStr: '',
                groupNameStr: '',
                groupNameErrMessage: '',
                curGroupId: undefined,
                isLoadingGroup: false,
                isLoadingFunc: false,
                delObj: {
                    id: '',
                    isDeleteGroup: false,
                    loading: false,
                    show: false,
                    name: ''
                },
                funcObj: {
                    show: false,
                    isEdit: false,
                    title: '',
                    form: {}
                }
            }
        },

        computed: {
            ...mapGetters('functions', ['funcGroups']),

            groupList: {
                get () {
                    const searchReg = new RegExp(this.searchGroupStr, 'i')
                    const list = this.funcGroups.filter((group) => searchReg.test(group.groupName))
                    const groupIds = list.map(x => x.id)
                    if (!groupIds.includes(this.curGroupId)) {
                        const firstGroup = list[0]
                        if (firstGroup) this.curGroupId = firstGroup.id
                    }
                    return list
                },
                set (list) {
                    let order = 0
                    list.forEach((group) => {
                        group.order = order
                        order++
                    })
                    this.editGroups(list)
                }
            },

            curGroup () {
                return this.funcGroups.find((group) => (group.id === this.curGroupId)) || {}
            },

            curFuncList () {
                const searchReg = new RegExp(this.searchFunStr, 'i')
                return (this.curGroup.functionList || []).filter((func) => searchReg.test(func.funcName))
            }
        },

        created () {
            this.getGroupList()
        },

        methods: {
            ...mapActions('functions', [
                'getAllGroupFuncs',
                'addFunc',
                'editFunc',
                'deleteGroup',
                'deleteFunc',
                'editGroups',
                'addGroup'
            ]),

            handleAddGroup () {
                this.groupNameStr = ''
                setTimeout(() => {
                    this.$refs.addGroupInput.focus()
                }, 200)
            },

            addFunction () {
                this.funcObj.show = true
                this.funcObj.isEdit = false
                this.funcObj.title = '新增函数'
                this.funcObj.form.funcGroupId = this.curGroupId
            },

            editFunction (row) {
                this.funcObj.show = true
                this.funcObj.isEdit = true
                this.funcObj.title = '编辑函数'
                Object.assign(this.funcObj.form, row)
            },

            copyRow (row) {
                this.funcObj.show = true
                this.funcObj.isEdit = false
                this.funcObj.title = '复制函数'
                const date = new Date()
                let funcName = row.funcName
                const functionList = this.curGroup.functionList
                let repeatFun = functionList.find(x => x.funcName === funcName)
                while (repeatFun) {
                    funcName = `${funcName}_copy`
                    repeatFun = functionList.find(x => x.funcName === funcName)
                }
                Object.assign(this.funcObj.form, row, {
                    id: undefined,
                    funcName,
                    updateUser: '',
                    createUser: '',
                    updateTime: '',
                    createTime: date
                })
            },

            submitFunc () {
                this.$refs.func.validate().then((postData) => {
                    if (!postData) return
                    const add = () => this.addFunc({ groupId: this.curGroupId, func: postData })
                    const edit = () => this.editFunc({ groupId: this.curGroupId, func: postData })

                    const curMethod = this.funcObj.isEdit ? edit : add
                    curMethod().then(() => {
                        this.curGroupId = postData.funcGroupId
                        this.closeAddFunction()
                        this.$bkMessage({ theme: 'success', message: `${this.funcObj.title}成功` })
                    })
                })
            },

            closeAddFunction () {
                const defaultForm = {
                    funcName: '',
                    funcGroupId: undefined,
                    funcType: 0,
                    funcParams: [],
                    funcApiUrl: '',
                    funcMethod: 'get',
                    funcApiData: '',
                    funcSummary: '',
                    funcBody: '',
                    id: undefined
                }
                this.funcObj.show = false
                Object.assign(this.funcObj.form, defaultForm)
            },

            getGroupList () {
                this.isLoadingGroup = true
                const projectId = this.$route.params.projectId
                this.getAllGroupFuncs(projectId).then(() => {
                    const firstGroup = this.funcGroups[0] || {}
                    this.curGroupId = firstGroup.id
                }).finally(() => {
                    this.isLoadingGroup = false
                })
            },

            deleteItem (id, name, isDeleteGroup) {
                this.delObj.show = true
                this.delObj.id = id
                this.delObj.name = name
                this.delObj.isDeleteGroup = isDeleteGroup
            },

            openChange (group) {
                this.$set(group, 'tempName', group.groupName)
                this.$set(group, 'showChange', true)
                setTimeout(() => {
                    const el = this.$refs[group.id][0]
                    if (el) el.focus()
                }, 200)
            },

            requestDelete () {
                this.delObj.loading = true
                const projectId = this.$route.params.projectId
                const postData = { id: this.delObj.id, projectId }

                const deleteFuncGroup = () => this.deleteGroup(postData).then(() => {
                    if (this.delObj.id === this.curGroupId) {
                        const firstGroup = this.groupList[0] || {}
                        this.curGroupId = firstGroup.id
                    }
                })
                const deleteFunc = () => this.deleteFunc({ groupId: this.curGroupId, funcId: this.delObj.id })

                const curMethod = this.delObj.isDeleteGroup ? deleteFuncGroup : deleteFunc
                curMethod().then(() => {
                    this.$bkMessage({ theme: 'success', message: '删除成功' })
                    this.delObj.show = false
                }).finally(() => {
                    this.delObj.loading = false
                })
            },

            changeGroupName (group, groupName) {
                this.checkGroupName(groupName).then(() => {
                    this.isAddLoading = true
                    const postData = [Object.assign({}, group, { groupName })]
                    this.editGroups(postData).then(() => {
                        this.clickEmptyArea()
                        this.$bkMessage({ theme: 'success', message: '修改成功' })
                    }).finally(() => {
                        this.isAddLoading = false
                    })
                }).catch((err) => {
                    this.groupNameErrMessage = err.message
                })
            },

            addFunctionGroup () {
                this.checkGroupName(this.groupNameStr).then(() => {
                    this.isAddLoading = true
                    const projectId = this.$route.params.projectId
                    const postData = {
                        inputStr: this.groupNameStr,
                        projectId
                    }
                    this.addGroup(postData).then((res) => {
                        this.groupNameStr = ''
                        this.clickEmptyArea()
                        this.$bkMessage({ theme: 'success', message: '添加成功' })
                    }).finally(() => {
                        this.isAddLoading = false
                    })
                }).catch((err) => {
                    this.groupNameErrMessage = err.message
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
                    if (hasRepeatName) reject(new Error('不能创建相同名字的分类'))
                    else if (nameList.some(x => x === '')) reject(new Error('分类名不能为空'))
                    else if (this.groupList.find(x => nameList.includes(x.groupName))) reject(new Error('分类名重复，请修改后重试'))
                    else resolve()
                })
            },

            clickEmptyArea () {
                const btn = document.createElement('button')
                document.body.appendChild(btn)
                btn.click()
                document.body.removeChild(btn)
            },

            timeFormatter (obj, con, val) {
                return val ? dayjs(val).format('YYYY-MM-DD HH:mm:ss') : '--'
            },

            groupFormatter (obj, con, val) {
                const curGroup = this.funcGroups.find(x => x.id === val) || {}
                return curGroup.groupName
            }
        }
    }
</script>

<style lang="postcss" scoped>
    .add-footer {
        margin-left: 30px;
        button {
            margin-right: 10px;
        }
    }

    .function-main {
        width: 100%;
        height: 100%;
        padding: 16px 24px 16px 14px;
        .function-head {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin: 0 0 14px;
            padding: 0;
            font-weight: normal;
            .head-input {
                width: 400px;
            }
        }
        .function-table {
            height: calc(100% - 46px);
            /deep/ .bk-table-body-wrapper {
                height: calc(100% - 43px);
                overflow-y: auto;
            }
            .max-tabel-prop {
                display: block;
                max-width: 100%;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: normal;
            }
        }
        .table-bth {
            color: #3a84ff;
            margin-right: 17px;
            display: inline-block;
            cursor: pointer;
            &.disable {
                color: #b9bbc1;
                cursor: not-allowed;
            }
        }
    }

    .function-item {
        height: 40px;
        display: flex;
        align-items: center;
        max-width: 100%;
        padding: 0 20px 0 14px;
        cursor: grab;
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

    .function-left {
        height: 100%;
        .group-list {
            height: calc(100% - 63px);
            overflow-y: auto;
            .exception-wrap-item {
                position: absolute;
                top: 50%;
                transform: translateY(-50%);
            }
        }
    }

    .add-function-group {
        width: 340px;
        margin-top: 6px;
    }
    .input-error {
        /deep/ input {
            border-color: #ff5656;
            color: #ff5656;
        }
    }
    .input-err-message {
        margin: 5px 0 -7px 0;
        padding: 0;
        color: #ff5656;
    }
    /deep/ .delete-dialog-wrapper {
        .delete-content {
            text-align: center;
            font-size: 14px;
            color: #63656e;
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
