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
    <section>
        <template v-if="config.length">
            <h3 class="event-tip">可以添加函数执行参数，执行的时候会把事件相关的实参放在自定义参数后传入</h3>
            <ul>
                <li
                    v-for="event in config"
                    :key="event.name"
                    class="event-item">
                    <h3 class="event-title">
                        <span
                            v-if="event.tips"
                            class="label"
                            v-bk-tooltips="transformTipsWidth(event.tips)">
                            {{ event.name }}
                        </span>
                        <span v-else>{{ event.name }}</span>
                    </h3>
                    <select-func
                        :value="lastEvents[event.name]"
                        @change="(value) => handleChange(value, event.name)" />
                </li>
            </ul>
        </template>
        <!-- <div class="no-event" v-else>
            <span>该组件暂无事件</span>
        </div> -->
    </section>
</template>

<script>
    import { mapGetters } from 'vuex'
    import LC from '@/element-materials/core'
    import { transformTipsWidth } from '@/common/util'
    import selectFunc from '@/components/methods/select-func'

    export default {
        name: 'modifier-events',
        components: {
            selectFunc
        },
        
        data () {
            return {
                config: [],
                transformTipsWidth
            }
        },
        computed: {
            ...mapGetters('functions', ['funcGroups'])
        },
        created () {
            this.lastEvents = {}
            this.currentComponentNode = LC.getActiveNode()
            const {
                material,
                renderEvents
            } = this.currentComponentNode
            this.config = Object.freeze(material.events || [])
            this.lastEvents = Object.assign({}, renderEvents)
        },
        methods: {
            handleChange (value, eventName) {
                const renderEvents = {
                    ...this.lastEvents,
                    [eventName]: value
                }
                this.lastEvents = renderEvents
                this.currentComponentNode.setRenderEvents(renderEvents)
            }
        }
    }
</script>

<style lang='postcss' scoped>
    .event-item {
        margin: 10px 10px 0;
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        .event-title {
            height: 32px;
            line-height: 32px;
            font-size: 14px;
            font-weight: normal;
            color: #63656E;
            word-break: keep-all;
            margin: 0;
            padding: 0;
            .label {
                border-bottom: 1px dashed #979ba5;
                cursor: pointer;
            }
        }
    }
    .event-tip {
        margin: 10px;
        padding: 0;
        font-size: 12px;
        font-weight: normal;
    }
</style>
