<template>
    <transition name="fade">
        <article class="function-home" v-if="show" @mousedown.self="closeFunction">
            <layout class="function-main method-layout" @resize="resizeLayOut" :init-width="initWidth <= 240 ? 240 : initWidth" ref="methodMain">
                <section slot="left" class="func-left">
                    <h3 class="left-title">
                        <span>函数库</span>
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
                                ></bk-input>
                                <p class="input-err-message" v-if="groupNameErrMessage">{{ groupNameErrMessage }}</p>
                            </div>
                            <i class="bk-icon icon-plus" @click="groupNameStr = ''" v-bk-tooltips="{ content: '添加分类', placements: ['top'] }"></i>
                        </bk-popconfirm>
                    </h3>

                    <bk-input class="left-input" placeholder="函数名称" :clearable="true" right-icon="bk-icon icon-search" v-model="searchFunctionStr"></bk-input>

                    <vue-draggable v-model="groupList"
                        :sort="true"
                        :group="{ name: 'group-list' }"
                        tag="ul"
                        class="scroll-main group-list"
                    >
                        <li v-for="group in groupList" :key="group.id">
                            <bk-input v-if="changeGroupIds.includes(group.id)"
                                v-model="tempName"
                                @enter="handleChangeGroupName(group)"
                                @blur="handleChangeBlur(group.id)"
                                v-bkloading="{ isLoading: isAddLoading }"
                                size="small"
                                :ref="group.id"
                                class="change-group-name"
                            ></bk-input>
                            <h3 :class="[{ select: selectGroup === group.id }, 'group-item']" @click.self="expandGroup(group)" v-else>
                                <i class="bk-drag-icon bk-drag-grag-fill hover-show" @click.self="expandGroup(group)"></i>
                                <i class="bk-drag-icon bk-drag-angle-up-fill fold-icon" v-if="openGroupIds.includes(group.id)" @click.self="expandGroup(group)"></i>
                                <i class="bk-drag-icon bk-drag-angle-right-fill fold-icon" v-else @click.self="expandGroup(group)"></i>
                                <i class="bk-drag-icon bk-drag-folder-fill" @click.self="expandGroup(group)"></i>
                                <span class="item-name" @click.self="expandGroup(group)" :title="group.groupName">{{ group.groupName }}</span>
                                <bk-popconfirm trigger="click" ext-cls="label-pop" confirm-text="" cancel-text="" class="mr7" placement="bottom-start" :on-hide="() => (selectGroup = '')">
                                    <div slot="content">
                                        <ul class="more-list">
                                            <li class="list-item" @click="changeGroupName(group)">重命名</li>
                                            <li class="disable list-item" v-if="group.functionList.length" v-bk-tooltips="{ content: '该分类下有函数，不能删除', placements: ['bottom'] }">删除</li>
                                            <li class="list-item" @click.stop="deleteItem(group.id, `删除分类（${group.groupName}）`, true)" v-else>删除</li>
                                        </ul>
                                    </div>
                                    <i class="bk-drag-icon bk-drag-more-dot item-tool hover-show" @click="selectGroup = group.id"></i>
                                </bk-popconfirm>
                                <i class="bk-drag-icon bk-drag-add-line item-tool hover-show" @click.stop="handleAddFunc(group)" v-bk-tooltips="{ content: '添加函数', placements: ['top'] }"></i>
                                <span class="item-num" @click.self="expandGroup(group)">{{ (group.functionList || []).length }}</span>
                            </h3>
                            <ul v-if="openGroupIds.includes(group.id)">
                                <li v-for="func in group.functionList" :key="func.id" :class="['func-item', { select: func.id === chooseId }]" @click="chooseFunction(func)">
                                    <span class="func-name" :title="func.funcName">{{ func.funcName }}</span>
                                    <i class="bk-drag-icon bk-drag-close-line item-tool hover-show"
                                        @click.stop="deleteItem(func.id, `删除函数【${func.funcName}】`, false)"
                                        v-if="(func.pages || []).length <= 0"
                                    ></i>
                                    <i class="bk-drag-icon bk-drag-close-line hover-show disable" v-else @click.stop v-bk-tooltips="{ content: '该函数被页面引用，请修改后再删除', placements: ['top'] }"></i>
                                </li>
                            </ul>
                        </li>
                    </vue-draggable>
                </section>

                <main class="func-main">
                    <func-form class="func-form" size="small" :func-data="curFunc" ref="func" @formChange="formChanged = true"></func-form>

                    <footer class="main-footer">
                        <bk-button theme="primary" @click="saveFunc" :loading="isSaving" :disabled="!formChanged">保存</bk-button>
                    </footer>
                </main>

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

                <section class="icon-style">
                    <span v-if="!isFull">
                        <i class="bk-drag-icon bk-drag-code-full-screen" @click="openFullScreen"></i>
                        <i class="bk-drag-icon bk-drag-close-line" @click="closeFunction"></i>
                    </span>
                    <span v-else @click="exitFullScreen" class="un-full-screen" style="right: 20px;">
                        <i class="bk-drag-icon bk-drag-un-full-screen"></i>
                        <span>退出全屏</span>
                    </span>
                </section>
            </layout>
        </article>
    </transition>
</template>

<script>
    import { mapActions, mapGetters } from 'vuex'
    import layout from '@/components/ui/layout'
    import funcForm from '@/components/methods/funcForm'

    export default {
        components: {
            layout,
            funcForm
        },

        props: {
            show: Boolean
        },

        data () {
            return {
                initWidth: document.documentElement.offsetWidth * 260 / 1920,
                groupNameErrMessage: '',
                groupNameStr: '',
                searchFunctionStr: '',
                chooseId: '',
                selectGroup: '',
                isAddLoading: false,
                isLoadingGroup: false,
                isSaving: false,
                tempName: '',
                isFull: false,
                formChanged: false,
                loadingGroupIds: [],
                openGroupIds: [],
                changeGroupIds: [],
                delObj: {
                    id: '',
                    isDeleteGroup: false,
                    loading: false,
                    show: false,
                    name: ''
                }
            }
        },

        computed: {
            ...mapGetters('functions', ['funcGroups']),

            groupList: {
                get () {
                    const funcReg = new RegExp(this.searchFunctionStr, 'i')
                    const groupCopy = JSON.parse(JSON.stringify(this.funcGroups))
                    groupCopy.forEach((group) => (group.functionList = group.functionList.filter(x => funcReg.test(x.funcName))))
                    return groupCopy
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
                return this.funcGroups.find((group) => {
                    return (group.functionList || []).findIndex((func) => (func.id === this.chooseId)) > -1
                }) || {}
            },

            curFunc () {
                return (this.curGroup.functionList || []).find(x => x.id === this.chooseId) || {}
            }
        },

        watch: {
            show (val) {
                if (val) {
                    this.initData()
                    window.addEventListener('resize', this.handleFullScreen)
                } else {
                    window.removeEventListener('resize', this.handleFullScreen)
                }
            }
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

            initData () {
                this.isLoadingGroup = true
                const projectId = this.$route.params.projectId
                this.getAllGroupFuncs(projectId).then(() => {
                    const firstGroup = this.funcGroups[0] || {}
                    this.openGroupIds.push(firstGroup.id)
                    const funcList = firstGroup.functionList || []
                    const firFunc = funcList[0] || {}
                    this.chooseId = firFunc.id
                }).catch((err) => {
                    this.$bkMessage({ theme: 'error', message: err.message || err })
                }).finally(() => {
                    this.isLoadingGroup = false
                })
            },

            chooseFunction (func) {
                const confirmFn = () => {
                    this.saveFunc().then(() => {
                        this.chooseId = func.id
                    })
                }
                const cancelFn = () => {
                    this.chooseId = func.id
                    this.formChanged = false
                }
                if (this.formChanged) {
                    this.$bkInfo({
                        title: '确认切换',
                        subTitle: '不保存则会丢失当前数据',
                        okText: '保存并切换',
                        cancelText: '不保存',
                        closeIcon: false,
                        confirmFn,
                        cancelFn
                    })
                } else {
                    cancelFn()
                }
            },

            closeFunction () {
                const confirmFn = () => {
                    this.$emit('update:show', false)
                    this.formChanged = false
                }
                if (this.formChanged) {
                    this.$bkInfo({
                        title: '请确认是否关闭',
                        subTitle: '存在未保存的函数，关闭后不会保存更改',
                        confirmFn
                    })
                } else {
                    confirmFn()
                }
            },

            handleChangeBlur (id) {
                const index = this.changeGroupIds.findIndex(x => x === id)
                if (index > -1) this.changeGroupIds.splice(index, 1)
            },

            handleChangeGroupName (group) {
                this.checkGroupName(this.tempName).then(() => {
                    this.isAddLoading = true
                    const postData = [Object.assign({}, group, { groupName: this.tempName })]
                    return this.editGroups(postData).then(() => {
                        this.$bkMessage({ theme: 'success', message: '修改成功' })
                    }).finally(() => {
                        this.isAddLoading = false
                    })
                }).catch((err) => {
                    if (this.tempName !== group.groupName) this.$bkMessage({ theme: 'error', message: err.message || err })
                }).finally(() => {
                    const index = this.changeGroupIds.findIndex(x => x === group.id)
                    this.changeGroupIds.splice(index, 1)
                })
            },

            changeGroupName (group) {
                this.changeGroupIds.push(group.id)
                this.tempName = group.groupName
                this.clickEmptyArea()
                this.$nextTick(() => {
                    const inputRef = this.$refs[group.id][0]
                    inputRef.focus()
                })
            },

            handleAddFunc (group) {
                const untitledFunc = {
                    funcName: 'Untitled',
                    funcGroupId: group.id,
                    funcType: 0
                }
                const groups = this.funcGroups || []
                let index = groups.findIndex((group) => {
                    const funcList = group.functionList || []
                    return funcList.find(x => x.funcName === untitledFunc.funcName)
                })
                while (index >= 0) {
                    if (/\d$/.test(untitledFunc.funcName)) untitledFunc.funcName = untitledFunc.funcName.replace(/\d$/, a => +a + 1)
                    else untitledFunc.funcName = 'Untitled1'
                    index = groups.findIndex((group) => {
                        const funcList = group.functionList || []
                        return funcList.find(x => x.funcName === untitledFunc.funcName)
                    })
                }

                this.addFunc({ groupId: group.id, func: untitledFunc }).then((res) => {
                    if (!this.openGroupIds.includes(group.id)) this.openGroupIds.push(group.id)
                    this.chooseId = res.id
                    this.$bkMessage({ theme: 'success', message: '添加函数成功' })
                }).catch((err) => {
                    this.$bkMessage({ theme: 'error', message: err.message || err })
                })
            },

            saveFunc () {
                return this.$refs.func.validate().then((postData) => {
                    if (!postData) return
                    this.isSaving = true
                    return this.editFunc({ groupId: this.curGroup.id, func: postData }).then((res) => {
                        if (!this.openGroupIds.includes(res.funcGroupId)) this.openGroupIds.push(res.funcGroupId)
                        this.chooseId = res.id
                        this.formChanged = false
                        this.$bkMessage({ theme: 'success', message: '修改函数成功' })
                    }).catch((err) => {
                        this.$bkMessage({ theme: 'error', message: err.message || err })
                    }).finally(() => {
                        this.isSaving = false
                    })
                })
            },

            deleteItem (id, name, isDeleteGroup) {
                this.delObj.show = true
                this.delObj.id = id
                this.delObj.name = name
                this.delObj.isDeleteGroup = isDeleteGroup
                this.clickEmptyArea()
            },

            requestDelete () {
                this.delObj.loading = true
                const projectId = this.$route.params.projectId
                const postData = { id: this.delObj.id, projectId }

                const deleteFuncGroup = () => this.deleteGroup(postData)
                const deleteFunc = () => {
                    const curGroup = this.funcGroups.find(group => group.functionList.find(func => func.id === this.delObj.id))
                    const funcList = curGroup.functionList || []
                    return this.deleteFunc({ groupId: curGroup.id, funcId: this.delObj.id }).then(() => {
                        if (this.delObj.id === this.chooseId) {
                            this.formChanged = false
                            const firstGroup = this.groupList[0]
                            const curFuncList = funcList.length ? funcList : firstGroup.functionList
                            const firstFunc = curFuncList[0]
                            this.chooseId = firstFunc.id
                        }
                    })
                }

                const curMethod = this.delObj.isDeleteGroup ? deleteFuncGroup : deleteFunc
                curMethod().then(() => {
                    this.$bkMessage({ theme: 'success', message: '删除成功' })
                    this.delObj.show = false
                }).catch((err) => {
                    this.$bkMessage({ theme: 'error', message: err.message || err })
                }).finally(() => {
                    this.delObj.loading = false
                })
            },

            expandGroup (group) {
                const index = this.openGroupIds.findIndex(x => x === group.id)
                if (index > -1) this.openGroupIds.splice(index, 1)
                else this.openGroupIds.push(group.id)
            },

            clickEmptyArea () {
                const btn = document.createElement('button')
                document.body.appendChild(btn)
                btn.click()
                document.body.removeChild(btn)
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

            resizeLayOut (width) {
                this.$refs.func.resize(width)
            },

            exitFullScreen () {
                const exitMethod = document.exitFullscreen // W3C
                if (exitMethod) {
                    exitMethod.call(document)
                }
            },

            openFullScreen () {
                const element = this.$refs.methodMain.$el
                const fullScreenMethod = element.requestFullScreen // W3C
                    || element.webkitRequestFullScreen // FireFox
                    || element.webkitExitFullscreen // Chrome等
                    || element.msRequestFullscreen // IE11
                if (fullScreenMethod) {
                    fullScreenMethod.call(element)
                } else {
                    this.$bkMessage({
                        showClose: true,
                        message: '此浏览器不支持全屏操作，请使用chrome浏览器',
                        type: 'warning'
                    })
                }
            },

            handleFullScreen () {
                this.isFull = document.fullscreenElement
                this.$nextTick(() => {
                    const leftEle = document.querySelector('.func-left')
                    const width = leftEle.offsetWidth
                    if (this.$refs.func) this.$refs.func.resize(width)
                })
            }
        }
    }
</script>

<style lang="postcss" scoped>
    .function-home {
        position: fixed;
        top: 0;
        left: 0;
        bottom: 0;
        right: 0;
        background: rgba(0, 0, 0, 0.6);
        z-index: 2000;
        .function-main {
            position: absolute;
            width: 67.7%;
            height: 61.5% !important;
            min-height: 61.5%;
            top: 19.8%;
            left: 16.1%;
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
            /deep/ .sortable-ghost {
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

    .func-main {
        height: 100%;
        overflow: hidden;
        .func-form {
            height: calc(100% - 50px);
        }
        .main-footer {
            padding: 9px 20px;
            height: 50px;
            background: #fafbfd;
            border: 1px solid #dcdee5;
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
        .icon-plus {
            cursor: pointer;
            font-size: 26px;
            &:hover {
                color: #3a84ff;
            }
        }
    }

    .func-item {
        display: flex;
        align-items: center;
        padding: 0 9px 0 65px;
        color: #63656e;
        line-height: 32px;
        cursor: pointer;
        font-size: 12px;
        .hover-show {
            display: none;
        }
        .func-name {
            flex: 1;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        }
        .bk-drag-icon {
            font-size: 12px;
        }
        &:hover, &.select {
            background: #e1ecff;
            color: #3a84ff;
            .hover-show {
                display: block;
            }
        }
        .disable {
            cursor: not-allowed;
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

    /deep/ .more-list {
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

    .left-input {
        width: calc(100% - 12px);
        margin: 9px 6px 7px;
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
    .icon-style {
        position: absolute;
        top: 4px;
        right: 4px;
        z-index: 1;
        color: #C4C6CC;
        cursor: pointer;
        .bk-drag-icon {
            width: 16px;
            height: 16px;
            color: #979ba5;
            display: inline-block;
        }
        .un-full-screen {
            width: 108px;
            height: 36px;
            line-height: 36px;
            text-align: center;
            opacity: 0.7;
            background: #000000;
            border-radius: 2px;
            padding: 3px 6px;
            &:hover {
                opacity: 0.9;
            }
        }
    }
</style>
<style lang="postcss">
    .label-pop {
        .tippy-tooltip, .bk-popconfirm-content {
            padding: 0;
        }
        .popconfirm-content {
            margin: 0;
        }
    }
</style>
