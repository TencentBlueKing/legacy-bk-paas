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
    }
}

export default vantListMap
