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
    <bk-form>
        <vue-draggable
            class="drag-area"
            style="min-height: 80px;"
            :sort="true"
            :list="renderSlots.val"
            :group="{ name: 'widget-form', pull: true, put: ['component'] }"
            :ghost-class="'ghost1'">
            <widget-form-item
                v-for="(formItem, index) in renderSlots.val"
                :key="index"
                :component-data="formItem" />
        </vue-draggable>
        <p>请拖入表单项</p>
    </bk-form>
</template>
<script>
    import cloneDeep from 'lodash.clonedeep'
    import { mapGetters, mapMutations } from 'vuex'
    import WidgetFormItem from './form-item'

    export default {
        name: '',
        components: {
            WidgetFormItem
        },
        props: {
            componentData: {
                type: Object,
                default: () => ({})
            }
        },
        data () {
            return {
                renderSlots: {
                    val: []
                }
            }
        },
        computed: {
            ...mapGetters('drag', [
                'targetData'
            ])
        },
        created () {
            this.renderData = {
                name: this.componentData.name,
                type: this.componentData.type,
                componentId: this.componentData.componentId,
                props: {
                    slots: {
                        type: 'form-item',
                        val: []
                    }
                }
            }

            this.init()
            this.renderSlots = this.renderData.props.slots
        },
        methods: {
            ...mapMutations('drag', [
                'setCurSelectedComponentData',
                'setTargetData'
            ]),
            init () {
                const targetData = cloneDeep(this.targetData)
                function findGrid (list, componentId) {
                    const len = list.length
                    for (let i = 0; i < len; i++) {
                        const item = list[i]
                        if (item.componentId === componentId) {
                            return item
                        }

                        if (item.children) {
                            return findGrid(item.children, componentId)
                        } else if (
                            item.renderProps.slots && item.renderProps.slots.type === 'column'
                        ) {
                            return findGrid(item.renderProps.slots.val, componentId)
                        }
                    }
                    return ''
                }
                const currentNode = findGrid(targetData, this.renderData.componentId)
                if (!currentNode) {
                    return
                }
                currentNode.renderProps = this.renderData.props
                this.setTargetData(targetData)
            }
        }
    }
</script>
<style lang='postcss'>

</style>
