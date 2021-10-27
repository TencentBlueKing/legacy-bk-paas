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
    <div class="widget-form-item" @click="handleSelect" :data-component-id="`component-${componentData.componentId}`">
        <bk-form-item
            :label="componentData.renderProps.label && componentData.renderProps.label.val"
            :required="componentData.renderProps.required && componentData.renderProps.required.val">
            <template v-for="(item) in componentData.renderSlots.default.val">
                <render-component :component-data="item" :key="item.componentId" />
            </template>
        </bk-form-item>
    </div>
</template>
<script>
    export default {
        name: 'widget-form-item',
        components: {
            renderComponent: () => import('../render/component')
        },
        props: {
            componentData: {
                type: Object,
                default: () => ({})
            }
        },
        methods: {
            handleSelect () {
                console.log('selefa')
            }
        }
    }
</script>
<style lang='postcss' scoped>
    .widget-form-item {
        margin: 10px;
        .component-wrapper{
            margin: 0;
        }
        .bk-form-content .component-wrapper {
            position: relative;
        }
    }
    .wrapper-cls-selected {
        border: 1px solid #3a84ff !important;
    }
</style>
