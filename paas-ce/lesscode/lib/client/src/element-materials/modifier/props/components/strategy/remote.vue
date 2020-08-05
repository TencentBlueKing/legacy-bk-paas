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
        <div class="remote-title">远程函数</div>
        <bk-select class="event-choose" ref="eventChooseComp" v-model="remoteData.methodId" @change="saveChange">
            <bk-option-group
                v-for="(group, index) in funcGroups"
                :name="group.groupName"
                :key="index">
                <bk-option v-for="option in group.functionList"
                    :key="option.id"
                    :id="option.id"
                    :name="option.funcName">
                </bk-option>
            </bk-option-group>
            <div slot="extension" style="cursor: pointer;" @click="showMethodDialog">
                <i class="bk-icon icon-plus-circle"></i>新增函数
            </div>
        </bk-select>
        <methods :show.sync="showMethod"></methods>
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
                    methodId: ''
                },
                showMethod: false
            }
        },
        computed: {
            ...mapGetters('functions', ['funcGroups'])
        },
        created () {
            this.remoteData = Object.assign({}, this.remoteData, this.payload)
        },
        methods: {
            saveChange () {
                this.change(this.name, this.defaultValue, this.type, JSON.parse(JSON.stringify(this.remoteData)))
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
