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
    <div style="width: 100%">
        <bk-select
            style="width: 100%"
            searchable
            :clearable="clearable"
            :value="value"
            @change="handleChange">
            <bk-option v-for="item in list" :id="item.icon" :name="item.icon" :key="item.icon">
                <i class="bk-icon" :class="item.name" />
                <span>{{ item.icon }}</span>
            </bk-option>
        </bk-select>
    </div>
</template>

<script>
    import iconComponentList from '@/element-materials/materials/icon-list.js'

    export default {
        name: 'icon-select',
        props: {
            defaultValue: {
                type: [String, Number],
                required: true
            },
            includeNumber: {
                type: Boolean,
                default: false
            },
            change: {
                type: Function,
                required: true
            },
            clearable: {
                type: Boolean,
                default: false
            }
        },
        data () {
            return {
                value: this.defaultValue,
                maxNum: 10,
                numList: []
            }
        },
        created () {
            if (this.includeNumber) {
                const numberList = this.addNumberList()
                this.list = iconComponentList.concat(numberList)
            } else {
                this.list = iconComponentList
            }
        },
        methods: {
            addNumberList () {
                const arr = []
                for (let i = 1; i <= this.maxNum; i++) {
                    arr.push({ icon: `${i}`, name: i })
                    this.numList.push(`${i}`)
                }
                return arr
            },
            handleChange (val) {
                if (val && this.numList.indexOf(val) !== -1) {
                    this.change(parseInt(val))
                } else {
                    this.change(val)
                }
            }
        }
    }
</script>
