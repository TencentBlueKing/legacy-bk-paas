<template>
    <div class="bk-change-conductor">
        <template v-if="itemInfo.type === 'STRING'">
            <bk-input style="width: 260px;"
                v-model="itemInfo.value"
                v-cursorIndex="'conductorId' + index"
                placeholder="20个字符以内">
            </bk-input>
        </template>
        <template v-if="itemInfo.type === 'SELECT'">
            <bk-select style="width: 260px;"
                ext-cls="bk-insert-info"
                v-model="itemInfo.value"
                :clearable="false"
                searchable>
                <bk-option v-for="option in itemInfo.choice"
                    :key="option.key"
                    :id="option.key"
                    :name="option.name">
                </bk-option>
            </bk-select>
        </template>
        <template v-if="itemInfo.type === 'MULTISELECT'">
            <bk-select style="width: 260px;"
                ext-cls="bk-insert-info"
                v-model="itemInfo.value"
                :clearable="false"
                searchable
                multiple>
                <bk-option v-for="option in itemInfo.choice"
                    :key="option.key"
                    :id="option.key"
                    :name="option.name">
                </bk-option>
            </bk-select>
        </template>
        <template v-if="itemInfo.type === 'MEMBERS' || itemInfo.type === 'MULTI_MEMBERS'">
            <div class="bk-send-recipient"
                :class="{ 'bk-none-margin': itemInfo.value.length - 1 === recipientIndex }"
                v-for="(recipientItem, recipientIndex) in itemInfo.value"
                :key="recipientIndex">
                <member-info
                    :item-info="itemInfo"
                    :recipient-item="recipientItem"
                    :recipient-index="recipientIndex">
                </member-info>
            </div>
        </template>
        <template v-if="itemInfo.type === 'TEXT'">
            <bk-input
                v-cursorIndex="'conductorId' + index"
                v-model="itemInfo.value"
                type="textarea"
                :ext-cls="'bk-remindway-form'"
                :rows="6"
                @blur="changeMessagePanel">
            </bk-input>
        </template>
        <template v-if="itemInfo.type === 'RADIO'">
            <bk-radio-group v-model="itemInfo.value">
                <template v-for="(radioItem, radioIndex) in itemInfo.choice">
                    <bk-radio :value="radioItem.key" :ext-cls="'mr50'" :key="radioIndex">{{radioItem.name}}</bk-radio>
                </template>
            </bk-radio-group>
        </template>
        <template v-if="itemInfo.type === 'CHECKBOX'">
            <bk-checkbox-group v-model="itemInfo.value">
                <template v-for="(checkboxItem, checkboxIndex) in itemInfo.choice">
                    <bk-checkbox :value="checkboxItem.key" :ext-cls="'mr10'" :key="checkboxIndex">{{checkboxItem.name}}
                    </bk-checkbox>
                </template>
            </bk-checkbox-group>
        </template>
        <template v-if="itemInfo.type === 'INT'">
            <bk-input :clearable="true"
                :precision="precision"
                type="number"
                v-model="itemInfo.value">
            </bk-input>
        </template>
        <!-- 引用变量 -->
        <template v-if="itemInfo.type === 'STRING' || itemInfo.type === 'TEXT'">
            <div class="bk-select-btn">
                <bk-button
                    theme="default"
                    title="插入变量"
                    class="bk-form-btn plus-cus"
                    icon="plus">
                    插入变量
                </bk-button>
                <bk-select v-model="insertValue"
                    ext-cls="bk-select-btn-opacity"
                    searchable
                    @selected="changeInsert">
                    <bk-option v-for="option in variableList"
                        :key="option.key"
                        :id="option.key"
                        :name="option.name">
                    </bk-option>
                </bk-select>
            </div>
        </template>
        <!-- 下拉框引用变量 -->
        <template v-if="itemInfo.value === 'VARIABLE'">
            <bk-select style="width: 260px;"
                v-model="itemInfo.insertValue"
                ext-cls="bk-insert-info"
                searchable
                :multiple="Array.isArray(itemInfo.insertValue)"
                @selected="changeImport">
                <bk-option v-for="option in variableList"
                    :key="option.key"
                    :id="option.key"
                    :name="option.name">
                </bk-option>
            </bk-select>
        </template>
    </div>
</template>
<script>
    import memberInfo from './components/memberInfo.vue'
    import { mapState } from 'vuex'
    import insertText from '@/utils/insertText.js'

    export default {
        name: 'ChangeConductor',
        components: {
            memberInfo
        },
        directives: {
            cursorIndex: {
                bind (el, binding) {
                    const dom = el.querySelector('textarea,input')
                    if (dom) {
                        const handlerFocus = (e) => {
                            sessionStorage.removeItem('cursorIndex')
                        }
                        const handlerBlur = (e) => {
                            const recordJson = {
                                name: binding.value,
                                start: e.target.selectionStart,
                                end: e.target.selectionEnd
                            }
                            sessionStorage.setItem('cursorIndex', JSON.stringify(recordJson))
                        }
                        dom.addEventListener('focus', handlerFocus, false)
                        dom.addEventListener('blur', handlerBlur, false)
                    }
                }
            }
        },
        props: {
            itemInfo: {
                type: Object,
                default () {
                    return {}
                }
            },
            origin: {
                type: String,
                default: 'normal'
            },
            index: {
                type: Number
            }
        },
        data () {
            return {
                precision: 0,
                insertValue: '',
                variableList: []
            }
        },
        computed: {
            globalChoise () {
                return this.$store.state.common.configurInfo
            },
            ...mapState('setting', {
                triggerVariables: state => state.triggerVariables
            })
        },
        watch: {
            triggerVariables (newVal) {
                this.variableList = newVal
            }
        },
        created () {
            // 如果是单选或者多选的时候且可引用变量时，在choice添加引用变量的选项
            if ((this.itemInfo.type === 'SELECT' || this.itemInfo.type === 'MULTISELECT') && this.itemInfo.use_variable) {
                if (!this.itemInfo.choice.some(node => node.key === 'VARIABLE')) {
                    this.itemInfo.choice.push({
                        key: 'VARIABLE',
                        name: '引用变量'
                    })
                    const valueInfo = this.itemInfo.type === 'MULTISELECT' ? [] : ''
                    this.$set(this.itemInfo, 'insertValue', valueInfo)
                }
            }
            this.$set(this.itemInfo, 'referenceType', (this.itemInfo.referenceType || 'custom'))
            // 初始化默认值
            if (this.itemInfo.ref_type) {
                this.itemInfo.referenceType = this.itemInfo.ref_type
                if (this.itemInfo.ref_type === 'reference') {
                    if (this.itemInfo.type === 'SELECT' || this.itemInfo.type === 'MULTISELECT') {
                        this.itemInfo.insertValue = this.itemInfo.type === 'MULTISELECT' ? this.itemInfo.value.split(',') : this.itemInfo.value
                        this.itemInfo.value = 'VARIABLE'
                    }
                } else {
                    if (this.itemInfo.type === 'MULTISELECT') {
                        this.itemInfo.value = this.itemInfo.value ? this.itemInfo.value.split(',') : []
                    }
                }
            } else {
                if (this.itemInfo.type === 'MULTISELECT') {
                    this.itemInfo.value = this.itemInfo.value ? this.itemInfo.value.split(',') : []
                }
            }
        },
        mounted () {
            this.variableList = this.triggerVariables
        },
        methods: {
            changeInsert (value) {
                this.itemInfo.value = insertText(
                    this.$el.querySelector('.bk-form-textarea, .bk-form-input'),
                    `conductorId${this.index}`,
                    this.itemInfo.value,
                    `\${${value}}`,
                    this
                )
                this.itemInfo.referenceType = 'import'
                this.insertValue = ''
            },
            changeImport () {
                this.itemInfo.referenceType = 'reference'
            },
            changeMessagePanel (value, $event) {
                if (value && this.origin === 'message') {
                    this.$emit('change-panel-status')
                }
            }
        }
    }
</script>

<style lang='postcss' scoped>
@import "@/css/mixins/clearfix.css";
.bk-change-conductor {
  font-size: 12px;
  color: #63656E;
  @minix clearfix;
  /deep/ .bk-form-control{
    width: calc(100% - 130px)!important;
  }
}
.bk-remindway-form {
  float: left;
  width: 500px;
}
.bk-select-btn {
  position: relative;
  display: inline-block;
  margin-left: 10px;
  .bk-select-btn-opacity {
    position: absolute;
    top: 0;
    left: 0;
    width: 180px;
    opacity: 0;
  }
}
.bk-send-recipient {
  @include clearfix;
  margin-bottom: 10px;
}
.bk-none-margin {
  margin-bottom: 0px;
}
.bk-insert-info {
  float: left;
  margin-right: 14px;
}
</style>
