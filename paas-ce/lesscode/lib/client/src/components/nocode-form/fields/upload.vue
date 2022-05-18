<template>
    <div class="upload">
        <bk-upload
            name="field_file"
            :url="url"
            :disabled="disabled"
            :custom-request="customRequest"
            @on-delete="handleDelete">
        </bk-upload>
    </div>
</template>
<script>
    export default {
        name: 'Upload',
        props: {
            field: {
                type: Object,
                default: () => ({})
            },
            value: {
                type: Array,
                default: () => []
            },
            preview: {
                type: Boolean,
                default: false
            },
            disabled: {
                type: Boolean,
                default: false
            }
        },
        data () {
            return {
                url: this.preview ? '' : `${window.SITE_URL}api/misc/upload_file/`,
                files: [...this.value]
            }
        },
        watch: {
            value (val) {
                this.files = [...val]
            }
        },
        methods: {
            customRequest (fileData) {
                console.log(fileData)
                const data = new FormData()
                data.append('field_file', fileData.fileObj.origin)

                return this.$store.dispatch('common/uploadFile', data).then(res => {
                    Object.keys(res.data.succeed_files).forEach(key => {
                        this.files.push(res.data.succeed_files[key])
                        this.update()
                    })
                })
            },
            handleDelete (file, fileList) {
                this.files = fileList.slice(0)
                this.update()
            },
            update () {
                this.$emit('change', this.files)
            }
        }
    }
</script>
