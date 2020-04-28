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
    <style-layout title="对齐方式">
        <style-item name="text-align">
            <bk-select :value="textAlignValue" style="width: 96px;" font-size="medium" :clearable="false" @change="handleTextAlignChange">
                <bk-option v-for="option in textAlignList" :key="option.id" :id="option.id" :name="option.name"></bk-option>
            </bk-select>
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
                textAlignValue: this.value['textAlign'] || 'center',
                textAlignList: [
                    {
                        id: 'center', name: 'center'
                    },
                    {
                        id: 'left', name: 'left'
                    },
                    {
                        id: 'right', name: 'right'
                    }
                ]
            }
        },
        methods: {
            handleTextAlignChange (value) {
                this.textAlignValue = value
                this.change('textAlign', value)
            }
        }
    }
</script>
