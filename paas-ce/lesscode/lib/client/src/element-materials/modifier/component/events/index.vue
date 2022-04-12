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
    <section v-if="configEvents.length">
        <h3 class="event-tip">可添加丰富的事件，以实现复杂的业务需求</h3>
        <ul>
            <render-event
                v-for="(eventValue, eventName) in renderEvents"
                :key="eventName"
                :event-name="eventName"
                :event-value="eventValue"
                :event-config="getEventConfig(eventName)"
                @update="handleUpdateEvent"
                @minus="handleMinusEvent"
            />
        </ul>
        <plus-event
            :config-events="configEvents"
            :render-events="renderEvents"
            @plus-event="handlePlusEvent"
        />
    </section>
</template>

<script>
    import LC from '@/element-materials/core'
    import PlusEvent from './children/plus-event.vue'
    import RenderEvent from './children/render-event.vue'

    export default {
        name: 'modifier-events',

        components: {
            PlusEvent,
            RenderEvent
        },
        
        data () {
            return {
                configEvents: [],
                renderEvents: {}
            }
        },

        created () {
            this.currentComponentNode = LC.getActiveNode()
            const {
                material,
                renderEvents
            } = this.currentComponentNode
            this.configEvents = Object.freeze(material.events || [])
            this.renderEvents = Object.assign({}, renderEvents)
        },

        methods: {
            getEventConfig (eventName) {
                return this.configEvents.find(configEvent => configEvent.name === eventName) || {}
            },

            handlePlusEvent (event) {
                this.renderEvents = {
                    ...this.renderEvents,
                    [event.name]: {
                        methodCode: '',
                        params: []
                    }
                }
                this.updateTargetData()
            },

            handleMinusEvent (eventName) {
                this.$delete(this.renderEvents, eventName)
                this.updateTargetData()
            },

            handleUpdateEvent (renderEvents) {
                this.renderEvents = {
                    ...this.renderEvents,
                    ...renderEvents
                }
                this.updateTargetData()
            },

            updateTargetData () {
                this.currentComponentNode.setRenderEvents(this.renderEvents)
            }
        }
    }
</script>

<style lang='postcss' scoped>
    .event-tip {
        margin: 10px;
        padding: 0;
        font-size: 12px;
        font-weight: normal;
    }
</style>
