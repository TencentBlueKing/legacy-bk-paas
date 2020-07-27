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
        <ul v-if="eventKeys.length">
            <li v-for="event in eventKeys" :key="event.name" class="event-item">
                <h3 class="event-title">
                    <span class="label" v-if="event.tips" v-bk-tooltips="transformTipsWidth(event.tips)">{{ event.name }}</span>
                    <span v-else>{{ event.name }}</span>
                </h3>
                <bk-select class="event-choose" ref="eventChooseComp" :value="eventValues[event.name]" @clear="choose({ id: '' }, event.name)">
                    <bk-option-group
                        v-for="(group, index) in funcGroups"
                        :name="group.groupName"
                        :key="index">
                        <bk-option v-for="option in group.functionList.filter(x => x.funcType === 0)"
                            @click.native="choose(option, event.name)"
                            :key="option.id"
                            :id="option.id"
                            :name="option.funcName">
                        </bk-option>
                    </bk-option-group>
                    <div slot="extension" style="cursor: pointer;" @click="showMethodDialog">
                        <i class="bk-icon icon-plus-circle"></i>新增函数
                    </div>
                </bk-select>
            </li>
        </ul>
        <div class="no-event" v-else>
            <span v-if="Object.keys(curSelectedComponentData).length">该组件暂无事件</span>
        </div>
        <methods :show.sync="showMethod"></methods>
    </section>
</template>

<script>
    import { mapGetters, mapMutations } from 'vuex'
    import methods from '@/components/methods'
    import { transformTipsWidth } from '@/common/util'

    export default {
        name: 'modifier-events',
        components: {
            methods
        },
        props: {
            materialConfig: {
                type: Array,
                default: () => []
            },

            lastEvents: {
                type: Object,
                default: () => ({})
            },

            componentId: {
                type: String
            }
        },
        data () {
            return {
                showMethod: false,
                eventKeys: [],
                eventValues: [],
                transformTipsWidth
            }
        },
        computed: {
            ...mapGetters('drag', ['pageData', 'curSelectedComponentData']),
            ...mapGetters('functions', ['funcGroups'])
        },
        watch: {
            materialConfig: {
                handler () {
                    if (this.componentId) {
                        this.eventKeys = this.materialConfig
                        this.eventValues = this.lastEvents || {}
                    } else {
                        this.eventKeys = []
                        // this.eventKeys = Object.keys(this.pageData.lifeCycle) || []
                        this.eventValues = this.pageData.lifeCycle || {}
                    }
                    this.renderEvents = this.lastEvents
                },
                immediate: true
            }
        },
        methods: {
            ...mapMutations('drag', ['setPageData']),

            choose (option, event) {
                if (this.componentId) {
                    this.chooseComponentEvent(option, event)
                } else {
                    this.chooseLifeCycleEvent(option, event)
                }
            },

            chooseComponentEvent (option, event) {
                const renderEvents = {
                    ...this.renderEvents,
                    [event]: option.id
                }
                this.renderEvents = renderEvents
                this.$emit('on-change', { renderEvents })
            },

            chooseLifeCycleEvent (option, event) {
                const lifeCycle = {
                    ...this.pageData.lifeCycle,
                    [event]: option.id
                }
                this.setPageData({ lifeCycle })
            },

            showMethodDialog () {
                const eventChooseComp = this.$refs.eventChooseComp[0]
                if (eventChooseComp) {
                    eventChooseComp.close()
                }
                this.showMethod = true
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
        .event-choose {
            width: 100%;
        }
    }
</style>
