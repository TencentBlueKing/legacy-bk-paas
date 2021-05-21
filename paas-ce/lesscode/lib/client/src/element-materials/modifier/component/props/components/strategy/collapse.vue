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
        <h3 class="collapse-title">数据源配置</h3>
        <ul>
            <li v-for="(collapse, index) in collapseList" :key="index" class="collapse-item">
                <bk-input :value="collapse.name" @change="val => handleChange(val, 'name', index)" />
                <i class="bk-icon icon-minus-circle" @click="changeNum(false, index)"></i>
                <!-- <i class="bk-icon icon-plus" @click="changeNum(true, index)"></i> -->
            </li>
        </ul>
        <div class="collapse-add" @click="changeNum(true, collapseList.length - 1)"><i class="bk-icon icon-plus-circle"></i>添加一项</div>
    </section>
</template>

<script>
    export default {
        props: {
            defaultValue: {
                type: Array,
                required: true
            },
            change: {
                type: Function,
                default: () => {}
            }
        },

        data () {
            return {
                collapseList: []
            }
        },

        watch: {
            defaultValue: {
                handler () {
                    this.collapseList = JSON.parse(JSON.stringify(this.defaultValue))
                },
                immediate: true
            }
        },

        methods: {
            handleChange (value, key, index) {
                this.collapseList[index][key] = value
                this.trigger()
            },

            changeNum (isAdd, index) {
                const newItem = {
                    id: Math.random(),
                    name: ''
                }
                this.collapseList.splice(index + 1, 0, newItem)
                if (!isAdd) this.collapseList.splice(index, 2)
                this.trigger()
            },

            trigger () {
                this.change('children', JSON.parse(JSON.stringify(this.collapseList)))
            }
        }
    }
</script>

<style lang="postcss">
    .collapse-title {
        height: 32px;
        line-height: 32px;
        font-size: 14px;
        font-weight: 500;
        color: #606266;
        margin: 0;
    }

    .collapse-item {
        display: flex;
        align-items: center;
        margin: 5px 0 10px;
        .bk-icon {
            margin: 0 3px;
            cursor: pointer;
        }
    }

    .collapse-add {
        font-size: 12px;
        cursor: pointer;
        color: #3a84ff;
        i {
            padding-right: 2px;
            font-size: 16px;
        }
    }
</style>
