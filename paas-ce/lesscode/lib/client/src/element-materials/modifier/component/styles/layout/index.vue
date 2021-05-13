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
    <div class="modifier-style">
        <div class="style-title">
            {{ props.title }}
        </div>
        <div class="style-action">
            <slot />
        </div>
    </div>
</template>

<style lang='postcss'>
    .modifier-style {
        display: flex;
        flex-direction: column;
        width: 276px;
        padding: 20px 0 10px;
        margin-left: 12px;
        .style-title {
            font-size: 12px;
            display: flex;
            align-items: center;
            height: 20px;
            line-height: 20px;
            font-weight: bold;
        }
    }
</style>
