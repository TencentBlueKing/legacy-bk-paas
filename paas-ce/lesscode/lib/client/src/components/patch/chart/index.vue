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
    <div v-if="height" :style="computedStyle">
        <echart :options="options" autoresize></echart>
    </div>
    <echart v-else :options="options" autoresize></echart>
</template>

<script>
    import ECharts from 'vue-echarts/components/ECharts.vue'
    import 'echarts/lib/chart/bar'
    import 'echarts/lib/chart/line'
    import 'echarts/lib/chart/pie'
    import 'echarts/lib/component/tooltip'
    import 'echarts/lib/component/title'
    import 'echarts/lib/component/legend'

    export default {
        name: 'chart',
        components: {
            echart: ECharts
        },
        props: {
            width: {
                type: [Number, String],
                default: ''
            },
            height: {
                type: [Number, String],
                default: ''
            },
            options: {
                type: Object,
                default: () => ({})
            }
        },
        computed: {
            computedStyle () {
                let widthVal = this.width ? (typeof this.width === 'number' ? `${this.width}px` : this.width) : '100%'
                // 画布渲染时将百分比置为100%
                this.$route.name === 'new' && widthVal.endsWith('%') && (widthVal = '100%')
                const widthStr = `width:${widthVal};`
                
                const heightStr = `height:${this.height}px;`
                
                return widthStr + heightStr
            }
        }
    }
</script>

<style scoped>
    /* 不加 scoped 会被 vue-echarts 默认的 .echarts 样式覆盖 */
    .echarts {
        width: 100%;
        height: 100%;
    }
</style>
