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
    <style-layout title="鼠标">
        <style-item :name="item.name" v-for="item in pointerConfigRender" :key="item.key">
            <bk-select :value="item.value" style="width: 100%;" font-size="medium" :clearable="false" @change="handleChange(item, $event)">
                <bk-option v-for="option in item.valueList" :key="option.id" :id="option.id" :name="option.name"></bk-option>
            </bk-select>
        </style-item>
    </style-layout>
</template>

<script>
    import StyleLayout from '../layout/index'
    import StyleItem from '../layout/item'
    
    const pointerConfig = [
        {
            name: 'pointer-events',
            key: 'pointerEvents',
            valueList: [
                { name: 'auto', id: 'auto' },
                { name: 'none', id: 'none' },
                { name: 'inherit', id: 'inherit' }
            ]
        },
        {
            name: 'cursor',
            key: 'cursor',
            valueList: [
                { name: 'auto', id: 'auto' },
                { name: 'default', id: 'default' },
                { name: 'crosshair', id: 'crosshair' },
                { name: 'pointer', id: 'pointer' },
                { name: 'move', id: 'move' },
                { name: 'text', id: 'text' },
                { name: 'wait', id: 'wait' },
                { name: 'help', id: 'help' }
            ]
        }
    ]

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
            include: {
                type: Array
            },
            exclude: {
                type: Array
            },
            change: {
                type: Function,
                required: true
            }
        },
        data () {
            return {
                pointerConfigRender: []
            }
        },
        mounted () {
            this.handleInitValueList()
        },
        methods: {
            handleInitValueList () {
                let result = pointerConfig
                if (this.include && this.include.length) {
                    result = result.filter(item => this.include.includes(item.key))
                }
                if (this.exclude) {
                    result = result.filter(item => !this.exclude.includes(item.key))
                }
                const that = this
                result = result.map(function (item) {
                    item['value'] = that.value[item.key] || 'auto'
                    return item
                })
                this.pointerConfigRender = result
            },
            handleChange (item, val) {
                item.value = val
                this.change(item.key, val)
            }
        }
    }
</script>
