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
    <section>
        <div class="remote-title">数据源 Api Url</div>
        <bk-input v-model="remoteData.url" @change="saveChange" style="width: 100%" right-icon="bk-icon icon-search" placeholder="请输入Api Url" />
        <div class="remote-title">Api 方法</div>
        <bk-select v-model="remoteData.method" style="width: 100%" placeholder="Api方法，默认get方法" @change="saveChange">
            <bk-option v-for="item in methodList" :key="item" :id="item" :name="item" />
        </bk-select>
        <div class="remote-title">数据清洗函数</div>
        <bk-select class="event-choose" ref="eventChooseComp" v-model="remoteData.methodId" @change="saveChange">
            <bk-option-group
                v-for="(group, index) in functionGroup"
                :name="group.name"
                :key="index">
                <bk-option v-for="option in group.children"
                    :key="option.id"
                    :id="option.id"
                    :name="option.name">
                </bk-option>
            </bk-option-group>
            <div slot="extension" style="cursor: pointer;" @click="showMethodDialog">
                <i class="bk-icon icon-plus-circle"></i>新增函数
            </div>
        </bk-select>
        <bk-button @click="getApiData" theme="primary" class="remote-button">获取接口数据</bk-button>
        <methods :is-show.sync="showMethod"></methods>
    </section>
</template>

<script>
    import { mapGetters } from 'vuex'
    import methods from '@/components/methods'

    export default {
        components: {
            methods
        },
        props: {
            name: String,
            type: String,
            payload: {
                type: Object,
                default: () => ({})
            },
            defaultValue: {
                type: [Object, Array, Number, String]
            },
            change: {
                type: Function,
                default: () => {}
            },
            remoteValidate: {
                type: Function,
                default: () => {}
            }
        },
        data () {
            return {
                remoteData: {
                    url: '/api/test/getMockData',
                    method: 'get',
                    methodId: ''
                },
                showMethod: false
            }
        },
        computed: {
            ...mapGetters('drag', ['functionGroup'])
        },
        created () {
            this.methodList = ['get', 'post', 'put', 'delete', 'update']
            this.remoteData = Object.assign({}, this.remoteData, this.payload)
        },
        methods: {
            saveChange () {
                this.change(this.name, this.defaultValue, this.type, JSON.parse(JSON.stringify(this.remoteData)))
            },
            genHackEval (methodId) {
                let methodCode = ''
                this.functionGroup.forEach((group) => {
                    const funChildren = group.children || []
                    const method = funChildren.find(x => x.id === methodId)
                    if (method) methodCode = method.code
                })
                const Fn = Function
                return new Fn('return ' + methodCode)()
            },
            getApiData () {
                if (!this.remoteData.url) {
                    this.$bkMessage({ theme: 'error', message: 'Api Url不能为空' })
                    return
                }
                let transformFunc = _ => _
                if (this.remoteData.methodId) {
                    try {
                        transformFunc = this.genHackEval(this.remoteData.methodId)
                    } catch (error) {
                        this.$bkMessage({ theme: 'error', message: error.message || '转换函数格式不正确', limit: 1 })
                        return
                    }
                }

                const data = {
                    url: this.remoteData.url,
                    type: this.remoteData.method
                }
                this.$store.dispatch('getApiData', data).then(res => {
                    let resData = res
                    try {
                        resData = transformFunc(resData)
                    } catch (error) {
                        this.$bkMessage({ theme: 'error', message: `数据清洗函数执行失败： ${error.message || error}`, limit: 1 })
                        return
                    }
                    const message = this.remoteValidate(resData)
                    if (message) {
                        this.$bkMessage({ theme: 'error', message })
                    } else {
                        this.change(this.name, resData, this.type, JSON.parse(JSON.stringify(this.remoteData)))
                        this.$bkMessage({ theme: 'success', message: '接口数据获取成功', limit: 1 })
                    }
                }).catch(e => {
                    this.$bkMessage({ theme: 'error', message: '获取接口数据失败，请检查 url 是否正确', limit: 1 })
                })
            },
            showMethodDialog () {
                const eventChooseComp = this.$refs.eventChooseComp[0]
                if (eventChooseComp) {
                    eventChooseComp.close()
                }
                this.showMethod = true
            }

        }
    }
</script>

<style lang="postcss">
    .remote-title {
        margin-top: 10px;
        line-height: 32px;
        font-size: 14px;
        &:first-child {
            margin-top: 0;
        }
    }
    .remote-button {
        margin: 10px 0;
    }
</style>
