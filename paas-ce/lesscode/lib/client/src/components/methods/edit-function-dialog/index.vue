<template>
    <transition name="fade">
        <article class="function-home" v-if="show">
            <layout
                class="function-main method-layout"
                v-bkloading="{ isLoading }"
            >
                <section slot="left" class="func-left">
                    <h3 class="left-title">
                        <div class="title-name">
                            <span>函数库</span>
                            <version-tag :version-name="versionName" />
                        </div>
                        <bk-popconfirm
                            trigger="click"
                            confirm-text=""
                            cancel-text=""
                            theme="light"
                            ext-cls="g-function-pop"
                        >
                            <div slot="content">
                                <bk-input
                                    right-icon="loading"
                                    class="add-function-group"
                                    placeholder="请输入函数分类，多个分类 / 分隔，回车保存"
                                    v-model="newGroupName"
                                    v-bkloading="{ isLoading: isCreatingGroup }"
                                    @enter="handleCreateGroup"
                                ></bk-input>
                            </div>
                            <i
                                class="bk-icon icon-plus"
                                v-bk-tooltips="{ content: '添加分类', placements: ['top'] }"
                                @click="newGroupName = ''"
                            ></i>
                        </bk-popconfirm>
                    </h3>

                    <bk-input
                        class="left-input"
                        placeholder="函数名称"
                        right-icon="bk-icon icon-search"
                        clearable
                        v-model="searchString"
                        @change="handleFilterFunction"
                    ></bk-input>

                    <vue-draggable
                        tag="ul"
                        class="scroll-main group-list"
                        handle=".bk-drag-grag-fill"
                        :group="{ name: 'group-list' }"
                        :list="renderGroupList"
                        @change="handleGroupSort"
                    >
                        <render-group
                            v-for="group in renderGroupList"
                            :key="group.id"
                            :group="group"
                            @refresh="refreshStatus"
                            @insert-function="handleInsertFunction(group, $event)"
                        >
                            <render-item
                                v-for="functionData in group.children"
                                :key="functionData.id"
                                :function-data="functionData"
                                :chosen-function-name="chosenFunction.funcName"
                                @refresh="refreshStatus"
                                @choose="handleChooseFunction"
                                @insert-function="handleInsertFunction(group, $event)"
                            />
                        </render-group>
                    </vue-draggable>
                </section>

                <edit-func-form
                    ref="functionForm"
                    :func-data="chosenFunction"
                    @success-save="handleSuccessSave"
                    @close="handleCloseDialog"
                />
            </layout>
        </article>
    </transition>
</template>

<script>
    import { mapActions, mapGetters } from 'vuex'
    import Layout from '@/components/ui/layout'
    import VersionTag from '@/components/ui/project-version-tag'
    import EditFuncForm from '@/components/methods/forms/edit-func-form'
    import RenderGroup from './children/group.vue'
    import RenderItem from './children/item.vue'

    export default {
        components: {
            Layout,
            EditFuncForm,
            VersionTag,
            RenderGroup,
            RenderItem
        },

        props: {
            show: {
                type: Boolean
            },
            selectFuncCode: {
                type: String,
                default: ''
            },
            insertFunction: {
                type: Object,
                default: undefined
            }
        },

        data () {
            return {
                searchString: '',
                newGroupName: '',
                isCreatingGroup: false,
                isLoading: false,
                groupList: [],
                renderGroupList: [],
                chosenFunction: {}
            }
        },

        computed: {
            ...mapGetters('projectVersion', { versionId: 'currentVersionId', versionName: 'currentVersionName' }),

            projectId () {
                return parseInt(this.$route.params.projectId)
            }
        },

        watch: {
            show (val) {
                if (val) {
                    this.refreshStatus().then(() => {
                        // 打开面板并初始化数据以后，需要判断是新增函数还是选择已有函数
                        if (this.insertFunction) {
                            this.handleInsertFunction(this.renderGroupList[0], this.insertFunction)
                        } else {
                            this.handleChooseDefaultFunction()
                        }
                    })
                }
            }
        },

        methods: {
            ...mapActions('functions', [
                'getGroupList',
                'getFunctionList',
                'createFunctionGroup',
                'editFunctionGroups'
            ]),

            refreshStatus () {
                this.isLoading = true
                return Promise.all([
                    this.getGroupList({
                        projectId: this.projectId,
                        versionId: this.versionId
                    }),
                    this.getFunctionList({
                        projectId: this.projectId,
                        versionId: this.versionId
                    })
                ]).then(([groupList, functionList]) => {
                    // 更新列表数据
                    this.groupList = groupList.map((group) => {
                        group.children = functionList.filter(functionData => functionData.funcGroupId === group.id)
                        return group
                    })
                    // 根据搜索过滤展示的列表数据
                    this.handleFilterFunction()
                }).finally(() => {
                    this.isLoading = false
                })
            },

            handleFilterFunction () {
                const searchReg = new RegExp(this.searchString?.trim(), 'i')
                this.renderGroupList = this.groupList.reduce((groupList, group) => {
                    const children = group.children.filter((functionData) => searchReg.test(functionData.funcName))
                    groupList.push({
                        ...group,
                        children
                    })
                    return groupList
                }, [])
            },

            handleChooseDefaultFunction () {
                const functionList = this.groupList
                    .map(group => group.children)
                    .flat()
                // 上次已选择的函数
                const chosenFunction = functionList.find(functionData => functionData.funcName === this.chosenFunction.funcName)
                // 参数传入需要选择的函数
                const selectFunction = functionList.find(functionData => functionData.funcCode === this.selectFuncCode)
                // 第一个函数
                const firstFunction = functionList[0]
                // 设置当前选择函数
                this.chosenFunction = selectFunction || chosenFunction || firstFunction
            },

            handleInsertFunction (renderGroup, functionData) {
                // 设置函数名称不重复
                const functionList = this.groupList.map(group => group.children).flat()
                while (functionList.some(x => x.funcName === functionData.funcName)) {
                    functionData.funcName += 'Copy'
                }
                // 插入数据
                renderGroup.children.push(functionData)
                // 选中新增的数据
                this.handleChooseFunction(functionData)
            },

            handleChooseFunction (functionData) {
                const chooseFunction = () => {
                    this.chosenFunction = functionData
                    // 当前选中的数据未保存，设置编辑态
                    if (!functionData.id) {
                        this.$nextTick(() => {
                            this.$refs.functionForm.formChanged = true
                        })
                    }
                }
                const saveChooseFunction = () => {
                    this.$refs
                        ?.functionForm
                        ?.handleSaveFunction()
                        ?.then(chooseFunction)
                }
                const cancelSaveFunction = () => {
                    // 未保存的新增函数需要删除
                    if (!this.chosenFunction.id) {
                        this.renderGroupList.forEach((group) => {
                            const index = group.children.findIndex(groupFunction => groupFunction === this.chosenFunction)
                            if (index > -1) {
                                group.children.splice(index, 1)
                            }
                        })
                    }
                    chooseFunction()
                }
                // 函数未保存或者函数经过了修改，需要给出切换提示
                if (this.$refs.functionForm.formChanged) {
                    this.$bkInfo({
                        title: '确认切换',
                        subTitle: '不保存则会丢失当前数据',
                        okText: '保存并切换',
                        cancelText: '不保存',
                        confirmLoading: true,
                        closeIcon: false,
                        confirmFn: saveChooseFunction,
                        cancelFn: cancelSaveFunction
                    })
                } else {
                    chooseFunction()
                }
            },

            handleSuccessSave () {
                this.refreshStatus().then(this.handleChooseDefaultFunction)
            },

            handleGroupSort () {
                let order = 0
                this.groupList.forEach((group) => {
                    group.order = order
                    order++
                })
                this.editFunctionGroups({
                    projectId: this.projectId,
                    versionId: this.versionId,
                    functionGroups: this.groupList
                })
            },

            handleCreateGroup () {
                this.checkGroupName(this.newGroupName).then(() => {
                    this.isCreatingGroup = true
                    const postData = {
                        groupName: this.newGroupName,
                        projectId: this.projectId,
                        versionId: this.versionId
                    }
                    this.createFunctionGroup(postData).then(() => {
                        this.newGroupName = ''
                        this.clickEmptyArea()
                        this.messageSuccess('添加成功')
                        this.refreshStatus()
                    }).finally(() => {
                        this.isCreatingGroup = false
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

            handleCloseDialog () {
                this.$emit('update:show', false)
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
    .function-home {
        position: fixed !important;
        top: 0;
        left: 0;
        bottom: 0;
        right: 0;
        background: rgba(0, 0, 0, 0.6);
        z-index: 2000;
        color: #63656e;
        .function-main {
            position: absolute;
            width: 86%;
            height: 74%;
            top: 13%;
            left: 7%;
            border-radius: 2px;
            box-shadow: 0px 4px 12px 0px rgba(0,0,0,0.2);
        }
    }
    .func-left {
        height: 100%;
        overflow: hidden;
        background: #fff;
        .group-list {
            height: calc(100% - 115px);
            margin-bottom: 10px;
            overflow-y: auto;
            .change-group-name {
                margin: 5px 0;
                padding: 0 4px;
                height: 22px;
                line-height: 22px;
            }
            ::v-deep .sortable-ghost {
                border: 1px dashed #3a84ff;
                height: 32px;
                line-height: 32px;
                box-sizing: border-box;
                .group-item {
                    height: 30px;
                    line-height: 30px;
                    padding: 0 8px 0 19px;
                }
            }
        }
        .scroll-main::-webkit-scrollbar {
            width: 6px;
            height: 5px;
        }
        .scroll-main::-webkit-scrollbar-thumb {
            border-radius: 20px;
            background-color: #dcdee5;
            -webkit-box-shadow: inset 0 0 6px hsla(0, 0%, 80%, .3);
        }
    }
    .left-title {
        margin: 0;
        padding: 0 14px 0 22px;
        height: 57px;
        font-weight: normal;
        color: #63656e;
        border-bottom: 1px solid #dcdee5;
        display: flex;
        justify-content: space-between;
        align-items: center;

        .title-name {
            display: flex;
            align-items: center;

            ::v-deep .version-tag {
                margin-left: 8px;
            }
        }

        .icon-plus {
            cursor: pointer;
            font-size: 26px;
            &:hover {
                color: #3a84ff;
            }
        }
    }
    .left-input {
        width: calc(100% - 12px);
        margin: 9px 6px 7px;
    }
    .add-function-group {
        width: 340px;
        margin-top: 6px;
    }
</style>
