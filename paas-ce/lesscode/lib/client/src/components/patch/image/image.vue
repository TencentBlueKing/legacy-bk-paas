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
    <div class="bk-image-wrapper">
        <img ref="img" :src="src" :alt="alt" v-show="!isUnset"
            :width="width"
            :height="height"
            :class="['bk-image', extCls]">
        <i class="bk-drag-icon icon-image" v-show="isUnset"></i>
    </div>
</template>

<script>
    export default {
        name: 'bk-image',
        props: {
            width: {
                type: Number
            },
            height: {
                type: Number
            },
            src: {
                type: String,
                default: ''
            },
            alt: {
                type: String
            },
            extCls: {
                type: String,
                default: ''
            }
        },
        computed: {
            isUnset () {
                return !this.src && !this.width && !this.height
            }
        }
    }
</script>

<style>
    @import './image.css';
</style>
