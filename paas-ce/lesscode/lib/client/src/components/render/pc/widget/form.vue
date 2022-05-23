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
    <div
        :class="{
            [$style['form']]: true,
            [$style['empty']]: componentData.slot.default.length < 1
        }">
        <bk-form
            v-if="componentData.slot.default.length > 0"
            v-bind="componentData.prop">
            <widget-form-item
                v-for="formItemNode in componentData.slot.default"
                :key="formItemNode.componentId"
                :component-data="formItemNode"
                :form-type="componentData.prop['form-type']" />
        </bk-form>
    </div>
</template>
<script>
    import WidgetFormItem from './form-item'

    export default {
        name: '',
        components: {
            WidgetFormItem
        },
        inheritAttrs: false,
        props: {
            componentData: {
                type: Object,
                required: true
            }
        }
    }
</script>
<style lang='postcss' module>
    .form{
        border: 1px dashed #ccc;
        &.empty{
            position: relative;
            height: 80px;
            line-height: 80px;
            font-size: 18px;
            background: #FAFBFD;
            &::before{
                content: "请在右侧配置表单项";
                position: absolute;
                top: 0;
                right: 0;
                bottom: 0;
                left: 0;
                display: flex;
                justify-content: center;
                align-items: center;
                font-size: 14px;
                color: #C4C6CC;
                pointer-events: all;
            }
        }
    }
</style>
