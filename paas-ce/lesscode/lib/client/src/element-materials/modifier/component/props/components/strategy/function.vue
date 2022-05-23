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
        <choose-function
            :choosen-function="remoteData"
            @change="saveChange"
        ></choose-function>
    </section>
</template>

<script>
    import ChooseFunction from '@/components/methods/choose-function/index.vue'

    export default {
        components: {
            ChooseFunction
        },
        props: {
            name: String,
            type: String,
            payload: {
                type: Object,
                default: () => ({})
            },
            defaultValue: {
                type: [Object, Array, Number, String, Function]
            },
            change: {
                type: Function,
                default: () => {}
            }
        },
        data () {
            return {
                remoteData: {
                    methodCode: '',
                    params: []
                },
                propDirMap: {},
                usedMethodMap: {}
            }
        },
        created () {
            this.remoteData = Object.assign({}, this.remoteData, this.payload)
            // this.saveChange()
        },
        methods: {
            saveChange (val) {
                this.change(this.name, this.defaultValue, this.type, val)
            }
        }
    }
</script>
