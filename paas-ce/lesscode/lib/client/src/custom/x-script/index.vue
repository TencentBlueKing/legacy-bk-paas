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
    <div class="x-script">
        <div class="x-script-head">
            <p>脚本执行组件</p>
            <p>选择业务后，可选择添加多个对应业务下的脚本，可点击“添加业务”添加多个业务</p>
            <p>可点击每个脚本后的“执行”，单独执行该脚本，也可点击“批量执行”，执行所有选择的脚本</p>
            <p>可传入：获取业务列表(bizListAjaxUrl)、获取指定业务脚本(scriptListAjaxUrl)、执行脚本(executeAjaxUrl)三个接口地址接入平台，否则使用模拟数据</p>
        </div>
        <div class="x-script-biz" v-for="(group, gIndex) in bizGroup" :key="gIndex">
            <i v-if="gIndex" class="del-group"
                @click="operateGroup('del', gIndex)">x</i>
            <div class="script-biz">
                <x-select
                    style="width: 250px;"
                    v-model="group.biz"
                    :clearable="false"
                    @change="giveScripts($event, gIndex)">
                    <x-option v-for="option in bizList"
                        :key="option.bk_biz_id"
                        :id="option.bk_biz_id"
                        :name="option.bk_biz_name">
                    </x-option>
                </x-select>
            </div>
            <div class="script-script">
                <div class="script" v-for="(script, sIndex) in group.selectScripts" :key="sIndex">
                    <x-select
                        :disabled="!group.scripts.length"
                        style="width: 250px;"
                        v-model="script.id"
                        @change="giveName($event, gIndex, sIndex)"
                        :clearable="false">
                        <x-option v-for="option in group.scripts"
                            :key="option.id"
                            :id="option.id"
                            :name="option.name">
                        </x-option>
                    </x-select>
                    <div class="x-script-operate">
                        <i :class="{ 'operate': true, 'operate-disable': !group.biz || isExecute }" @click="operateScript('add', gIndex, sIndex)">+</i>
                        <i :class="{ 'operate': true, 'operate-disable': !sIndex || isExecute }" @click="operateScript('del', gIndex, sIndex)">-</i>
                    </div>
                    <div class="x-script-result">
                        {{script.result}}
                    </div>
                    <div :class="{ 'x-script-immediate': true, 'immediate-disable': !script.id }" @click="execute('one', script, group)">
                        执行
                    </div>
                </div>
            </div>
        </div>
        <p class="x-group-operate" @click="operateGroup">+添加业务</p>
        <p class="x-execute">
            <x-button :theme="buttonTheme" :title="title" @click="execute" style="margin-top: 20px" :loading="isExecute" :disabled="buttonDisable()">批量执行
            </x-button>
        </p>
    </div>
</template>

<script>
    import XSelect from './components/select/select'
    import XOption from './components/select/option'
    import XButton from './components/button/button'

    export default {
        components: {
            // XInput,
            XSelect,
            XOption,
            XButton
        },
        props: {
            // input
            value: {
                type: String,
                default: 'hello world'
            },
            placeholder: {
                type: String
            },
            disabled: {
                type: Boolean,
                default: false
            },
            clearable: {
                type: Boolean,
                default: true
            },
            'extCls': {
                type: String
            },
            // button
            title: {
                type: String,
                default: '执行脚本'
            },
            buttonTheme: {
                type: String,
                default: 'primary'
            },
            // 获取业务列表接口地址
            bizListAjaxUrl: {
                type: String,
                default: ''
            },
            // 获取指定业务下所有脚本的接口地址
            scriptListAjaxUrl: {
                type: String,
                default: ''
            },
            // 执行脚本接口地址
            executeAjaxUrl: {
                type: String,
                default: ''
            },
            // 系统接口通用参数
            systemInfo: {
                type: Object,
                default: () => ({})
            }
        },
        data () {
            return {
                bizList: [
                    {
                        bk_biz_id: 1,
                        bk_biz_name: '蓝鲸'
                    },
                    {
                        bk_biz_id: 2,
                        bk_biz_name: '演示用业务'
                    },
                    {
                        bk_biz_id: 3,
                        bk_biz_name: 'rambo-test'
                    }
                ],
                scriptList: [
                    {
                        bk_biz_id: 1,
                        name: 'reset_db',
                        creator: 'hongsong',
                        tag: 'v1.0',
                        public: false,
                        version: 'hongsong.20191212160942',
                        create_time: '2019-12-12 16:09:42',
                        last_modify_user: 'hongsong',
                        last_modify_time: '2019-12-12 16:09:42',
                        type: 1,
                        id: 1024
                    },
                    {
                        bk_biz_id: 1,
                        name: 'reset_db',
                        creator: 'hongsong',
                        tag: 'v1.0',
                        public: false,
                        version: 'hongsong.20191212160942',
                        create_time: '2019-12-12 16:09:42',
                        last_modify_user: 'hongsong',
                        last_modify_time: '2019-12-12 16:09:42',
                        type: 1,
                        id: 1025
                    },
                    {
                        bk_biz_id: 1,
                        name: 'reset_db',
                        creator: 'hongsong',
                        tag: 'v1.0',
                        public: false,
                        version: 'hongsong.20191212160942',
                        create_time: '2019-12-12 16:09:42',
                        last_modify_user: 'hongsong',
                        last_modify_time: '2019-12-12 16:09:42',
                        type: 1,
                        id: 1026
                    },
                    {
                        bk_biz_id: 2,
                        name: 'reset_db',
                        creator: 'hongsong',
                        tag: 'v1.0',
                        public: false,
                        version: 'hongsong.20191212160942',
                        create_time: '2019-12-12 16:09:42',
                        last_modify_user: 'hongsong',
                        last_modify_time: '2019-12-12 16:09:42',
                        type: 1,
                        id: 1027
                    },
                    {
                        bk_biz_id: 2,
                        name: 'reset_db',
                        creator: 'hongsong',
                        tag: 'v1.0',
                        public: false,
                        version: 'hongsong.20191212160942',
                        create_time: '2019-12-12 16:09:42',
                        last_modify_user: 'hongsong',
                        last_modify_time: '2019-12-12 16:09:42',
                        type: 1,
                        id: 1028
                    },
                    {
                        bk_biz_id: 2,
                        name: 'reset_db',
                        creator: 'hongsong',
                        tag: 'v1.0',
                        public: false,
                        version: 'hongsong.20191212160942',
                        create_time: '2019-12-12 16:09:42',
                        last_modify_user: 'hongsong',
                        last_modify_time: '2019-12-12 16:09:42',
                        type: 1,
                        id: 1029
                    },
                    {
                        bk_biz_id: 2,
                        name: 'reset_db',
                        creator: 'hongsong',
                        tag: 'v1.0',
                        public: false,
                        version: 'hongsong.20191212160942',
                        create_time: '2019-12-12 16:09:42',
                        last_modify_user: 'hongsong',
                        last_modify_time: '2019-12-12 16:09:42',
                        type: 1,
                        id: 1030
                    },
                    {
                        bk_biz_id: 3,
                        name: 'reset_db',
                        creator: 'hongsong',
                        tag: 'v1.0',
                        public: false,
                        version: 'hongsong.20191212160942',
                        create_time: '2019-12-12 16:09:42',
                        last_modify_user: 'hongsong',
                        last_modify_time: '2019-12-12 16:09:42',
                        type: 1,
                        id: 1031
                    },
                    {
                        bk_biz_id: 3,
                        name: 'reset_db',
                        creator: 'hongsong',
                        tag: 'v1.0',
                        public: false,
                        version: 'hongsong.20191212160942',
                        create_time: '2019-12-12 16:09:42',
                        last_modify_user: 'hongsong',
                        last_modify_time: '2019-12-12 16:09:42',
                        type: 1,
                        id: 1032
                    },
                    {
                        bk_biz_id: 3,
                        name: 'reset_db',
                        creator: 'hongsong',
                        tag: 'v1.0',
                        public: false,
                        version: 'hongsong.20191212160942',
                        create_time: '2019-12-12 16:09:42',
                        last_modify_user: 'hongsong',
                        last_modify_time: '2019-12-12 16:09:42',
                        type: 1,
                        id: 1033
                    }
                ],
                bizGroup: [
                    {
                        biz: '',
                        scripts: [],
                        selectScripts: [
                            {
                                id: '',
                                name: '',
                                result: '等待执行'
                            }
                        ]
                    }
                ],
                isExecute: false
            }
        },
        async created () {
            if (this.bizListAjaxUrl) {
                await this.getSelectData()
            }
        },
        methods: {
            // 选择业务回调
            async giveScripts (val, index) {
                if (this.scriptListAjaxUrl) {
                    const tempParams = {
                        bk_biz_id: Number(val)
                    }
                    await this.$http.post(this.scriptListAjaxUrl, { ...this.systemInfo, ...tempParams }).then(res => {
                        this.bizGroup[index].scripts = res.data.data
                    })
                } else {
                    this.bizGroup[index].scripts = this.scriptList.filter(script => script.bk_biz_id === val)
                }
                if (this.bizGroup[index].scripts[0]) {
                    this.bizGroup[index].selectScripts[0].id = this.bizGroup[index].scripts[0].id
                    this.bizGroup[index].selectScripts[0].name = this.bizGroup[index].scripts[0].name
                }
            },
            // 选择脚本回调
            giveName (val, gIndex, sIndex) {
                this.bizGroup[gIndex].selectScripts[sIndex].name = this.bizGroup[gIndex].scripts.find(script => script.id === val).name
            },
            operateScript (type = 'add', gIndex = 0, sIndex) {
                if (this.isExecute) {
                    return
                }
                if (type === 'del') {
                    if (!sIndex) {
                        return
                    }
                    this.bizGroup[gIndex].selectScripts.splice(sIndex, 1)
                } else {
                    if (!this.bizGroup[gIndex].biz) {
                        return
                    }
                    this.bizGroup[gIndex].selectScripts.push({
                        id: '',
                        name: '',
                        result: '等待执行'
                    })
                }
            },
            operateGroup (type = 'add', gIndex = 0) {
                if (this.isExecute) {
                    return
                }
                if (type === 'del') {
                    if (!gIndex) {
                        return
                    }
                    this.bizGroup.splice(gIndex, 1)
                } else {
                    this.bizGroup.push({
                        biz: '',
                        scripts: [],
                        selectScripts: [
                            {
                                id: '',
                                name: '',
                                result: '等待执行'
                            }
                        ]
                    })
                }
            },
            // 生成promise
            genPromise (script) {
                return new Promise((resolve, reject) => {
                    const timeOut = Math.random() * 5
                    setTimeout(() => {
                        if (timeOut < 3) {
                            resolve({
                                result: true,
                                id: script.id
                            })
                        } else {
                            // eslint-disable-next-line prefer-promise-reject-errors
                            resolve({
                                result: false,
                                id: script.id
                            })
                        }
                    }, timeOut * 1000)
                })
            },
            // 执行脚本
            async execute (type = 'all', val, group) {
                this.isExecute = true
                const promises = []
                if (type === 'one') {
                    if (val.id) {
                        if (this.executeAjaxUrl) {
                            const tempParams = {
                                bk_biz_id: Number(group.biz),
                                script_id: Number(val.id)
                            }
                            promises.push(this.$http.post(this.executeAjaxUrl, { ...this.systemInfo, ...tempParams }))
                        } else {
                            promises.push(this.genPromise(val))
                        }
                    }
                } else {
                    this.bizGroup.forEach(group => {
                        group.selectScripts.forEach(script => {
                            if (script.id) {
                                if (this.executeAjaxUrl) {
                                    const tempParams = {
                                        bk_biz_id: Number(group.biz),
                                        script_id: Number(val.id)
                                    }
                                    promises.push(this.$http.post(this.executeAjaxUrl, { ...this.systemInfo, ...tempParams }))
                                } else {
                                    promises.push(this.genPromise(script))
                                }
                            }
                        })
                    })
                }
                if (promises.length) {
                    await Promise.all(promises).then(res => {
                        this.bizGroup.forEach(group => {
                            group.selectScripts.forEach(script => {
                                const flag = res.find(re => re.id === script.id)
                                script.result = !flag ? '等待执行' : (flag.result ? '执行成功' : '执行失败')
                            })
                        })
                    })
                }
                this.isExecute = false
            },
            async getSelectData () {
                await this.$http.get(this.bizListAjaxUrl, { ...this.systemInfo }).then(res => {
                    this.bizList.splice(0, this.bizList.length, ...res.data.info)
                })
            },
            buttonDisable () {
                for (const i in this.bizGroup) {
                    for (const j in this.bizGroup[i].selectScripts) {
                        if (this.bizGroup[i].selectScripts[j].id) {
                            return false
                        }
                    }
                }
                return true
            }
        }
    }
</script>

<style lang="postcss">
    .x-script {}

    .x-script-head > p{
        font-size: 12px;
        margin: 10px;
    }
    .x-script-biz {
        border: 1px solid #dcdee5;
        margin-top: 20px;
        padding: 10px;
        position: relative;
    }

    .script-biz {
        display: inline-flex;
        width: 35%;
    }

    .x-script-operate {
        display: inline-flex;
        align-items: center;
        margin-left: 10px;
    }

    .x-script-result{
        font-size: 12px;
    }

    .x-script-immediate{
        color: #3a84ff;
        font-size: 12px;
        margin-left: 10px;
        cursor: pointer;
    }

    .immediate-disable{
        color: #f0f1f5;
        cursor: not-allowed;
    }

    .script-script {
        display: inline-flex;
        flex-wrap: wrap;
        width: 60%;
    }

    .script {
        display: inline-flex;
        width: 100%;
        margin: 10px;
        align-items: center;
    }

    .operate{
        cursor: pointer;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 20px;
        height: 20px;
        background-color: #c4c6cc;
        border-radius: 50%;
        margin-right: 10px;
        font-style: normal;
        color: white;
    }

    .operate-disable{
        cursor: not-allowed;
        background-color: #f0f1f5;
    }

    .del-group {
        position: absolute;
        display: block;
        font-style: normal;
        font-size: 18px;
        right: 10px;
        top: 2px;
        cursor: pointer;
    }

    .x-group-operate {
        margin-top: 10px;
        color: #3a84ff;
        cursor: pointer;
        width: fit-content;
    }
</style>
