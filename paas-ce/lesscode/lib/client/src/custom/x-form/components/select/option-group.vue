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
    <li class="bk-option-group" v-show="visible">
        <div class="bk-option-group-name" :class="select.fontSizeCls">
            <slot name="group-name">{{name}} <template v-if="showCount">({{options.length}})</template></slot>
        </div>
        <ul class="bk-group-options">
            <slot></slot>
        </ul>
    </li>
</template>

<script>
    export default {
        name: 'x-option-group',
        props: {
            name: {
                type: String,
                required: true
            },
            showCount: {
                type: Boolean,
                default: true
            }
        },
        provide () {
            return {
                optionGroup: this
            }
        },
        inject: ['select'],
        data () {
            return {
                options: []
            }
        },
        computed: {
            unmatchedCount () {
                return this.options.filter(option => option.unmatched).length
            },
            visible () {
                const optionCount = this.options.length
                if (!optionCount) {
                    return true
                }
                return optionCount !== this.unmatchedCount
            }
        },
        methods: {
            registerOption (option) {
                this.options.push(option)
            },
            removeOption (option) {
                const index = this.options.indexOf(option)
                if (index > -1) {
                    this.options.splice(index, 1)
                }
            }
        }
    }
</script>
