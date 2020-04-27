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
        <div class="panel-title">选项卡面板配置：</div>
        <div class="panel-list">
            <div class="panel-item" v-for="(panel, index) in panelList" :key="index">
                <bk-input :value="panel.label" @change="val => handleSpanChange(index, val, 'label')" />
                <!-- <span class="panel-del" @click="handleDelete(index)">-</span> -->
                <i class="bk-icon icon-minus-circle" @click="handleDelete(index)"></i>
            </div>
            <div class="panel-add" @click="handleAdd"><i class="bk-icon icon-plus-circle"></i>添加选项</div>
        </div>
    </div>
</template>
<script>
    export default {
        name: '',
        props: {
            defaultValue: {
                type: Array,
                required: true
            },
            change: {
                type: Function,
                default: () => {}
            },
            type: String
        },
        data () {
            return {
                panelList: []
            }
        },
        created () {
            this.panelList = JSON.parse(JSON.stringify(this.defaultValue))
        },
        methods: {
            handleSpanChange (index, val, type) {
                this.panelList[index][type] = val
                this.trigger()
            },
            handleAdd () {
                const newItem = `Tab-${this.panelList.length + 1}`
                this.panelList.push({
                    name: newItem,
                    label: newItem
                })
                this.trigger()
            },
            handleDelete (index) {
                if (this.panelList.length === 1) {
                    return
                }
                this.panelList.splice(index, 1)
                this.trigger()
            },
            trigger () {
                this.change('slots', JSON.parse(JSON.stringify(this.panelList)), this.type)
            }
        }
    }
</script>
<style lang='postcss'>
    .panel-title {
        height: 32px;
        font-size: 14px;
        font-weight: 500;
        color: #606266;
    }
    .panel-list {
        display: flex;
        flex-direction: column;
    }
    .panel-item {
        display: flex;
        align-items: center;
        margin-bottom: 10px;
    }
    .panel-del {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 16px;
        height: 16px;
        margin-left: 6px;
        background: #ddd;
        border-radius: 50%;
        cursor: pointer;
    }
    .icon-minus-circle {
        margin: 0 3px;
        cursor: pointer;
    }
    .panel-add {
        font-size: 12px;
        cursor: pointer;
        &:hover {
            color: #3a84ff
        }
        i {
            padding-right: 2px;
            font-size: 16px;
        }
    }
</style>
