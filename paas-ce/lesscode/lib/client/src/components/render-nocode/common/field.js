export const RICHTEXT_FIELD = {
    api_instance_id: null,
    choice: [],
    default: '',
    desc: '',
    is_readonly: false,
    key: 'FU_WEN_BEN',
    kv_relation: Object,
    layout: 'COL_12',
    mandatory_conditions: Object,
    meta: {},
    name: '富文本',
    regex: 'EMPTY',
    show_conditions: {},
    show_type: 0,
    source_type: 'CUSTOM',
    type: 'RICHTEXT',
    unique: false,
    validate_type: 'OPTION'
}

export const SYS_FIELD = [{ id: 'create_at', key: 'create_at', name: '创建时间', type: 'DATETIME' },
    { id: 'creator', key: 'creator', name: '提交人', type: 'MEMBER' },
    { id: 'update_at', key: 'update_at', name: '更新时间', type: 'DATETIME' },
    { id: 'updated_by', key: 'updated_by', name: '更新人', type: 'MEMBER' }]
