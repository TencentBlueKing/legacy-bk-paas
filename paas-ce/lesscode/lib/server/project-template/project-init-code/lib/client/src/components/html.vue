<script>
    import Vue from 'vue'

    export default {
        props: {
            html: {
                type: String,
                default: ''
            },
            props: {
                type: Object,
                default: () => ({})
            }
        },

        data () {
            return {
                templateRender: undefined
            }
        },

        watch: {
            html () {
                this.updateRender()
            }
        },

        created () {
            this.updateRender()
        },

        methods: {
            updateRender () {
                const compiled = Vue.compile(this.html)
                this.templateRender = compiled.render
                this.$options.staticRenderFns = []
                for (const staticRenderFunction of compiled.staticRenderFns) {
                    this.$options.staticRenderFns.push(staticRenderFunction)
                }
            }
        },

        render () {
            return this.templateRender()
        }
    }
</script>
