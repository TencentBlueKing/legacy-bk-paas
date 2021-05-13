<template>
    <section>
        <template v-for="(item, index) in list">
            <span :key="index" class="variable-txt">{{item.txt}}：</span>
            <main :key="item.key" class="variable-code">
                <bk-input class="json-input"
                    placeholder="请输入默认值"
                    type="textarea"
                    v-model="copyValue[item.key]"
                    @input="getDisplayJson(item.key, ...arguments)"
                    @blur="formatterValue(item.key)"
                ></bk-input>
                <json-viewer :value="displayJSON[item.key]" :expand-depth="5" class="json-viewer" />
            </main>
        </template>
    </section>
</template>

<script>
    import mixins from './variable.mixin'
    import JsonViewer from 'vue-json-viewer'

    export default {
        components: {
            JsonViewer
        },

        mixins: [mixins],

        data () {
            return {
                displayJSON: {
                    all: '',
                    stag: '',
                    prod: ''
                },
                copyValue: {
                    all: '',
                    stag: '',
                    prod: ''
                }
            }
        },

        watch: {
            value: {
                handler (newVal, oldVar) {
                    if (JSON.stringify(newVal) !== JSON.stringify(oldVar)) this.initData()
                },
                immediate: true
            },

            list () {
                this.initData()
            }
        },

        methods: {
            initData () {
                this.list.forEach(({ key }) => {
                    this.getDisplayJson(key, this.value[key])
                });
                ['all', 'prod', 'stag'].forEach((key) => {
                    this.copyValue[key] = this.value[key]
                })
            },

            formatterValue (key) {
                try {
                    const formatterVal = JSON.stringify(JSON.parse(this.copyValue[key]), null, 2)
                    this.copyValue[key] = formatterVal
                    this.change(key, formatterVal)
                } catch (e) {
                    this.displayJSON[key] = this.getErrMessage() || e.message || '请输入正确格式的数据'
                }
            },

            getDisplayJson (key, val) {
                try {
                    const displayJson = JSON.parse(val)
                    const valType = Object.prototype.toString.apply(displayJson)
                    const isErrInput = (this.valueType === 3 && valType !== '[object Array]') || (this.valueType === 4 && valType !== '[object Object]')
                    if (isErrInput) throw new Error()
                    this.displayJSON[key] = displayJson
                    this.change(key, val)
                } catch (e) {
                    this.displayJSON[key] = this.getErrMessage() || e.message || '请输入正确格式的数据'
                }
            },

            getErrMessage () {
                const messageMap = {
                    3: '请输入 Array 格式数据',
                    4: '请输入 Json 格式数据'
                }
                return messageMap[this.valueType]
            }
        }
    }
</script>

<style lang="postcss" scoped>
    .variable-txt {
        display: inline-block;
        margin-top: 10px;
        font-size: 12px;
    }
    .variable-code {
        display: flex;
        flex-direction: row;
        align-items: stretch;
        height: 200px;
        .json-input, .json-viewer {
            flex: 1;
        }
        .json-input /deep/.bk-form-textarea {
            height: 200px;
        }
        .json-viewer {
            border: 1px solid #c4c6cc;
            border-left: none;
            height: 202px;
            width: 50%;
        }
        /deep/ .jv-code {
            overflow: auto;
            height: 202px;
        }
    }
</style>
