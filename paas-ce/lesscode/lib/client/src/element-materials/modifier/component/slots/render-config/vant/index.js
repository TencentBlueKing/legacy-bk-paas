function getVal (val) {
    if (typeof val === 'object') val = JSON.stringify(val).replace(/'/g, '\\\'').replace(/"/g, '\'')
    return val
}

const vantRenderMap = {
    'van-checkbox' ({ val, from }) {
        const displayVal = getVal(val)
        return `
            <van-checkbox
                v-for="(item, index) in ${displayVal}"
                :key="index"
                :disabled="item.disabled"
                :shape="'square'"
                :name="item.value"
            >{{item.label}}</van-checkbox>
        `
    },
    'van-radio' ({ val, from }) {
        const displayVal = getVal(val)
        return `
            <van-radio
                v-for="(item, index) in ${displayVal}"
                :key="index"
                :name="item.value"
                :disabled="item.disabled"
            >{{item.label}}</van-radio>
        `
    }
}

export default vantRenderMap
