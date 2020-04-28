export default {
    name: 'x-script',
    type: 'x-script',
    displayName: 'x-script',
    events: ['selected', 'toggle', 'change', 'clear'],
    styles: ['size', 'padding', 'margin', 'font', 'backgroundColor'],
    props: {
        // input
        value: {
            type: 'string',
            val: 'hello world'
        },
        placeholder: {
            type: 'string'
        },
        disabled: {
            type: 'boolean',
            val: false
        },
        clearable: {
            type: 'boolean',
            val: true
        },
        'ext-cls': {
            type: 'string'
        },
        // button
        title: {
            type: 'string',
            val: 'hello world'
        },
        'button-theme': {
            type: 'string',
            options: ['default', 'primary', 'success', 'warning', 'danger', 'text']
        },
        /**
         * 以下 prop 在接入系统时必填，否则将使用前端数据
         * 接口地址需带域名，本地开发时，需配置跨域访问
         */
        // 获取业务列表接口地址
        'biz-list-ajax-url': {
            type: 'string',
            val: ''
        },
        // 获取指定业务下所有脚本的接口地址
        'script-list-ajax-url': {
            type: 'string',
            val: ''
        },
        // 执行脚本接口地址
        'execute-ajax-url': {
            type: 'string',
            val: ''
        },
        // 系统接口通用参数
        'system-info': {
            type: 'object',
            val: {}
        }
    }
}
