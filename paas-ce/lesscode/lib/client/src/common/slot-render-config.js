const renderMap = {
    'bk-checkbox' (val) {
        return `
            <bk-checkbox
                v-for="(item, index) in ${val}"
                :label="item.label"
                :value="item.value"
                :checked="item.checked"
                style="margin-right: 20px"
            >{{item.label}}</bk-checkbox>
        `
    }
}

export default renderMap
