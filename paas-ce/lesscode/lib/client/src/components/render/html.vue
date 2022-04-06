<script>
    import Vue from 'vue'

    export default {
        props: {
            html: {
                type: String,
                default: ''
            },
            renderOptions: {
                type: Object,
                default: () => ({})
            },
            props: {
                type: Object,
                default: () => ({})
            },
            parentId: {
                type: Number
            }
        },

        data () {
            return {
                templateRender: undefined
            }
        },

        watch: {
            html: {
                handler () {
                    this.updateRender()
                },
                immediate: true
            },
            'renderOptions.methodCode': {
                handler () {
                    this.updateMethods()
                },
                immediate: true
            }
        },

        methods: {
            updateRender () {
                const compiled = Vue.compile(`<span>${this.html}</span>`)
                this.templateRender = compiled.render
                this.$options.staticRenderFns = []
                for (const staticRenderFunction of compiled.staticRenderFns) {
                    this.$options.staticRenderFns.push(staticRenderFunction)
                }
            },

            updateMethods () {
                (this.renderOptions.methodCode || []).forEach((method) => {
                    let parent = this.$parent
                    while (parent && parent._uid !== this.parentId) {
                        parent = parent.$parent
                    }
                    if (parent) {
                        this[method] = parent[method]
                    }
                })
            }
        },

        render () {
            return this.templateRender()
        }
    }
</script>
