function getVal (val) {
    if (typeof val === 'object') val = JSON.stringify(val).replace(/"/g, '\'')
    return val
}

const renderMap = {
    'bk-checkbox' ({ val }) {
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
    },
    'bk-radio' ({ val }) {
        const displayVal = getVal(val)
        return `
            <bk-radio
                v-for="(item, index) in ${displayVal}"
                :label="item.label"
                :value="item.value"
                :checked="item.checked"
                style="margin-right: 20px"
            >{{item.label}}</bk-radio>
        `
    },
    'bk-radio-button' ({ val }) {
        const displayVal = getVal(val)
        return `
            <bk-radio-button
                v-for="(item, index) in ${displayVal}"
                :label="item.label"
                :value="item.value"
                :disabled="item.disabled"
            >{{item.label}}</bk-radio-button>
        `
    },
    'bk-option' ({ val }) {
        const displayVal = getVal(val)
        return `
            <bk-option
                v-for="(item, index) in ${displayVal}"
                :key="item.id"
                :id="item.id"
                :name="item.name"
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
                >
                    <template slot-scope="props">
                        <section v-html="item.templateCol"></section>
                    </template>
                </bk-table-column>
                <bk-table-column
                    v-else
                    :label="item.label"
                    :prop="item.prop"
                    :sortable="item.sortable"
                    :type="item.type"
                    :width="item.width"
                ></bk-table-column>
            </template>
        `
    },
    'html' ({ val, type }) {
        let res = ''
        switch (type) {
            case 'value':
                res = val
                break
            case 'variable':
                res = `<div v-html="${val}"></div>`
                break
        }
        return res
    },
    'text' ({ val, type }) {
        let res = ''
        switch (type) {
            case 'value':
                res = val
                break
            case 'variable':
                res = `{{${val}}}`
                break
        }
        return res
    },
    'el-radio' ({ val }) {
        const displayVal = getVal(val)
        return `
            <el-radio
                v-for="(item, index) in ${displayVal}"
                :key="item.value"
                :label="item.value"
            >{{item.label}}</el-radio>
        `
    },
    'el-checkbox' ({ val }) {
        const displayVal = getVal(val)
        return `
            <el-checkbox
                v-for="(item, index) in ${displayVal}"
                :key="item.value"
                :label="item.value"
            >{{item.label}}</el-checkbox>
        `
    },
    'el-option' ({ val }) {
        const displayVal = getVal(val)
        return `
            <el-option
                v-for="(item, index) in ${displayVal}"
                :key="item.id"
                :value="item.id"
                :label="item.name"
            ></el-option>
        `
    },
    'el-table-column' ({ val }) {
        const displayVal = getVal(val)
        return `
            <template v-for="(item, index) in ${displayVal}">
                <el-table-column
                    v-if="item.type === 'customCol'"
                    :label="item.label"
                    :prop="item.prop" 
                    :sortable="item.sortable"
                    :type="item.type"
                    :width="item.width"
                >
                    <template slot-scope="props">
                        <section v-html="item.templateCol"></section>
                    </template>
                </el-table-column>
                <el-table-column
                    v-else
                    :label="item.label"
                    :prop="item.prop"
                    :sortable="item.sortable"
                    :type="item.type"
                    :width="item.width"
                ></el-table-column>
            </template>
        `
    },
    'el-tab-pane' ({ val }) {
        const displayVal = getVal(val)
        return `
            <el-tab-pane
                v-for="(item, index) in ${displayVal}"
                :key="item.name"
                :label="item.label"
                :name="item.name"
            >{{item.label}}</el-tab-pane>
        `
    },
    'el-step' ({ val }) {
        const displayVal = getVal(val)
        return `
            <el-step
                v-for="(item, index) in ${displayVal}"
                :key="index"
                :title="item.title"
                :description="item.description"
                :icon="item.icon"
            ></el-step>
        `
    },
    'el-breadcrumb-item' ({ val }) {
        const displayVal = getVal(val)
        return `
            <el-breadcrumb-item
                v-for="(item, index) in ${displayVal}"
                :key="index"
                :to="item.to"
            >{{item.label}}</el-breadcrumb-item>
        `
    },
    'el-carousel-item' ({ val }) {
        const displayVal = getVal(val)
        return `
            <el-carousel-item
                v-for="(item, index) in ${displayVal}"
                :key="index"
                :name="item.name"
                :label="item.label"
            >
                <div v-html="item.content"></div>
            </el-carousel-item>
        `
    },
    'el-timeline-item' ({ val }) {
        const displayVal = getVal(val)
        return `
            <el-timeline-item
                v-for="(item, index) in ${displayVal}"
                :key="index"
                :timestamp="item.timestamp"
                :color="item.color"
                :label="item.label"
            >{{item.label}}</el-timeline-item>
        `
    }
}

export default renderMap
