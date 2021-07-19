function getVal (val) {
    if (typeof val === 'object') val = JSON.stringify(val).replace(/"/g, '\'')
    return val
}

const renderMap = {
    'bk-checkbox' (val) {
        const displayVal = getVal(val)
        return `
            <bk-checkbox
                v-for="(item, index) in ${displayVal}"
                :label="item.label"
                :value="item.value"
                :checked="item.checked"
                :class= "item.checked ? 'is-checked' : ''"
                style="margin-right: 20px"
            >{{item.label}}</bk-checkbox>
        `
    }
}

export default renderMap
