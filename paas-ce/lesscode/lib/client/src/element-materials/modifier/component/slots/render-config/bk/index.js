function getVal (val) {
    if (typeof val === 'object') val = JSON.stringify(val).replace(/'/g, '\\\'').replace(/"/g, '\'')
    return val
}

const bkRenderMap = {
    'bk-checkbox' ({ val, from }) {
        const displayVal = getVal(val)
        return `
            <bk-checkbox
                v-for="(item, index) in ${displayVal}"
                :key="index"
                :value="item.value"
                ${from !== 'canvas' ? '' : ':class="item.checked ? \'is-checked\' : \'\'"'}
                style="margin-right: 20px"
            >{{item.label}}</bk-checkbox>
        `
    },
    'bk-radio' ({ val, from }) {
        const displayVal = getVal(val)
        return `
            <bk-radio
                v-for="(item, index) in ${displayVal}"
                :key="index"
                :label="item.label"
                :value="item.value"
                ${from !== 'canvas' ? '' : ':checked="item.checked"'}
                style="margin-right: 20px"
            >{{item.label}}</bk-radio>
        `
    },
    'bk-radio-button' ({ val }) {
        const displayVal = getVal(val)
        return `
            <bk-radio-button
                v-for="(item, index) in ${displayVal}"
                :key="index"
                :label="item.label"
                :value="item.value"
                :disabled="item.disabled"
            >{{item.label}}</bk-radio-button>
        `
    },
    'bk-option' ({ val, payload }) {
        const displayVal = getVal(val)
        const params = payload?.sourceData?.params
        const idKey = params?.idKey || 'id'
        const nameKey = params?.nameKey || 'name'
        return `
            <bk-option
                v-for="item in ${displayVal}"
                :key="item.${idKey}"
                :id="item.${idKey}"
                :name="item.${nameKey}"
            ></bk-option>
        `
    },
    'bk-tab-panel' ({ val }) {
        const displayVal = getVal(val)
        return `
            <bk-tab-panel
                v-for="(item, index) in ${displayVal}"
                :key="index"
                v-bind="item"
            ></bk-tab-panel>
        `
    },
    'bk-breadcrumb-item' ({ val }) {
        const displayVal = getVal(val)
        return `
            <bk-breadcrumb-item
                v-for="(item, index) in ${displayVal}"
                :key="index"
                :to="item.to"
            >{{item.label}}</bk-breadcrumb-item>
        `
    },
    'bk-table-column' ({ val }) {
        const displayVal = getVal(val)
        return `
            <template v-for="(item, index) in ${displayVal}">
                <bk-table-column
                    v-if="item.type === 'customCol'"
                    :label="item.label"
                    :prop="item.prop"
                    :sortable="item.sortable"
                    :type="item.type"
                    :width="item.width"
                    :key="item.templateCol"
                >
                    <template slot-scope="props">
                        <render-html
                            :html="item.templateCol"
                            :render-options="item"
                            :props="props"
                            :parent-id="_uid"
                        ></render-html>
                    </template>
                </bk-table-column>
                <bk-table-column
                    v-else
                    :label="item.label"
                    :prop="item.prop"
                    :sortable="item.sortable"
                    :type="item.type"
                    :width="item.width"
                    :key="index"
                ></bk-table-column>
            </template>
        `
    }
}

export default bkRenderMap
