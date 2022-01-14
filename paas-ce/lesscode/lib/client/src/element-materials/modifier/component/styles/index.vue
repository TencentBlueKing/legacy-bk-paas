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
        <template v-if="config.length">
            <p class="style-setting-tips">样式面板中设置的样式将覆盖组件自带的默认样式，请谨慎调整</p>
            <template v-for="(com, index) in config">
                <component
                    :is="com.name || com"
                    :key="index"
                    :value="lastStyles"
                    :include="com.include"
                    :exclude="com.exclude"
                    :change="handleChange" />
            </template>
        </template>
        <style-custom
            v-if="isShowCustom"
            :component-id="componentId"
            :value="lastStyles"
            :change="handleChange" />
        <!-- <div v-else class="no-style">
            <span v-if="Object.keys(config).length">该组件暂无样式</span>
        </div> -->
    </div>
</template>
<script>
    import LC from '@/element-materials/core'

    import StyleLayout from './layout/index'
    import StyleItem from './layout/item'
    import StyleCustom from './strategy/custom-style'
    import StyleSize from './strategy/size'
    import StylePadding from './strategy/padding'
    import StyleMargin from './strategy/margin'
    import StyleFont from './strategy/font'
    import StyleBorder from './strategy/border'
    import StyleBackgroundColor from './strategy/background-color'
    import StyleColor from './strategy/color'
    import StyleTextAlign from './strategy/text-align'
    import StyleDisplay from './strategy/display'
    import StylePosition from './strategy/position'
    import StylePointer from './strategy/pointer'
    import StyleOpacity from './strategy/opacity'
    import StyleBackground from './strategy/background'

    const components = {
        StyleLayout,
        StyleItem,
        StyleCustom,
        size: StyleSize,
        padding: StylePadding,
        margin: StyleMargin,
        font: StyleFont,
        border: StyleBorder,
        backgroundColor: StyleBackgroundColor,
        color: StyleColor,
        textAlign: StyleTextAlign,
        display: StyleDisplay,
        position: StylePosition,
        pointer: StylePointer,
        opacity: StyleOpacity,
        background: StyleBackground
    }

    export default {
        name: 'modifier-style',
        components,
        data () {
            return {
                componentId: '',
                config: {}
            }
        },
        computed: {
            isShowCustom () {
                return !/$chart-/.test(this.componentId)
            }
        },
        created () {
            this.currentComponentNode = LC.getActiveNode()
            const {
                componentId,
                material,
                renderStyles
            } = this.currentComponentNode
            this.componentId = componentId
            this.config = Object.freeze(material.styles)
            this.lastStyles = Object.assign({}, renderStyles)
            console.log(this.config)
            console.log(this.lastStyles)
        },
        methods: {
            handleChange (key, value) {
                this.currentComponentNode.setStyle(key, value)
            }
        }
    }
</script>

<style lang="postcss" scoped>
    .style-setting-tips {
        font-size: 12px;
        margin: 10px 5px 5px 14px;
    }
</style>
