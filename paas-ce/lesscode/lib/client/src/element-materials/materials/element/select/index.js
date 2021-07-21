/**
 * Tencent is pleased to support the open source community by making 蓝鲸智云PaaS平台社区版 (BlueKing PaaS Community Edition) available.
 * Copyright (C) 2017-2019 THL A29 Limited, a Tencent company. All rights reserved.
 * Licensed under the MIT License (the "License"); you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * http://opensource.org/licenses/MIT
 * Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on
 * an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the
 * specific language governing permissions and limitations under the License.
 */

export default {
    name: 'el-select',
    type: 'el-select',
    displayName: '下拉选框',
    icon: 'bk-drag-select',
    group: '表单',
    order: 1,
    events: [{
        name: 'selected', tips: '选择列表时调用，多选时，回调参数均为数组（value, option(s)）'
    }, {
        name: 'visible-change', tips: '下拉框出现/隐藏时触发，回调参数（出现则为 true，隐藏则为 false）'
    }, {
        name: 'change', tips: '选中值发生变化时触发，回调参数（目前的选中值）'
    }, {
        name: 'clear', tips: '可清空的单选模式下用户点击清空按钮时触发'
    }],
    styles: ['size', 'margin', 'padding', 'display', 'font', 'border', 'backgroundColor'],
    directives: [
        {
            type: 'v-model',
            prop: 'value',
            propTypes: ['string', 'boolean', 'number'],
            val: '',
            valType: 'variable'
        }
    ],
    props: {
        value: {
            type: ['string', 'number', 'boolean'],
            val: 'option1'
        },
        multiple: {
            type: 'boolean',
            val: false,
            tips: '是否多选'
        },
        disabled: {
            type: 'boolean',
            val: false,
            tips: '是否禁用'
        },
        size: {
            type: 'string',
            val: '',
            options: ['medium', 'small', 'mini'],
            tips: '输入框尺寸'
        },
        clearable: {
            type: 'boolean',
            val: false,
            tips: '是否允许清空'
        },
        placeholder: {
            type: 'string',
            val: '请选择',
            tips: '占位符'
        },
        loading: {
            type: 'boolean',
            val: false,
            tips: '是否正在从远程获取数据'
        },
        filterable: {
            type: 'boolean',
            val: false,
            tips: '是否可搜索'
        },
        'collapse-tags': {
            type: 'boolean',
            val: false,
            tips: '多选时是否将选中值按文字的形式展示'
        },
        autocomplete: {
            type: 'string',
            val: 'off',
            tips: 'select input 的 autocomplete 属性'
        },
        'popper-class': {
            type: 'string',
            val: '',
            tips: 'Select 下拉框的类名'
        },
        'popper-append-to-body': {
            type: 'boolean',
            val: true,
            tips: '对于不可搜索的 Select，是否在输入框获得焦点后自动弹出选项菜单'
        },
        slots: {
            name: 'el-option',
            type: ['option', 'remote'],
            remoteValidate (data) {
                if (!Array.isArray(data)) return '返回值需要是数组'
                const errData = data.find((item) => (!item.hasOwnProperty('id') || !item.hasOwnProperty('name')))
                if (errData) return '返回值每个元素需要含有id和name字段'
            },
            val: [
                { id: 'option1', name: '爬山' },
                { id: 'option2', name: '跑步' },
                { id: 'option3', name: '打球' },
                { id: 'option4', name: '跳舞' },
                { id: 'option5', name: '健身' },
                { id: 'option6', name: '骑车' }
            ],
            // 生成 slot 时，每个 slot 的属性值映射，例如 bk-option 里的 :id, :name, :key
            // <bk-option v-for="item in select19a32a0eSlot" :id="item.id" :name="item.name" :key="item.id"></bk-option>
            attrs: [
                { 'key': 'value', 'value': 'id' },
                { 'key': 'label', 'value': 'name' },
                { 'key': 'key', 'value': 'id' }
            ]
        }
    }
}
