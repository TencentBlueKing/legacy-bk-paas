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
        <template v-if="Object.keys(materialConfig).length">
            <template v-for="(item, key) in materialConfig">
                <render-prop
                    :describe="item"
                    :last-value="lastProps[key]"
                    :name="key"
                    :key="key"
                    @on-change="handleChange" />
            </template>
        </template>
        <div class="no-prop" v-else>
            <span v-if="Object.keys(curSelectedComponentData).length">该组件暂无属性</span>
        </div>
    </div>
</template>
<script>
    import { mapGetters } from 'vuex'

    import RenderProp from './components/render-prop'

    export default {
        name: 'modifier-prop',
        components: {
            RenderProp
        },
        props: {
            materialConfig: {
                type: Object,
                required: true
            },
            lastProps: {
                type: Object,
                default: () => ({})
            }
        },
        computed: {
            ...mapGetters('drag', ['curSelectedComponentData'])
        },
        created () {
            this.renderProps = this.lastProps
        },
        methods: {
            handleChange (key, payload) {
                const renderProps = {
                    ...this.renderProps,
                    [key]: payload
                }
                this.renderProps = renderProps
                this.$emit('on-change', {
                    renderProps
                })
            }
        }
    }
</script>
