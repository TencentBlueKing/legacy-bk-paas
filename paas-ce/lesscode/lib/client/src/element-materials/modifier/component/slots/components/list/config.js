export default {
    'bk-radio': {
        template: [
            {
                name: 'label',
                key: 'label',
                type: 'input'
            }, {
                name: 'value',
                key: 'value',
                type: 'input'
            }, {
                name: '默认选中',
                key: 'checked',
                type: 'radio'
            }
        ],
        generateFunc: index => ({
            label: `单选项${index}`,
            value: `单选项${index}`,
            checked: false
        })
    },
    'el-radio': {
        template: [
            {
                name: 'label',
                key: 'label',
                type: 'input'
            }
        ],
        generateFunc: index => ({
            label: `单选项${index}`
        })
    },
    'bk-checkbox': {
        template: [
            {
                name: 'label',
                key: 'label',
                type: 'input'
            }, {
                name: 'value',
                key: 'value',
                type: 'input'
            }, {
                name: '默认选中',
                key: 'checked',
                type: 'checkbox'
            }
        ],
        generateFunc: index => ({
            label: `选项${index}`,
            value: `选项${index}`,
            checked: false
        })
    },
    'el-checkbox': {
        template: [
            {
                name: 'label',
                key: 'label',
                type: 'input'
            }
        ],
        generateFunc: index => ({
            label: `选项${index}`
        })
    },
    'bk-bread-crumb': {
        template: [
            {
                name: 'label',
                key: 'label',
                type: 'input'
            }, {
                name: 'to',
                key: 'to',
                type: 'input'
            }
        ],
        generateFunc: index => ({
            label: `面包屑${index}`,
            to: null
        })
    },
    'bk-step': {
        template: [
            {
                name: 'title',
                key: 'title',
                type: 'input'
            }, {
                name: 'icon',
                key: 'icon',
                type: 'icon'
            }, {
                name: '步骤描述',
                key: 'description',
                type: 'input'
            }
        ],
        generateFunc: index => ({
            title: `步骤${index}`,
            icon: index,
            description: ''
        })
    },
    'el-step': {
        template: [
            {
                name: 'title',
                key: 'title',
                type: 'input'
            }, {
                name: 'icon',
                key: 'icon',
                type: 'input'
            }, {
                name: '步骤描述',
                key: 'description',
                type: 'input'
            }
        ],
        generateFunc: index => ({
            title: `步骤${index}`,
            icon: '',
            description: ''
        })
    },
    'bk-option': {
        template: [
            {
                name: '选项id',
                key: 'id',
                type: 'input'
            }, {
                name: '选项name',
                key: 'name',
                type: 'input'
            }
        ],
        generateFunc: index => ({
            id: `option${index}`,
            'name': ''
        })
    },
    'bk-tab-panel': {
        template: [
            {
                name: 'label',
                key: 'label',
                type: 'input'
            }, {
                name: 'name',
                key: 'name',
                type: 'input'
            }
        ],
        generateFunc: index => ({
            label: `Tab-${index}`,
            'name': `Tab-${index}`
        })
    },
    'bk-timeline': {
        template: [
            {
                name: '内容',
                key: 'label',
                type: 'input'
            }, {
                name: '时间戳',
                key: 'timestamp',
                type: 'input'
            },
            {
                name: 'color',
                key: 'color',
                type: 'input'
            }
        ],
        generateFunc: index => ({
            label: `Timeline-${index}`,
            timestamp: '2021-06-29',
            color: ''
        })
    },
    'carousel': {
        template: [
            {
                name: '文本label',
                key: 'label',
                type: 'input'
            }, {
                name: '名字name',
                key: 'name',
                type: 'input'
            }, {
                name: '内容content',
                key: 'content',
                type: 'input'
            }
        ],
        generateFunc: index => ({
            label: `carousel-${index}`,
            'name': `carousel-${index}`,
            content: `<h3>carousel-${index}</h3>`
        })
    }
}
