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
    <bk-dialog :value="isShow"
        class="method-main"
        :confirm-fn="saveMethods"
        @cancel="cancelMethod"
        render-directive="if"
        ok-text="保存"
        :transfer="true"
        :draggable="true"
        :mask-close="false"
        width="900"
        title="函数管理">
        <main class="method-main">
            <bk-collapse v-model="activeName" class="method-list">
                <h3 class="list-name">函数库</h3>
                <bk-collapse-item @contextmenu.prevent="" :name="funGroup.name" v-for="(funGroup, index) in currentFunctionGroup" :key="funGroup.name">
                    <div @mousedown="showAddMethod(funGroup)" class="method-fold">
                        <span :title="funGroup.name">{{ funGroup.name }}</span>
                        <bk-icon type="plus" @mousedown.stop="addMethod($event, index)" />
                    </div>
                    <div slot="content">
                        <ul @contextmenu.prevent="" class="group-children" v-if="funGroup.children && funGroup.children.length">
                            <li v-for="fun in funGroup.children"
                                :key="fun.name"
                                :title="fun.name"
                                :class="[{ 'active': selectMethod.id === fun.id }, 'group-item']"
                                @click="chooseMethod(fun)"
                                @mousedown="showAddMethod(funGroup, fun)"
                            >
                                {{ fun.name }}
                            </li>
                        </ul>
                        <span v-else class="group-item method-empty">暂无函数</span>
                    </div>
                </bk-collapse-item>
                <bk-icon @click="addGroup" class="add-fold" type="folder-plus" />
            </bk-collapse>

            <section class="method-item">
                <ul class="method-head" ref="method-head">
                    <li class="head-item" v-if="selectMethod.id">
                        <span class="head-title">函数名:</span>
                        <span class="head-item-name" v-if="selectMethod.funName">{{ selectMethod.funName }}</span>
                        <span class="head-item-click" @click="changeFunName">修改</span>
                    </li>
                    <li class="head-item" v-if="selectMethod.id">
                        <span class="head-title">参数:</span>
                        <span class="head-item-param" v-for="param in selectMethod.funParam" :key="param">
                            {{ param }}<bk-icon type="close" @click="deleteFunParam(param)" />
                        </span>
                        <span class="head-item-click" @click="addFunParam">新增</span>
                    </li>
                </ul>
                <section ref="monaco" class="method-body" :style="`height: ${height}`"></section>
            </section>

            <ul class="method-menu" @contextmenu.prevent="" v-bk-clickoutside="closeAddMethods" v-if="isShowAddMethods" :style="`left: ${addLeft}px; top: ${addTop}px`">
                <li class="add-item" @click="addGroup" v-if="!currentMethod.child">添加文件夹</li>
                <li class="add-item" @click="addMethod" v-if="!currentMethod.child">添加函数</li>
                <li class="add-item" @click="deleteMethod">删除</li>
            </ul>

            <bk-dialog v-model="isShowName" :title="dialogTitle" header-position="left" :confirm-fn="confirmAddMethod" @cancel="methodName = ''">
                <bk-input v-model="methodName" :placeholder="dialogPlaceHolder"></bk-input>
            </bk-dialog>
        </main>
    </bk-dialog>
</template>

<script>
    import { mapGetters, mapMutations } from 'vuex'
    import { uuid } from '@/common/util.js'
    // import * as monaco from 'monaco-editor'
    import { bkIcon } from 'bk-magic-vue'

    export default {
        components: {
            bkIcon
        },

        props: {
            isShow: {
                type: Boolean
            }
        },

        data () {
            return {
                activeName: '',
                monacoInstance: {},
                isShowAddMethods: false,
                addLeft: 0,
                addTop: 0,
                isShowName: false,
                currentFunctionGroup: {},
                currentMethod: {},
                methodName: '',
                dialogTitle: '',
                dialogPlaceHolder: '',
                selectMethod: {},
                height: '100%'
            }
        },

        computed: {
            ...mapGetters('drag', ['functionGroup'])
        },

        watch: {
            isShow (val) {
                if (!val) return

                this.currentFunctionGroup = JSON.parse(JSON.stringify(this.functionGroup))
                setTimeout(() => {
                    this.monacoInstance = monaco.editor.create(this.$refs.monaco, {
                        value: '',
                        language: 'javascript',
                        fontSize: 14,
                        fontFamily: 'Consolas',
                        cursorBlinking: 'solid',
                        theme: 'vs-dark',
                        automaticLayout: true
                    })
                    const firstGroup = this.currentFunctionGroup[0] || {}
                    const firstMethod = firstGroup.children[0] || {}
                    this.activeName = firstGroup.name
                    this.chooseMethod(firstMethod)
                }, 0)
            }
        },

        methods: {
            ...mapMutations('drag', ['setFunctionGroup']),

            confirmAddMethod () {},

            changeFunName () {
                this.isShowName = true
                this.methodName = this.selectMethod.funName
                this.dialogTitle = '修改函数名称'
                this.dialogPlaceHolder = '请输入函数名称，由大小写英文字母、下划线和数字组成'
                this.confirmAddMethod = () => {
                    const currentName = this.methodName.trim()
                    if (currentName === '') {
                        this.$bkMessage({ message: '函数名不能为空', theme: 'error', limit: 1 })
                        return
                    }

                    if (/[^a-zA-Z0-9_]/g.test(currentName)) {
                        this.$bkMessage({ message: '函数名称只能由大小写英文字母、下划线和数字组成', theme: 'error', limit: 1 })
                        // this.methodName = ''
                        return
                    }

                    let repeatIndex = this.currentFunctionGroup.findIndex((group) => {
                        const currentChildren = group.children
                        return currentChildren.findIndex(x => x.funName === currentName && x.id !== this.selectMethod.id) > -1
                    })

                    while (repeatIndex > -1) {
                        this.methodName = `${this.methodName}_copy`
                        repeatIndex = this.currentFunctionGroup.findIndex((group) => {
                            const currentChildren = group.children
                            return currentChildren.findIndex(x => x.funName === this.methodName && x.id !== this.selectMethod.id) > -1
                        })
                    }

                    this.selectMethod.name = this.methodName
                    this.selectMethod.funName = this.methodName
                    this.isShowName = false
                }
            },

            addFunParam () {
                this.isShowName = true
                this.dialogTitle = '新增参数'
                this.dialogPlaceHolder = '请输入参数名称，可以是大小写英文字母、下划线和数字'
                this.confirmAddMethod = () => {
                    if (this.methodName.trim() === '') {
                        this.$bkMessage({ message: '参数名不能为空', theme: 'error', limit: 1 })
                        return
                    }
                    if (/[^a-zA-Z0-9_]/g.test(this.methodName)) {
                        this.$bkMessage({ message: '参数名称只能由大小写英文字母、下划线和数字组成', theme: 'error', limit: 1 })
                        // this.methodName = ''
                        return
                    }
                    let methodName = this.methodName
                    let repeatIndex = this.selectMethod.funParam.findIndex((fun) => (fun === methodName))
                    while (repeatIndex > -1) {
                        methodName = `${methodName}_copy`
                        repeatIndex = this.selectMethod.funParam.findIndex((fun) => (fun === methodName))
                    }

                    this.selectMethod.funParam.push(methodName)
                    this.methodName = ''
                    this.updateLayout()
                    this.isShowName = false
                }
            },

            deleteFunParam (param) {
                const confirmFn = () => {
                    const index = this.selectMethod.funParam.findIndex(x => x === param)
                    this.selectMethod.funParam.splice(index, 1)
                    this.updateLayout()
                }

                this.$bkInfo({
                    title: '确认删除该参数？',
                    confirmFn
                })
            },

            saveMethods () {
                this.saveCurrentMethod()
                this.setFunctionGroup(this.currentFunctionGroup)
                this.$emit('update:isShow', false)
                this.activeName = ''
                this.selectMethod = {}
            },

            saveCurrentMethod () {
                if (!this.selectMethod.id) return

                this.selectMethod.funBody = this.monacoInstance.getValue()
                this.selectMethod.code = `function ${this.selectMethod.funName} (${this.selectMethod.funParam}) {${this.selectMethod.funBody}}`.replace('// 这里直接写函数体内容，具体请参考系统方法，这里的this指向VUE组件实例\r\n', '')
            },

            cancelMethod () {
                this.$emit('update:isShow', false)
                this.activeName = ''
                this.selectMethod = {}
            },

            closeAddMethods () {
                this.isShowAddMethods = false
            },

            chooseMethod (method) {
                this.saveCurrentMethod()
                this.monacoInstance.setValue(method.funBody)
                this.selectMethod = method
                this.updateLayout()
            },

            updateLayout () {
                this.$nextTick().then(() => {
                    const headRef = this.$refs['method-head']
                    this.height = `calc(100% - ${headRef.offsetHeight}px)`
                    this.monacoInstance.layout()
                    this.focusEditor()
                })
            },

            showAddMethod (parent, child) {
                if (event.button !== 2) return
                this.addLeft = event.pageX - 3
                this.addTop = event.pageY - 3
                this.isShowAddMethods = true
                this.currentMethod = { parent, child }
            },

            addGroup () {
                this.isShowName = true
                this.dialogTitle = '新增文件夹'
                this.dialogPlaceHolder = '请输入文件夹名称'
                this.isShowAddMethods = false
                this.confirmAddMethod = () => {
                    this.methodName = this.methodName.trim()
                    if (this.methodName === '') {
                        this.$bkMessage({ message: '文件夹名不能为空', theme: 'error', limit: 1 })
                        return
                    }
                    const id = uuid()
                    const currentGroup = this.currentMethod.parent ? this.currentMethod.parent : this.currentFunctionGroup[this.currentFunctionGroup.length - 1]
                    let repeatIndex = this.currentFunctionGroup.findIndex(x => x.name === this.methodName)
                    while (repeatIndex > -1) {
                        this.methodName = `${this.methodName}_copy`
                        repeatIndex = this.currentFunctionGroup.findIndex(x => x.name === this.methodName)
                    }
                    const index = this.currentFunctionGroup.findIndex((x) => (x.id === currentGroup.id))
                    this.currentFunctionGroup.splice(index + 1, 0, { name: this.methodName, id, children: [] })
                    this.saveCurrentMethod()
                    this.currentMethod = {}
                    this.methodName = ''
                    this.isShowName = false
                }
            },

            addMethod (event, index) {
                this.isShowName = true
                this.isShowAddMethods = false
                this.dialogTitle = '新增函数'
                this.dialogPlaceHolder = '请输入函数名称，由大小写英文字母、下划线和数字组成'
                this.confirmAddMethod = () => {
                    this.methodName = this.methodName.trim()
                    if (this.methodName === '') {
                        this.$bkMessage({ message: '函数名称不能为空', theme: 'error', limit: 1 })
                        return
                    }
                    if (/[^a-zA-Z0-9_]/g.test(this.methodName)) {
                        this.$bkMessage({ message: '函数名称只能由大小写英文字母、下划线和数字组成', theme: 'error', limit: 1 })
                        // this.methodName = ''
                        return
                    }
                    this.saveCurrentMethod()
                    const id = uuid()

                    let repeatIndex = this.currentFunctionGroup.findIndex((group) => {
                        const currentChildren = group.children
                        return currentChildren.findIndex(x => x.funName === this.methodName) > -1
                    })

                    while (repeatIndex > -1) {
                        this.methodName = `${this.methodName}_copy`
                        repeatIndex = this.currentFunctionGroup.findIndex((group) => {
                            const currentChildren = group.children
                            return currentChildren.findIndex(x => x.funName === this.methodName) > -1
                        })
                    }
                    const newMethod = {
                        id,
                        funParam: [],
                        funName: this.methodName,
                        funBody: '// 这里直接写函数体内容，具体请参考系统方法，这里的this指向VUE组件实例\r\n',
                        name: this.methodName,
                        code: ''
                    }
                    const currentGroup = index === undefined ? this.currentMethod.parent : this.currentFunctionGroup[index]
                    currentGroup.children.push(newMethod)

                    if (Array.isArray(this.activeName)) {
                        const activeIndex = this.activeName.findIndex(x => x === currentGroup.name)
                        if (activeIndex < 0) this.activeName.push(currentGroup.name)
                    } else {
                        this.activeName = this.activeName ? currentGroup.name : [this.activeName, currentGroup.name]
                    }
                    this.monacoInstance.setValue(newMethod.funBody)
                    this.updateLayout()
                    this.currentMethod = {}
                    this.selectMethod = newMethod
                    this.methodName = ''
                    this.isShowName = false
                }
            },

            focusEditor () {
                const editorModel = this.monacoInstance.getModel()
                const line = editorModel.getLineCount()
                const lastStr = editorModel.getLineContent(line)
                const lastStrLength = lastStr.length + 1
                this.monacoInstance.setSelection(new monaco.Selection(line, lastStrLength, line, lastStrLength))
                this.monacoInstance.focus()
            },

            deleteMethod () {
                if (this.currentMethod.parent.id === 'system') {
                    this.$bkMessage({ theme: 'error', message: '系统方法，不能删除', limit: 1 })
                    return
                }

                const confirmFn = () => {
                    if (this.currentMethod.child) {
                        const childIndex = this.currentMethod.parent.children.findIndex((x) => (x.id === this.currentMethod.child.id))
                        this.currentMethod.parent.children.splice(childIndex, 1)
                    } else {
                        const parentIndex = this.currentFunctionGroup.findIndex((x) => (x.id === this.currentMethod.parent.id))
                        this.currentFunctionGroup.splice(parentIndex, 1)
                    }
                }

                this.$bkInfo({
                    title: '确认删除该函数？',
                    confirmFn
                })
            }
        }
    }
</script>

<style lang="postcss" scoped>
    .method-main {
        /deep/ .bk-dialog-tool {
            min-height: 20px;
        }
        /deep/ .bk-dialog-header {
            padding: 3px 24px 12px;
        }
        /deep/ .bk-dialog-body {
            padding: 14px;
        }
        /deep/ .bk-dialog {
            position: initial;
            /* &.ease-enter-active.ease-enter-to {
                animation: none!important;
            } */
            .bk-dialog-content {
                top: calc(50vh - 324px)!important;
            }
        }
    }

    .method-menu {
        position: fixed;
        background: #252526;
        box-shadow: #000000 1px 1px 1px 1px;
        width: 150px;
        padding: 7px 0;
        line-height: 32px;
        .add-item {
            padding: 0 20px;
            color: #cccccc;
            cursor: pointer;
            &:hover {
                background: #094771;
            }
        }
    }

    .method-main {
        height: 500px;
        display: flex;
        .method-list {
            font-family: Consolas;
            flex-basis: 150px;
            background: #252526;
            color: #cccccc;
            position: relative;
            .list-name {
                height: 30px;
                line-height: 30px;
                font-size: 15px;
                font-weight: normal;
                text-align: center;
                margin: 0;
                padding: 0;
                border-bottom: 1px solid #2a2d2e;
                border-right: 1px solid #2a2d2e;
            }
            .method-fold {
                display: flex;
                justify-content: center;
                align-items: center;
                span {
                    flex: 1;
                    max-width: 90px;
                    overflow: hidden;
                    white-space: nowrap;
                    text-overflow: ellipsis;
                }
            }
            .add-fold {
                position: absolute;
                bottom: 50px;
                left: 50%;
                transform: translateX(-50%);
                display: block;
                cursor: pointer;
            }
            /deep/ .bk-collapse-item-header{
                height: 30px;
                line-height: 30px;
                .bk-icon {
                    vertical-align: middle;
                }
                &:hover {
                    color: #cccccc;
                    background: #2a2d2e;
                }
            }
            /deep/ .bk-collapse-item-content {
                padding: 0;
            }
            .group-item {
                color: #cccccc;
                cursor: pointer;
                height: 22px;
                line-height: 22px;
                padding: 0 15px 0 20px;
                max-width: 150px;
                overflow: hidden;
                white-space: nowrap;
                text-overflow: ellipsis;
                &:hover {
                    background: #2a2d2e;
                }
                &.active {
                    background: #37373d;
                }
                &.method-empty:hover {
                    cursor: context-menu;
                    background: #252526;
                }
            }
        }
        .method-item {
            height: 100%;
            flex: 1;
            display: flex;
            flex-direction: column;
            .method-head {
                padding: 0 5px;
                background: #252526;
                color: #cccccc;
                .head-item {
                    line-height: 20px;
                    margin-top: 6px;
                    position: relative;
                    padding-left: 60px;
                    .head-title {
                        position: absolute;
                        left: 0;
                        text-align: right;
                        width: 60px;
                    }
                    &-name {
                        display: inline-block;
                        margin: 0 6px;
                    }
                    &-param {
                        display: inline-block;
                        margin: 0 6px;
                        margin-bottom: 6px;
                        border: 1px solid #fff;
                        border-radius: 10px;
                        padding: 2px 7px;
                        line-height: 12px;
                        font-size: 12px;
                        /deep/ .icon-close {
                            cursor: pointer;
                            &:hover {
                                color: #3c96ff;
                            }
                        }
                    }
                    &-click {
                        cursor: pointer;
                        color: #3c96ff;
                        display: inline-block;
                        margin-bottom: 6px;
                        margin-left: 10px;
                    }
                    .head-input {
                        margin: 0 16px;
                        flex: 1;
                    }
                }
            }
            .method-body {
                flex: 1;
            }
        }
    }
</style>
