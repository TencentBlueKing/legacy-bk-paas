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
    <div class="flow-edit-page-container">
        <div class="flow-edit-page-header">
            <div class="function-and-tool">
                <div class="operation-select">
                    <div class="select-item">
                        <i class="bk-drag-icon bk-drag-huabu"></i>
                        <span>流程设计</span>
                    </div>
                </div>
                <div class="spilt-line" />
                <action-tool></action-tool>
            </div>
            <generate-page-btns></generate-page-btns>
        </div>
        <div class="flow-edit-page-content">
            <flow-edit></flow-edit>
        </div>
    </div>
</template>
<script>
    import ActionTool from './components/action-tool'
    import GeneratePageBtns from './components/generate-page-btns/index.vue'
    import FlowEdit from '@/components/flow/index.vue'

    export default {
        name: 'flowEditPage',
        components: {
            ActionTool,
            GeneratePageBtns,
            FlowEdit
        }
    }
</script>
<style lang="postcss" scoped>
    $headerHeight: 64px;
    $pageHeaderHeight: 52px;

    .flow-edit-page-container {
        min-width: 1366px;
        height: calc(100vh - $headerHeight);
        margin-top: $headerHeight;
    }
    .flow-edit-page-header {
        position: relative;
        display: flex;
        justify-content: space-between;
        height: 52px;
        background: #fff;

        &:after{
            content: '';
            position: absolute;
            right: 0;
            bottom: 0;
            left: 0;
            z-index: 99;
            height: 1px;
            box-shadow: 0px 2px 2px 0px rgba(0, 0, 0, 0.1);
        }
        .function-and-tool {
            position: relative;
            display: flex;
            flex: 1;
            justify-content: center;
            align-items: center;
        }
        .operation-select{
            display: flex;
            height: 100%;
            align-items: center;
            .select-item{
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                height: 100%;
                min-width: 60px;
                font-size: 12px;
                background-color: #e1ecff;
                color: #3a84ff;
                cursor: pointer;
                i {
                    font-size: 16px;
                    margin-bottom: 5px;
                }
            }
        }
        .spilt-line {
            height: 22px;
            width: 1px;
            margin: 0 5px;
            background-color: #dcdee5;
        }
    }
    .flow-edit-page-content{
        height: calc(100vh - $headerHeight - $pageHeaderHeight);
    }
</style>
