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
            this.getProjectBase()
        },
        handlePageLimitChange (limit) {
            this.pagination.limit = limit
            this.pagination.current = 1
            this.getProjectBase()
        },
        handleKeywordClear () {
            this.pagination.current = 1
            this.getProjectBase()
        },
        handleKeywordEnter () {
            this.pagination.current = 1
            this.getProjectBase()
        }
    }
}
