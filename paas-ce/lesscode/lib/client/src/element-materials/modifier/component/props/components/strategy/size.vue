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
        <size-input :value="sizeValue" @change="handleInputChange">
            <append-select :value="sizeUnit" @change="handleSelectChange"></append-select>
        </size-input>
    </section>
</template>

<script>
    import AppendSelect from '@/components/modifier/append-select'
    import SizeInput from '@/components/modifier/size-input'
    import { splitValueAndUnit } from '@/common/util'

    export default {
        components: {
            AppendSelect,
            SizeInput
        },
        props: {
            defaultValue: {
                type: [String, Number],
                required: true
            },
            name: {
                type: String,
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
                sizeValue: splitValueAndUnit('value', this.defaultValue),
                sizeUnit: splitValueAndUnit('unit', this.defaultValue) || 'px'
            }
        },
        methods: {
            handleInputChange (val) {
                this.change(this.name, val + this.sizeUnit, this.type)
            },
            handleSelectChange (unit) {
                this.change(this.name, this.sizeValue + unit, this.type)
            }
        }
    }
</script>
