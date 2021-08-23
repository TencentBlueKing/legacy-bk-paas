export default {
    props: {
        form: Object,
        formChanged: Boolean,
        formType: String,
        disabled: Boolean
    },

    data () {
        return {
            copyForm: {}
        }
    },

    watch: {
        form: {
            handler () {
                if (JSON.stringify(this.form) !== JSON.stringify(this.copyForm)) {
                    this.copyForm = JSON.parse(JSON.stringify(this.form))
                }
            },
            deep: true,
            immediate: true
        }
    },

    methods: {
        updateValue (key, value) {
            const copyVaule = JSON.parse(JSON.stringify(this.form))
            copyVaule[key] = value
            this.$parent.formChanged = true
            this.$emit('update:form', copyVaule)
        },

        requireRule (name) {
            return {
                required: true,
                message: `${name}是必填项，请修改后重试`,
                trigger: 'blur'
            }
        },

        validate () {
            return new Promise((resolve, reject) => {
                this.$refs.funcForm.validate().then(() => {
                    resolve()
                }, (validator) => {
                    reject(validator)
                })
            })
        },

        clearError () {
            this.$refs.funcForm.clearError()
        }
    }
}
