<template>
    <section class="edit-object" :style="styleVar">
        <bk-input class="json-input"
            type="textarea"
            v-model="copyValue"
            @input="getDisplayJson"
            @blur="formatterValue"
        ></bk-input>
        <json-viewer :value="displayJSON" :expand-depth="5" class="json-viewer" />
    </section>
</template>

<script>
    import JsonViewer from 'vue-json-viewer'

    export default {
        components: {
            JsonViewer
        },

        props: {
            value: String,
            height: {
                type: Number,
                default: 200
            }
        },

        data () {
            return {
                displayJSON: '',
                copyValue: ''
            }
        },

        computed: {
            styleVar () {
                return {
                    '--json-height': this.height + 'px',
                    '--view-height': this.height + 2 + 'px'
                }
            }
        },

        watch: {
            value: {
                handler (newVal, oldVar) {
                    if (newVal !== oldVar) this.initData()
                },
                immediate: true
            }
        },

        methods: {
            initData () {
                this.getDisplayJson(this.value)
                this.copyValue = this.value
            },

            formatterValue () {
                try {
                    const formatterVal = JSON.stringify(JSON.parse(this.copyValue), null, 2)
                    this.copyValue = formatterVal
                    this.$emit('update:value', formatterVal)
                } catch (e) {
                    this.displayJSON = '请输入正确格式的数据'
                }
            },

            getDisplayJson (val) {
                try {
                    this.displayJSON = JSON.parse(val)
                    this.$emit('update:value', val)
                } catch (e) {
                    this.displayJSON = '请输入正确格式的数据'
                }
            }
        }
    }
</script>

<style lang="postcss" scoped>
    .edit-object {
        display: flex;
        flex-direction: row;
        align-items: stretch;
        height: var(--json-height);
        .json-input, .json-viewer {
            flex: 1;
        }
        .json-input /deep/.bk-form-textarea {
            height: var(--json-height);
        }
        .json-viewer {
            border: 1px solid #c4c6cc;
            border-left: none;
            height: var(--view-height);
            width: 50%;
        }
        /deep/ .jv-code {
            overflow: auto;
            height: var(--view-height);
        }
    }
</style>
