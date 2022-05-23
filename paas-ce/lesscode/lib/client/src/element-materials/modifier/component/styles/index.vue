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
            v-if="checkConfig('position')"
            :value="lastStyles"
            :include="getConfig('position').include"
            :exclude="getConfig('position').exclude"
            :change="handleChange" />
        <size
            v-if="checkConfig('size')"
            :value="lastStyles"
            :include="getConfig('size').include"
            :exclude="getConfig('size').exclude"
            :change="handleChange" />
        <padding
            v-if="checkConfig('padding')"
            :value="lastStyles"
            :include="getConfig('padding').include"
            :exclude="getConfig('padding').exclude"
            :change="handleChange" />
        <margin
            v-if="checkConfig('margin')"
            :value="lastStyles"
            :include="getConfig('margin').include"
            :exclude="getConfig('margin').exclude"
            :change="handleChange" />
        <font-config
            v-if="checkConfig('font')"
            :value="lastStyles"
            :include="getConfig('font').include"
            :exclude="getConfig('font').exclude"
            :change="handleChange" />
        <pointer
            v-if="checkConfig('pointer')"
            :value="lastStyles"
            :include="getConfig('pointer').include"
            :exclude="getConfig('pointer').exclude"
            :change="handleChange" />
        <background
            v-if="checkConfig('background')"
            :value="lastStyles"
            :include="getConfig('background').include"
            :exclude="getConfig('background').exclude"
            :change="handleChange" />
        <border
            v-if="checkConfig('border')"
            :value="lastStyles"
            :include="getConfig('border').include"
            :exclude="getConfig('border').exclude"
            :change="handleChange" />
        <opacity
            v-if="checkConfig('opacity')"
            :value="lastStyles"
            :include="getConfig('opacity').include"
            :exclude="getConfig('opacity').exclude"
            :change="handleChange" />
        <style-custom
            v-if="isShowCustom"
            :component-id="componentId"
            :value="lastStyles"
            :change="handleChange" />
    </div>
</template>
<script>
    import _ from 'lodash'
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
                config: {},
                lastStyles: {}
            }
        },
        computed: {
            isShowCustom () {
                return !/$chart-/.test(this.componentId)
            }
        },
        created () {
            this.isInnerChange = false
            this.componentData = LC.getActiveNode()
            const {
                componentId,
                material,
                renderStyles
            } = this.componentData
            this.componentId = componentId
            this.config = Object.freeze(material.styles || {})
            this.lastStyles = Object.freeze(Object.assign({}, renderStyles))

            const updateCallback = _.debounce((event) => {
                if (this.isInnerChange) {
                    this.isInnerChange = false
                    return
                }
                this.lastStyles = Object.assign({}, event.target.renderStyles)
            }, 100)

            LC.addEventListener('setStyle', updateCallback)
            this.$once('hook:beforeDestroy', () => {
                LC.removeEventListener('setStyle', updateCallback)
            })
        },
        methods: {
            checkConfig (key) {
                return this.config.some(item => (item.name && item.name === key) || item === key)
            },
            getConfig (key) {
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
            },
            handleChange (key, value) {
                this.isInnerChange = true
                this.lastStyles = Object.freeze({
                    ...this.lastStyles,
                    [key]: value
                })
                this.componentData.setStyle(key, value)
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
