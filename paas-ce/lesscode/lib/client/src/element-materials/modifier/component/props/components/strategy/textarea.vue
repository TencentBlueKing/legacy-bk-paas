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

<!-- <template functional>
    <bk-input
        style="width: 100%"
        type="textarea"
        :rows="5"
        :value="JSON.stringify(props.defaultValue)"
        @blur="val => props.change(`${props.name}`, val, props.type)" />
</template> -->

<template>
    <bk-input style="width: 100%" type="textarea" :rows="5" :value="bindValue" @blur="handleChange" />
</template>

<script>
    import { circleJSON } from '@/common/util.js'
    export default {
        props: {
            defaultValue: {
                type: [Object, Array, Number, String],
                required: true
            },
            payload: {
                type: Object,
                default: () => ({})
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
        computed: {
            bindValue () {
                return circleJSON(this.defaultValue)
            }
        },
        created () {
            // this.handleChange(circleJSON(this.defaultValue))
        },
        methods: {
            handleChange (val) {
                this.change(this.name, val, this.type, this.payload)
            }
        }
    }
</script>
