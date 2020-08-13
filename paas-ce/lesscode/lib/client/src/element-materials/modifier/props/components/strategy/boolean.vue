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
    <div class="modifier-props-switch-container">
        <!-- <bk-switcher theme="primary" size="large" :value="props.defaultValue" @change="val => props.change(`${props.name}`, val, props.type)" /> -->
        <bk-switcher theme="primary" size="large" :value="renderValue" @change="handleChange" />
    </div>
</template>

<script>
    export default {
        props: {
            defaultValue: {
                type: Boolean,
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
            change: {
                type: Function,
                required: true
            }
        },
        data () {
            return {
                isError: false,
                renderValue: this.defaultValue
            }
        },
        methods: {
            handleChange (val) {
                this.renderValue = !this.renderValue
                this.change(`${this.name}`, val, this.type)
            }
        }
    }
</script>
