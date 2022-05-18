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
    },
    'van-step' ({ val }) {
        const displayVal = getVal(val)
        return `
            <van-step
                v-for="(item,index) in ${displayVal}"
                :key="index"
            >
            {{item.text}}</van-step>    
        `
    },
    'van-tab' ({ val }) {
        const displayVal = getVal(val)
        return `
            <van-tab
                v-for="(item, index) in ${displayVal}"
                :key="index"
                :name="item.name"
                :title="item.title"
                :dot="item.dot"
                :url="item.url"
                :to="item.to">
            
            </van-tab>
        `
    }
}

export default vantRenderMap
