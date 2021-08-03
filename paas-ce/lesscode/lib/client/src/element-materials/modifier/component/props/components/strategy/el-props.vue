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
    <div class="slot-card-wrapper card-item-content">
        <div class="card-item" v-for="(option, idx) in currentConfig.template" :key="idx">
            <div class="label">{{option.name}}</div>
            <bk-switcher
                v-if="option.type === 'boolean'"
                :value="defaultValue[option.key]"
                size="small"
                theme="primary"
                @change="val => handleChange(val, option.key)">
            </bk-switcher>
            <bk-input
                v-if="option.type === 'input'"
                :value="defaultValue[option.key]"
                @change="val => handleChange(val, option.key)" />
        </div>
    </div>
</template>

<script>
    const configMap = {
        'el-props': {
            template: [
                {
                    name: 'expandTrigger',
                    key: 'expandTrigger',
                    type: 'input'
                },
                {
                    name: 'multiple',
                    key: 'multiple',
                    type: 'boolean'
                }, {
                    name: 'checkStrictly',
                    key: 'checkStrictly',
                    type: 'boolean'
                }
            ]
        }
    }
    export default {
        props: {
            defaultValue: {
                type: Object,
                required: true
            },
            name: {
                type: String,
                required: true
            },
            type: {
                type: String,
                required: true
            },
            describe: {
                type: Object,
                required: true
            },
            change: {
                type: Function,
                required: true
            }
        },
        data () {
            return {
                objectDefault: {}
            }
        },
        computed: {
            currentConfig () {
                return configMap[this.type]
            }
        },
        created () {
            this.objectDefault = JSON.parse(JSON.stringify(this.defaultValue))
            this.trigger()
        },
        methods: {
            trigger () {
                this.change(this.name, JSON.parse(JSON.stringify(this.objectDefault)), this.type, this.payload)
            },
            handleChange (val, key) {
                this.objectDefault[key] = val
                this.trigger()
            }
        }
    }
</script>
<style>
    .card-item-content {
        padding: 10px 6px 0 6px;
        background-color: #F0F1F5;
        &:hover{
            box-shadow: 0px 2px 4px 0px rgba(0,0,0,0.2);
        }
        .card-item{
            display: flex;
            flex-direction: column;
            align-items: flex-start;
            margin-bottom: 10px;
            font-size: 12px;
        }
        .label{
            height: 24px;
            margin-right: 0.6em;
            text-align: right;
        }
    }
</style>
