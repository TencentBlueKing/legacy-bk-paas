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
    <div v-if="hasMaterialConfig">
        <template v-for="(item, key) in propsConfig">
            <render-prop
                v-if="item.type !== 'hidden'"
                :component-type="componentType"
                :describe="item"
                :last-value="lastProps[key]"
                :name="key"
                :key="key"
                @on-change="handleChange" />
        </template>
    </div>
</template>
<script>
    import _ from 'lodash'
    import { bus } from '@/common/bus'
    import LC from '@/element-materials/core'
    import RenderProp from './components/render-prop'

    export default {
        name: 'modifier-prop',
        components: {
            RenderProp
        },
        data () {
            return {
                propsConfig: {},
                lastProps: {}
            }
        },
        computed: {
            hasMaterialConfig () {
                const keys = Object.keys(this.propsConfig).filter(key => this.propsConfig[key].display !== 'hidden')
                return keys.length
            }
        },
        created () {
            this.material = {}
            bus.$on('update-chart-options', this.updateChartOptions)
            this.$once('hook:beforeDestroy', () => {
                bus.$off('update-chart-options', this.updateChartOptions)
            })
            this.componentNode = LC.getActiveNode()
            if (this.componentNode) {
                const {
                    type,
                    material,
                    renderProps
                } = this.componentNode
                this.componentType = type
                this.propsConfig = Object.freeze(material.props)
                this.lastProps = Object.freeze(_.cloneDeep(renderProps))
                this.material = material
            }
            const updateCallback = _.debounce((event) => {
                if (event.target.componentId !== this.componentNode.componentId) {
                    return
                }

                this.lastProps = Object.freeze(_.cloneDeep(this.componentNode.renderProps))
            }, 100)

            LC.addEventListener('setProp', updateCallback)
            this.$once('hook:beforeDestroy', () => {
                LC.removeEventListener('setProp', updateCallback)
            })
        },
        methods: {
            // 针对chart类型，将动态返回的remoteOptions与options合并
            updateChartOptions (res) {
                // if (this.renderProps['options']
                //     && this.renderProps['options'].val
                //     && typeof this.renderProps['options'].val === 'object') {
                //     const options = Object.assign({}, this.renderProps['options'].val, res)
                //     this.renderProps['options'] = {
                //         ...this.renderProps['options'],
                //         val: options
                //     }
                //     this.renderProps['options'].val = options
                //     this.batchUpdate({
                //         renderProps: this.renderProps
                //     })
                // }
            },
            /**
             * @desc 部分场景需要通过 prop 的配置自动推导 slot 的配置
             * @param { Object } propData
             *
             * eq:
             * 通过 table 的 data 推导出 table 列的配置
             */
            syncSlot (propData) {
                const {
                    format,
                    valueType,
                    payload
                } = propData

                // 需要同步 prop 配置到 slot 的场景
                // 同时满足下面的条件
                // - prop format 配置为值类型
                // - prop 的值类型是数据源
                if (format !== 'value' || !payload.sourceData) {
                    return
                }
                if (valueType === 'table-data-source') {
                    // 默认同步 slot.default
                    const slotName = 'default'
                    const slotConfig = this.material.slots[slotName]
                    const columns = payload.sourceData.columns
                    const slotValue = columns.map(columnName => ({
                        label: columnName,
                        prop: columnName,
                        sortable: false,
                        type: ''
                    }))
                    this.componentNode.setRenderSlots({
                        format: 'value',
                        component: Array.isArray(slotConfig.name) ? slotConfig.name[0] : slotConfig.name,
                        code: slotValue,
                        valueType: 'table-list',
                        renderValue: slotValue
                    }, slotName)
                }
            },
            /**
             * @desc 更新 prop 配置
             * @param { String } propName
             * @param { Object } propData
             *
             * 更新列配置并同步 slot
             */
            handleChange: _.throttle(function (propName, propData) {
                this.lastProps = Object.freeze({
                    ...this.lastProps,
                    [propName]: propData
                })
                this.componentNode.setRenderProps({
                    ...this.lastProps,
                    [propName]: propData
                })
                this.syncSlot(propData)
            }, 60)
        }
    }
</script>
