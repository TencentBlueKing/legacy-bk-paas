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
    <li class="event-item">
        <h3 class="event-title">
            <span
                class="label"
                v-bk-tooltips="{
                    content: eventConfig.tips,
                    disabled: !eventConfig.tips,
                    placements: ['left-start'],
                    width: 200,
                    boundary: 'window'
                }"
            >
                {{ eventName }}
            </span>
        </h3>
        <choose-function
            :value="eventValue"
            :config="eventConfig"
            @choose="handleChooseFunction"
        />
        <div class="panel-item" v-for="(panel, index) in eventValue.params" :key="index">
            <bk-input :value="panel.value" @change="val => handleChangeParam(index, val)" />
            <i class="bk-icon icon-minus-circle" @click="handleDeleteParam(index)"></i>
        </div>
        <div class="panel-add" @click="handlePlusParam">
            <i class="bk-icon icon-plus-circle"></i>添加函数执行参数
        </div>
        <i class="bk-icon icon-close-line panel-minus" @click="handleDeleteEvent"></i>
    </li>
</template>

<script>
    import ChooseFunction from './choose-function.vue'

    export default {
        name: 'render-event',

        components: {
            ChooseFunction
        },

        props: {
            eventName: String,
            eventValue: Object,
            eventConfig: Object
        },

        methods: {
            handleChooseFunction (functionData) {
                const eventValue = JSON.parse(JSON.stringify(this.eventValue))
                eventValue.methodCode = functionData.funcCode
                this.updateEvent(eventValue)
            },

            handleChangeParam (index, val) {
                const eventValue = JSON.parse(JSON.stringify(this.eventValue))
                eventValue.params[index].value = val
                this.updateEvent(eventValue)
            },

            handleDeleteParam (index) {
                const eventValue = JSON.parse(JSON.stringify(this.eventValue))
                eventValue.params.splice(index, 1)
                this.updateEvent(eventValue)
            },

            handlePlusParam () {
                const eventValue = JSON.parse(JSON.stringify(this.eventValue))
                eventValue.params.push({ value: '' })
                this.updateEvent(eventValue)
            },

            handleDeleteEvent () {
                this.$emit('minus', this.eventName)
            },

            updateEvent (eventValue) {
                this.$emit('update', {
                    [this.eventName]: eventValue
                })
            }
        }
    }
</script>

<style lang='postcss' scoped>
    .event-item {
        position: relative;
        background: #f0f1f5;
        border-radius: 2px;
        margin: 16px 10px 0;
        padding: 8px;
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        .event-title {
            margin: 4px 0 8px;
            height: 16px;
            line-height: 16px;
            font-size: 14px;
            font-weight: normal;
            color: #63656E;
            word-break: keep-all;
            padding: 0;
            .label {
                border-bottom: 1px dashed #979ba5;
                cursor: pointer;
            }
        }
        &:hover {
            box-shadow: 0px 2px 4px 0px rgb(0 0 0 / 20%);
            .panel-minus {
                display: block;
            }
        }
    }
    .panel-item {
        display: flex;
        align-items: center;
        margin-top: 10px;
        width: 100%;
    }
    .icon-minus-circle {
        margin: 0 3px;
        cursor: pointer;
    }
    .panel-add {
        font-size: 12px;
        margin: 10px 0 0;
        line-height: 16px;
        cursor: pointer;
        &:hover {
            color: #3a84ff;
        }
        i {
            padding-right: 2px;
            font-size: 16px;
        }
    }
    .panel-minus {
        position: absolute;
        cursor: pointer;
        right: 10px;
        top: 10px;
        font-size: 12px;
        display: none;
    }
</style>
