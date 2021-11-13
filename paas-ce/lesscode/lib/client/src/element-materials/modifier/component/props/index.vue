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
        <template v-if="hasMaterialConfig">
            <render-slots />
            <template v-for="(item, key) in propsConfig">
                <render-prop
                    v-if="item.type !== 'hidden'"
                    :describe="item"
                    :last-value="lastProps[key]"
                    :last-directives="lastDirectives"
                    :name="key"
                    :key="key"
                    @on-change="handleChange"
                    @batch-update="batchUpdate" />
            </template>
        </template>
        <div class="no-prop" v-else>
            <span>该组件暂无属性</span>
        </div>
    </div>
</template>
<script>
    import _ from 'lodash'
    import { bus } from '@/common/bus'
    import LC from '@/element-materials/core'
    import RenderProp from './components/render-prop'
    import RenderSlots from '../slots'

    export default {
        name: 'modifier-prop',
        components: {
            RenderProp,
            RenderSlots
        },
        data () {
            return {
                propsConfig: {},
                lastDirectives: []
            }
        },
        computed: {
            hasMaterialConfig () {
                const configs = { ...this.propsConfig, ...this.slotsConfig }
                const keys = Object.keys(configs).filter(key => configs[key].display !== 'hidden')
                return keys.length
            }
        },
        created () {
            this.lastProps = {}
            this.renderProps = {}
            bus.$on('update-chart-options', this.updateChartOptions)
            this.$once('hook:beforeDestroy', () => {
                bus.$off('update-chart-options', this.updateChartOptions)
            })
            this.currentComponentNode = LC.getActiveNode()
            if (this.currentComponentNode) {
                const {
                    material,
                    renderProps,
                    renderDirectives
                } = this.currentComponentNode
                this.propsConfig = Object.freeze(material.props)
                this.lastProps = Object.assign({}, renderProps)
                this.lastDirectives = Object.freeze(_.cloneDeep(renderDirectives))
                this.renderProps = _.cloneDeep(renderProps)
            }
        },
        methods: {
            // 针对chart类型，将动态返回的remoteOptions与options合并
            updateChartOptions (res) {
                if (this.renderProps['options']
                    && this.renderProps['options'].val
                    && typeof this.renderProps['options'].val === 'object') {
                    const options = Object.assign({}, this.renderProps['options'].val, res)
                    this.renderProps['options'] = {
                        ...this.renderProps['options'],
                        val: options
                    }
                    this.renderProps['options'].val = options
                    this.batchUpdate({
                        renderProps: this.renderProps
                    })
                }
            },
            handleChange (key, value = {}) {
                this.renderProps[key] = value
                this.batchUpdate({
                    renderProps: this.renderProps
                })
            },
            /**
             * @desc 更新 renderProps
             * @param { Object } { renderProps, renderDirectives }
             */
            batchUpdate ({ renderProps, renderDirectives }) {
                if (renderProps) {
                    this.currentComponentNode.setRenderProps(renderProps)
                }
                if (renderDirectives) {
                    this.lastDirectives = Object.freeze(renderDirectives)
                    this.currentComponentNode.setRenderDirectives(renderDirectives)
                }
            }
        }
    }
</script>
