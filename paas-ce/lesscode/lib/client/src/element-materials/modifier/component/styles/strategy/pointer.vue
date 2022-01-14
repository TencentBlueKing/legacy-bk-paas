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
        <style-item :name="'cursor'">
            <bk-select :value="cursorValue" style="width: 100%;" font-size="medium" :clearable="false" @change="handleChange">
                <bk-option v-for="option in cursorList" :key="option.id" :id="option.id" :name="option.name"></bk-option>
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
                cursorValue: this.value.cursor || 'auto',
                cursorList: [
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
        },
        methods: {
            handleChange (val) {
                this.cursorValue = val
                this.change('cursor', val)
            }
        }
    }
</script>
