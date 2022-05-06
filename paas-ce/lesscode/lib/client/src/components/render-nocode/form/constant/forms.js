export const FIELDS_TYPES = [
    {
        type: 'STRING',
        name: '单行文本',
        default: '',
        comp: 'Input'
    },
    {
        type: 'TEXT',
        name: '多行文本',
        default: '',
        comp: 'Textarea'
    },
    {
        type: 'INT',
        name: '数字',
        default: 0,
        comp: 'Int'
    },
    {
        type: 'DATE',
        name: '日期',
        default: '',
        comp: 'Date'
    },
    {
        type: 'DATETIME',
        name: '时间',
        default: '',
        comp: 'Datetime'
    },
    {
        type: 'LINK',
        name: '链接',
        default: '',
        comp: 'Link'
    },
    {
        type: 'SELECT',
        name: '单选下拉框',
        default: '',
        comp: 'Select'
    },
    {
        type: 'INPUTSELECT',
        name: '可输入单选下拉框',
        default: '',
        comp: 'InputSelect'
    },
    {
        type: 'MULTISELECT',
        name: '多选下拉框',
        default: [],
        comp: 'MultiSelect'
    },
    {
        type: 'CHECKBOX',
        name: '复选框',
        default: [],
        comp: 'Checkbox'
    },
    {
        type: 'RADIO',
        name: '单选框',
        default: '',
        comp: 'Radio'
    },
    {
        type: 'MEMBER',
        name: '单选人员选择',
        default: [],
        comp: 'Member'
    },
    {
        type: 'MEMBERS',
        name: '多选人员选择',
        default: [],
        comp: 'Members'
    },
    {
        type: 'RICHTEXT',
        name: '富文本',
        default: '',
        comp: 'RichText'
    },
    {
        type: 'FILE',
        name: '附件上传',
        default: '',
        comp: 'Upload'
    },
    {
        type: 'TABLE',
        name: '表格',
        default: [],
        comp: 'Table'
    },
    // {
    //     type: 'IMAGE',
    //     name: '图片上传',
    //     default: '',
    //     comp: 'ImageFile'
    // },

    {
        type: 'DESC',
        name: '描述文本',
        default: '',
        comp: 'Description'
    },
    // {
    //     type: 'FORMULA',
    //     name: '计算控件',
    //     default: '',
    //     comp: 'Formula'
    // },
    {
        type: 'DIVIDER',
        name: '分割线',
        comp: 'Divider'
    }
]

// 表单字段类型映射
export const FIELDS_TYPES_MAPS = {
    STRING: '单行文本',
    TEXT: '多行文本',
    INT: '数字',
    DATE: '日期',
    DATETIME: '时间',
    TABLE: '表格',
    SELECT: '单选下拉框',
    INPUTSELECT: '可输入单选下拉框',
    MULTISELECT: '多选下拉框',
    CHECKBOX: '复选框',
    RADIO: '单选框',
    MEMBER: '单选人员选择',
    MEMBERS: '多选人员选择',
    RICHTEXT: '富文本',
    FILE: '附件上传',
    IMAGE: '图片上传',
    LINK: '链接',
    DESC: '描述文本',
    FORMULA: '计算控件',
    DIVIDER: '分割线'
}
