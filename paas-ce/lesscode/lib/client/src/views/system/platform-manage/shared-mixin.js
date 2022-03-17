export default {
    filters: {
        formatCount (value) {
            const count = Number(value)
            if (isNaN(count)) {
                return '--'
            }
            return count.toLocaleString()
        }
    },
    computed: {},
    data () {},
    methods: {
        handlePageChange (page) {
            this.pagination.current = page
            this.fetchData()
        },
        handlePageLimitChange (limit) {
            this.pagination.limit = limit
            this.pagination.current = 1
            this.fetchData()
        },
        handleKeywordClear () {
            this.pagination.current = 1
            this.fetchData()
        },
        handleKeywordEnter () {
            this.pagination.current = 1
            this.fetchData()
        }
    }
}
