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
    <li class="bk-option"
        :class="{
            'is-disabled': disabled
        }"
        @click="handleOptionClick">
        <div class="bk-option-content">
            <span class="bk-option-name">
                全选
                <template v-if="isAllSelected">
                    {{`(${select.selectedOptions.length})`}}
                </template>
            </span>
        </div>
    </li>
</template>

<script>
    export default {
        name: 'x-option-all',
        inject: ['select'],
        data () {
            return {
                enabledOptions: []
            }
        },
        computed: {
            disabled () {
                return !this.enabledOptions.length
            },
            isAllSelected () {
                return !this.enabledOptions.some(option => !option.isSelected)
            }
        },
        watch: {
            'select.options' (options) {
                this.setEnabledOptions()
            }
        },
        methods: {
            setEnabledOptions () {
                this.enabledOptions = this.select.options.filter(option => !option.disabled)
            },
            handleOptionClick () {
                if (this.disabled) {
                    return false
                }
                if (this.isAllSelected) {
                    this.select.reset()
                } else {
                    this.select.selectAll()
                }
            }
        }
    }
</script>
