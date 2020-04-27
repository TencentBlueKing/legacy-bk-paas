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

<template functional>
    <div>
        <div class="text-title">文本配置：</div>
        <div class="text-action">
            <bk-input :value="props.defaultValue" @change="val => props.change('slots', val, props.type)" />
        </div>
    </div>
</template>
<style lang='postcss'>
    .text-title {
        height: 32px;
        font-size: 14px;
        font-weight: 500;
        color: #606266;
    }
    .text-action {
        display: flex;
        flex-direction: column;
    }
</style>
