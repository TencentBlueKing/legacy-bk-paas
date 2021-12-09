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
            [$style['form-item']]: true,
            [$style['inline']]: isInlineLayout
        }">
        <bk-form-item v-bind="componentData.prop">
            <template v-for="componentDate in componentData.slot.default">
                <resolve-component
                    :component-data="componentDate"
                    :key="componentDate.componentId" />
            </template>
        </bk-form-item>
    </div>
</template>
<script>
    import LC from '@/element-materials/core'

    export default {
        name: 'widget-form-item',
        components: {
            ResolveComponent: () => import('../resolve-component')
        },
        props: {
            componentData: {
                type: Object,
                default: () => ({})
            },
            formType: {
                type: String,
                default: ''
            }
        },
        computed: {
            isInlineLayout () {
                return this.formType === 'inline'
            }
        },
        created () {
            const updateCallback = ({ target }) => {
                if (target.componentId === this.componentData.componentId) {
                    this.$forceUpdate()
                }
            }

            LC.addEventListener('update', updateCallback)
            this.$once('hook:beforeDestroy', () => {
                LC.removeEventListener('update', updateCallback)
            })
        }
    }
</script>
<style lang='postcss' module>
    .form-item {
        position: relative;
        z-index: 10;
        & + .form-item{
            margin-top: 20px
        }
        &.inline{
            display: inline-block;
            margin-top: 0;
            margin-bottom: 0;
            vertical-align: middle;
            & + .inline{
                margin-left: 8px;
            }
        }
    }
</style>
