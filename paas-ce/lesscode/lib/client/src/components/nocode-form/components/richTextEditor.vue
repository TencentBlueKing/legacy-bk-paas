<template>
    <div class="rich-text-editor">
        <viewer v-if="preview || disabled" :initial-value="value"></viewer>
        <editor
            v-else
            ref="editor"
            initial-edit-type="wysiwyg"
            :options="{ autofocus: false }"
            :initial-value="value"
            @blur="onEditorChange">
        </editor>
    </div>
</template>
<script>
    import { Editor, Viewer } from '@toast-ui/vue-editor'
    import '@toast-ui/editor/dist/toastui-editor.css'

    export default {
        name: 'RichTextEditor',
        components: {
            Editor,
            Viewer
        },
        props: {
            preview: {
                type: Boolean,
                default: false
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
        watch: {
            value (val) {
                if (this.$refs.editor) {
                    this.$refs.editor.invoke('setHTML', val)
                }
            }
        },
        methods: {
            onEditorChange () {
                const value = this.$refs.editor.invoke('getHTML')
                this.$emit('change', value)
            }
        }
    }
</script>
