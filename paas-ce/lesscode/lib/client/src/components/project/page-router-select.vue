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
    <component
        :is="`bk-${field.type}`"
        :class="[`form-component ${field.type}`, { error: (errors[field.id] || []).length }]"
        :placeholder="placeholder"
        v-model.trim="syncValue"
        v-bind="field.props"
        :ref="`component-${field.id}`">
        <slot-component
            v-for="child in field.children"
            :key="child.id"
            :is="`bk-${child.type}`"
            v-bind="child.props"
        >
            <slot-component-child
                v-for="childSlot in child.children"
                :key="childSlot.id"
                :is="`bk-${childSlot.type}`"
                v-bind="childSlot.props"
            >
                <template v-if="field.id === 'pageRoute'">
                    <div class="bk-option-content-default" :title="childSlot.props.name">
                        <div class="bk-option-name">
                            {{childSlot.props.name}}<span class="bound" v-if="childSlot.props.disabled">（已绑定）</span>
                        </div>
                    </div>
                </template>
            </slot-component-child>
        </slot-component>
        <div slot="extension" style="cursor: pointer;" @click="$emit('goPage', 'layout')" v-if="field.id === 'layoutId'">
            <i class="bk-drag-icon bk-drag-jump-link"></i> 新建模板实例
        </div>
        <div slot="extension" style="cursor: pointer;" @click="$emit('goPage', 'routes')" v-if="field.id === 'pageRoute'">
            <i class="bk-drag-icon bk-drag-jump-link"></i> 新建路由
        </div>
    </component>
</template>
<script>
    export default {
        props: {
            field: {
                type: Object,
                default: () => ({})
            },
            value: {
                type: [String, Number],
                default: ''
            },
            errors: {
                type: Object,
                default: () => ({})
            },
            placeholder: {
                type: String,
                default: ''
            }
        },
        computed: {
            syncValue: {
                get () {
                    return this.value
                },
                set (val) {
                    this.$emit('update:value', val)
                }
            }
        }
    }
</script>
