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
            <render-slots
                :material-config="materialConfig.slots"
                :last-slots="lastSlots"
                :last-props="lastProps"
                @change="batchUpdate">
            </render-slots>
            <template v-for="(item, key) in materialConfig.props">
                <render-prop
                    v-if="!(key === 'slots' && item.type === 'hidden')"
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
    import { mapGetters } from 'vuex'

    import RenderProp from './components/render-prop'
    import RenderSlots from '../slots'
    import { bus } from '@/common/bus'
    import LC from '@/element-materials/core'

    export default {
        name: 'modifier-prop',
        components: {
            RenderProp,
            RenderSlots
        },
        props: {
            // materialConfig: {
            //     type: Object,
            //     required: true
            // },
            // lastProps: {
            //     type: Object,
            //     default: () => ({})
            // },
            lastDirectives: {
                type: Array,
                default: () => ([])
            }
            // lastSlots: {
            //     type: Object,
            //     default: () => ({})
            // }
        },
        data () {
            return {
                materialConfig: {},
                lastProps: {},
                lastSlots: {}
            }
        },
        computed: {
            ...mapGetters('drag', ['curSelectedComponentData']),

            hasMaterialConfig () {
                const propConfig = this.materialConfig.props || {}
                const slotConfig = this.materialConfig.slots || {}
                const configs = { ...propConfig, ...slotConfig }
                const keys = Object.keys(configs).filter(key => configs[key].display !== 'hidden')
                return keys.length
            }
        },
        created () {
            this.renderProps = this.lastProps
            bus.$on('update-chart-options', this.updateChartOptions)
            this.$once('hook:beforeDestroy', () => {
                bus.$off('update-chart-options', this.updateChartOptions)
            })
            this.currentComponentNode = LC.getActiveNode()
            console.log('from modify props = ', this.currentComponentNode)
            if (this.currentComponentNode) {
                const {
                    material,
                    prop,
                    slot
                } = this.currentComponentNode
                this.materialConfig = Object.freeze(material)
                this.lastProps = prop
                this.lastSlots = slot
            }
        },
        methods: {
            // 针对chart类型，将动态返回的remoteOptions与options合并
            updateChartOptions (res) {
                if (this.renderProps['options'] && this.renderProps['options'].val && typeof this.renderProps['options'].val === 'object') {
                    const options = Object.assign({}, this.renderProps['options'].val, res)
                    this.renderProps['options'].val = options
                    this.$emit('on-change', {
                        renderProps: this.renderProps
                    })
                }
            },
            handleChange (key, args) {
                // 使用增量更新的方式更新 props
                this.renderProps[key] = this.renderProps[key] || {}
                for (const argKey in (args || {})) {
                    if (Object.hasOwnProperty.call(args, argKey)) {
                        const element = args[argKey]
                        this.$set(this.renderProps[key], argKey, element)
                    }
                }
                const renderProps = {
                    renderProps: this.renderProps
                }
                this.batchUpdate(renderProps)
            },
            batchUpdate (renderData) {
                this.currentComponentNode.setRenderProps(renderData.renderProps)
                // this.$emit('on-change', renderData)
            }
        }
    }
</script>
