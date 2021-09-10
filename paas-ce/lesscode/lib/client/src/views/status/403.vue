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
    <div :class="$style['container']">
        <bk-exception :class="$style['exception-wrap']" type="403">
            <div>Forbidden</div>
            <bk-link theme="primary" @click="$router.replace({ path: '/' })">返回首页</bk-link>
        </bk-exception>
    </div>
</template>

<script>
    export default {
        data () {
            return {}
        }
    }
</script>

<style lang="postcss" module>
    .container {
        display: flex;
        height: calc(100vh - 64px);
        margin-top: 64px;
        .exception-wrap {
            justify-content: center;
            margin-top: -120px;
        }
    }
</style>
