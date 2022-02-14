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
    <style-layout title="透明度">
        <style-item name="opacity">
            <bk-input
                :value="opacityValue"
                type="number"
                placeholder="请输入"
                :min="0"
                :max="1"
                :native-attributes="{ step: 0.1 }"
                @change="handleOpacityChange"
                style="width: 100%" />
        </style-item>
    </style-layout>
</template>

<script>
    import StyleLayout from '../layout/index'
    import StyleItem from '../layout/item'

    export default {
        components: {
            StyleLayout,
            StyleItem
        },
        props: {
            value: {
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
                opacityValue: this.value.opacity || 1,
                isError: false
            }
        },
        methods: {
            handleOpacityChange (val) {
                this.opacityValue = val
                this.change('opacity', val)
            }
        }
    }
</script>
