function getVal (val) {
    if (typeof val === 'object') val = JSON.stringify(val).replace(/'/g, "\\'").replace(/"/g, '\'')
    return val
}

const elementRenderMap = {
    'el-radio' ({ val }) {
        const displayVal = getVal(val)
        return `
            <el-radio
                v-for="item in ${displayVal}"
                :key="item.value"
                :label="item.value"
            >{{item.label}}</el-radio>
        `
    },
    'el-checkbox' ({ val }) {
        const displayVal = getVal(val)
        return `
            <el-checkbox
                v-for="item in ${displayVal}"
                :key="item.value"
                :label="item.value"
            >{{item.label}}</el-checkbox>
        `
    },
    'el-option' ({ val }) {
        const displayVal = getVal(val)
        return `
            <el-option
                v-for="item in ${displayVal}"
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
                    :key="index"
                >
                    <template slot-scope="props">
                        <render-html
                            :html="item.templateCol"
                            :render-options="item"
                            :props="props"
                            :parent-id="_uid"
                        ></render-html>
                    </template>
                </el-table-column>
                <el-table-column
                    v-else
                    :label="item.label"
                    :prop="item.prop"
                    :sortable="item.sortable"
                    :type="item.type"
                    :width="item.width"
                    :key="index"
                ></el-table-column>
            </template>
        `
    },
    'el-tab-pane' ({ val }) {
        const displayVal = getVal(val)
        return `
            <el-tab-pane
                v-for="item in ${displayVal}"
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

export default elementRenderMap
