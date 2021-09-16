export default {
    computed: {
        exportFields () {
            return this.columns.map(({ id, name }) => ({ id, name }))
        },
        tableDynamicHeader () {
            return this.columns.filter(item => item.dynamic)
        }
    },
    methods: {
        setFetching () {
            this.tableDynamicHeader.forEach(item => this.$set(this.fetching, item.id, false))
        },
        getColumnDefaultValue (column) {
            if (column.default) {
                return column.default
            }
            const defaults = { number: 0 }
            return defaults[column.type] !== undefined ? defaults[column.type] : ''
        },
        getDynamicValues () {
            const values = {}
            this.tableDynamicHeader.forEach(item => (values[item.id] = this.getColumnDefaultValue(item)))
            return values
        },
        handleSortChange ({ column, prop, order }) {
            const sort = ({ descending: '-', ascending: '' })[order]
            this.orderBy = sort !== undefined ? `${sort}${prop}` : undefined
            this.fetchData()
        }
    }
}
