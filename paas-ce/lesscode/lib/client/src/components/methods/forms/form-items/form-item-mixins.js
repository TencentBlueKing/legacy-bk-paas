export default {
    props: {
        form: Object,
        formType: String,
        disabled: Boolean
    },

    methods: {
        updateValue (values) {
            if (Reflect.has(this.$parent, 'formChanged')) {
                this.$parent.formChanged = true
            } else {
                this.$parent.$parent.formChanged = true
            }
            const updateForm = {
                ...this.form,
                ...values
            }
            this.$emit('update:form', updateForm)
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
                if (!this.$refs.funcForm) {
                    resolve()
                } else {
                    this.$refs.funcForm.validate().then(() => {
                        resolve()
                    }, (validator) => {
                        reject(validator)
                    })
                }
            })
        },

        clearError () {
            this.$refs.funcForm && this.$refs.funcForm.clearError()
        }
    }
}
