const vantListMap = {
    'van-checkbox': {
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
                name: '是否禁用',
                key: 'disabled',
                type: 'checkbox'
            }
        ],
        generateFunc: index => ({
            label: `选项${index}`,
            value: `选项${index}`,
            disabled: false
        })
    },
    'van-radio': {
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
                name: '是否禁用',
                key: 'disabled',
                type: 'checkbox'
            }
        ],
        generateFunc: index => ({
            label: `单选项${index}`,
            value: `单选项${index}`,
            disabled: false
        })
    },
    'van-step': {
        template: [
            {
                name: 'text',
                key: 'text',
                type: 'input'
            }
        ],
        generateFunc: index => ({
            text: `步骤${index}`
        })
    },
    'van-tab': {
        template: [
            {
                name: 'title',
                key: 'title',
                type: 'input'
            },
            {
                name: 'name',
                key: 'name',
                type: 'input'
            },
            {
                name: '点击后跳转的链接地址',
                key: 'url',
                type: 'input'
            },
            {
                name: '点击后跳转的目标路由对象，同 vue-router 的 to 属性',
                key: 'to',
                type: 'input'
            },
            {
                name: '是否禁用',
                key: 'disabled',
                type: 'checkbox'
            },
            {
                name: '是否在标题右上角显示小红点',
                key: 'dot',
                type: 'checkbox'
            }
        ],
        generateFunc: index => ({
            label: `选项${index}`,
            value: `选项${index}`,
            disabled: false
        })
    }
}

export default vantListMap
