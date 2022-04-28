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
    <div v-if="config.length">
        <p class="style-setting-tips">样式面板中设置的样式将覆盖组件自带的默认样式，请谨慎调整</p>
        <position
            v-if="handleConfigIsShow('position')"
            :value="lastStyles"
            :include="handleGetConfig('position').include"
            :exclude="handleGetConfig('position').exclude"
            :change="handleChange" />
        <size
            v-if="handleConfigIsShow('size')"
            :value="lastStyles"
            :include="handleGetConfig('size').include"
            :exclude="handleGetConfig('size').exclude"
            :change="handleChange" />
        <padding
            v-if="handleConfigIsShow('padding')"
            :value="lastStyles"
            :include="handleGetConfig('padding').include"
            :exclude="handleGetConfig('padding').exclude"
            :change="handleChange" />
        <margin
            v-if="handleConfigIsShow('margin')"
            :value="lastStyles"
            :include="handleGetConfig('margin').include"
            :exclude="handleGetConfig('margin').exclude"
            :change="handleChange" />
        <font-config
            v-if="handleConfigIsShow('font')"
            :value="lastStyles"
            :include="handleGetConfig('font').include"
            :exclude="handleGetConfig('font').exclude"
            :change="handleChange" />
        <pointer
            v-if="handleConfigIsShow('pointer')"
            :value="lastStyles"
            :include="handleGetConfig('pointer').include"
            :exclude="handleGetConfig('pointer').exclude"
            :change="handleChange" />
        <background
            v-if="handleConfigIsShow('background')"
            :value="lastStyles"
            :include="handleGetConfig('background').include"
            :exclude="handleGetConfig('background').exclude"
            :change="handleChange" />
        <border
            v-if="handleConfigIsShow('border')"
            :value="lastStyles"
            :include="handleGetConfig('border').include"
            :exclude="handleGetConfig('border').exclude"
            :change="handleChange" />
        <opacity
            v-if="handleConfigIsShow('opacity')"
            :value="lastStyles"
            :include="handleGetConfig('opacity').include"
            :exclude="handleGetConfig('opacity').exclude"
            :change="handleChange" />
        <style-custom
            v-if="isShowCustom"
            :component-id="componentId"
            :value="lastStyles"
            :change="handleChange" />
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
    import StylePosition from './strategy/position'
    import StylePointer from './strategy/pointer'
    import StyleOpacity from './strategy/opacity'
    import StyleBackground from './strategy/background'

    const components = {
        StyleLayout,
        StyleItem,
        StyleCustom,
        position: StylePosition,
        size: StyleSize,
        padding: StylePadding,
        margin: StyleMargin,
        fontConfig: StyleFont,
        pointer: StylePointer,
        background: StyleBackground,
        border: StyleBorder,
        opacity: StyleOpacity
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
            this.componentData = LC.getActiveNode()
            const {
                componentId,
                material,
                renderStyles
            } = this.componentData
            this.componentId = componentId
            this.config = Object.freeze(material.styles || {})
            this.lastStyles = Object.assign({}, renderStyles)
        },
        methods: {
            handleChange (key, value) {
                this.componentData.setStyle(key, value)
                this.lastStyles[key] = value
            },
            handleConfigIsShow (key) {
                return this.config.some(item => (item.name && item.name === key) || item === key)
            },
            handleGetConfig (key) {
                const config = {
                    include: [],
                    exclude: []
                }
                const item = this.config.filter(item => item.name && item.name === key)
                if (item.length) {
                    config.include = item[0].include || []
                    config.exclude = item[0].exclude || []
                }
                return config
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
