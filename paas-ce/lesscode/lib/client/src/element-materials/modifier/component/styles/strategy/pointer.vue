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
            <bk-select
                style="width: 100%;"
                :value="cursorValue"
                font-size="medium"
                :clearable="false"
                @change="handleChange">
                <bk-option id="auto" name="auto" />
                <bk-option id="default" name="default" />
                <bk-option id="crosshair" name="crosshair" />
                <bk-option id="pointer" name="pointer" />
                <bk-option id="move" name="move" />
                <bk-option id="text" name="text" />
                <bk-option id="wait" name="wait" />
                <bk-option id="help" name="help" />
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
                cursorValue: this.value.cursor || 'auto'
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
