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
    <style-layout title="display">
        <style-item name="display">
            <bk-select :value="displayValue" style="width: 100%;" font-size="medium" :clearable="false" @change="handleDisplayChange">
                <bk-option v-for="option in displayList" :key="option.id" :id="option.id" :name="option.name"></bk-option>
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
                displayValue: this.value.display || '',
                displayList: [
                    { id: 'inherit', name: 'inherit' },
                    { id: 'initial', name: 'initial' },
                    { id: 'inline', name: 'inline' },
                    { id: 'inline-block', name: 'inline-block' },
                    { id: 'block', name: 'block' },
                    { id: 'flex', name: 'flex' },
                    { id: 'none', name: 'none' },
                    { id: 'contents', name: 'contents' },
                    { id: 'grid', name: 'grid' },
                    { id: 'inline-flex', name: 'inline-flex' },
                    { id: 'inline-grid', name: 'inline-grid' },
                    { id: 'inline-table', name: 'inline-table' },
                    { id: 'flow-root', name: 'flow-root' },
                    { id: 'list-item', name: 'list-item' },
                    { id: 'table', name: 'table' },
                    { id: 'table-caption', name: 'table-caption' },
                    { id: 'table-cell', name: 'table-cell' },
                    { id: 'table-column', name: 'table-column' },
                    { id: 'table-column-group', name: 'table-column-group' },
                    { id: 'table-footer-group', name: 'table-footer-group' },
                    { id: 'table-header-group', name: 'table-header-group' },
                    { id: 'table-row', name: 'table-row' },
                    { id: 'table-row-group', name: 'table-row-group' },
                    { id: 'unset', name: 'unset' },
                    { id: '-webkit-box', name: '-webkit-box' },
                    { id: '-webkit-inline-box', name: '-webkit-inline-box' }
                ]
            }
        },
        methods: {
            handleDisplayChange (val) {
                this.displayValue = val
                this.change('display', val)
            }
        }
    }
</script>
