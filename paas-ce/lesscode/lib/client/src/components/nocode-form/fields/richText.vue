<template>
    <div class="rich-text">
        <rich-text-editor :value="val" :disabled="disabled" @change="change"></rich-text-editor>
    </div>
</template>
<script>
    import RichTextEditor from '../components/richTextEditor.vue'
    export default {
        name: 'RichText',
        components: {
            RichTextEditor
        },
        props: {
            field: {
                type: Object,
                default: () => ({})
            },
            value: {
                type: String,
                default: ''
            },
            disabled: {
                type: Boolean,
                default: false
            }
        },
        data () {
            return {
                val: this.value
            }
        },
        watch: {
            value (val) {
                this.val = val
            }
        },
        methods: {
            change (val) {
                this.$emit('change', val)
            }
        }
    }
</script>
