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
    <div class="widget-form">
        <div v-if="componentData.renderProps.slots.val < 1" class="normal">
            请在右侧配置表单项
        </div>
        <template v-else>
            <bk-form v-bind="renderProps">
                <widget-form-item
                    v-for="(formItemData, index) in formItemList"
                    :key="index"
                    :component-data="formItemData" />
                <bk-form-item label="">
                    <render-component
                        v-for="(formItemData, index) in actionList"
                        :key="index"
                        :component-data="formItemData" />
                </bk-form-item>
            </bk-form>
        </template>
    </div>
</template>
<script>
    import WidgetFormItem from './form-item'

    export default {
        name: '',
        components: {
            WidgetFormItem,
            renderComponent: () => import('../render/component')
        },
        inheritAttrs: false,
        props: {
            componentData: {
                type: Object,
                default: () => ({})
            }
        },
        computed: {
            renderProps () {
                const props = {}
                for (const key in this.componentData.renderProps) {
                    props[key] = this.componentData.renderProps[key].val
                }
                return props
            },
            formItemList () {
                const result = []
                for (let i = 0; i < this.componentData.renderProps.slots.val.length; i++) {
                    const currentSlot = this.componentData.renderProps.slots.val[i]
                    if (currentSlot.type === 'bk-form-item') {
                        result.push(currentSlot)
                    }
                }
                return result
            },
            actionList  () {
                const result = []
                for (let i = 0; i < this.componentData.renderProps.slots.val.length; i++) {
                    const currentSlot = this.componentData.renderProps.slots.val[i]
                    if (currentSlot.type === 'bk-button') {
                        result.push(currentSlot)
                    }
                }
                return result
            }
        },
        created () {
            console.log('from form watch   =  ', this.componentData)
        }
    }
</script>
<style lang='postcss'>
    .widget-form{
        .normal{
            height: 80px;
            line-height: 80px;
            font-size: 18px;
            color: #ccc;
            text-align: center;
        }
    }
</style>
