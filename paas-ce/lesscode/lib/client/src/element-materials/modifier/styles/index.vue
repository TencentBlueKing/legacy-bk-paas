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
    <div>
        <template v-if="materialConfig.length">
            <template v-for="(com, index) in materialConfig">
                <component
                    :is="com"
                    :key="index"
                    :value="lastStyles"
                    :change="handleChange" />
            </template>
        </template>
        <div class="no-style" v-else>
            <span v-if="Object.keys(curSelectedComponentData).length">该组件暂无样式</span>
        </div>
    </div>
</template>
<script>
    import { mapGetters } from 'vuex'

    import StyleLayout from './layout/index'
    import StyleItem from './layout/item'
    import StyleSize from './strategy/size'
    import StylePadding from './strategy/padding'
    import StyleMargin from './strategy/margin'
    import StyleFont from './strategy/font'
    import StyleBorder from './strategy/border'
    import StyleBackgroundColor from './strategy/background-color'
    import StyleColor from './strategy/color'
    import StyleTextAlign from './strategy/text-align'
    import StyleDisplay from './strategy/display'

    const components = {
        StyleLayout,
        StyleItem,
        size: StyleSize,
        padding: StylePadding,
        margin: StyleMargin,
        font: StyleFont,
        border: StyleBorder,
        backgroundColor: StyleBackgroundColor,
        color: StyleColor,
        textAlign: StyleTextAlign,
        display: StyleDisplay
    }

    export default {
        name: 'modifier-style',
        components,
        props: {
            materialConfig: {
                type: Array,
                required: true
            },
            lastStyles: {
                type: Object,
                default: () => ({})
            }
        },
        computed: {
            ...mapGetters('drag', ['curSelectedComponentData'])
        },
        created () {
            this.renderStyles = this.lastStyles
        },
        methods: {
            handleChange (key, value) {
                const renderStyles = {
                    ...this.renderStyles,
                    [key]: value
                }
                this.renderStyles = renderStyles
                this.$emit('on-change', {
                    renderStyles
                })
            }
        }
    }
</script>
