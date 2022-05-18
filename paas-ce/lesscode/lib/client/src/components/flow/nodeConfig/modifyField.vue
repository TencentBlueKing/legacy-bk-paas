<template>
    <div class="modify-fields">
        <bk-form-item :ext-cls="'bk-field-schema'"
            :label="fieldKeyItem.name"
            :required="fieldKeyItem.required"
            :desc="fieldKeyItem.tips">
            <bk-select style="width: 270px;"
                ext-cls="bk-insert-info"
                v-model="fieldKeyItem.value"
                searchable
                @selected="selectedFieldKey">
                <bk-option
                    v-for="option in fieldKeyItem.choice"
                    :key="option.key"
                    :id="option.key"
                    :name="option.name">
                </bk-option>
            </bk-select>
        </bk-form-item>
        <template v-if="fieldKeyItem.value">
            <bk-form-item :ext-cls="'bk-field-schema'"
                :label="fieldValueItem.name"
                :required="fieldValueItem.required"
                :desc="fieldValueItem.tips">
                <!-- 设置自定义和引用变量数据 -->
                <div style="float: left; width: 268px;">
                    <bk-select v-model="fieldValueItem.referenceType"
                        :clearable="false"
                        searchable
                        @selected="selectedReference">
                        <bk-option v-for="option in sourceTypeList"
                            :key="option.key"
                            :id="option.key"
                            :name="option.name">
                        </bk-option>
                    </bk-select>
                </div>
                <div style="float: left; width: 268px; margin-left: 10px" v-if="fieldValueItem.referenceType === 'custom'">
                    <field-info :fields="fieldValueItem.itemInfo" :origin="'trigger'" v-if="show"></field-info>
                </div>
                <div style="float: left; width: 268px; margin-left: 10px" v-if="fieldValueItem.referenceType === 'reference'">
                    <bk-select style="width: 270px;"
                        v-model="fieldValueItem.itemInfo[0].value"
                        ext-cls="bk-insert-info"
                        searchable>
                        <bk-option v-for="option in variableList"
                            :key="option.key"
                            :id="option.key"
                            :name="option.name">
                        </bk-option>
                    </bk-select>
                </div>
            </bk-form-item>
        </template>
    </div>
</template>
<script>
    import fieldInfo from '../../../../workbench/components/fieldInfo.vue'
    import { mapState } from 'vuex'

    export default {
        name: 'ModifyFields',
        components: {
            fieldInfo
        },
        props: {
            fieldSchema: {
                type: Array,
                default () {
                    return []
                }
            }
        },
        data () {
            return {
                fieldKeyItem: '',
                fieldValueItem: '',
                fieldValue: '',
                show: true,
                sourceTypeList: [
                    {
                        id: 1,
                        key: 'custom',
                        name: '自定义'
                    },
                    {
                        id: 2,
                        key: 'reference',
                        name: '引用变量'
                    }
                ],
                variableList: []
            }
        },
        computed: {
            globalChoise () {
                return this.$store.state.setting.configurInfo
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
        mounted () {
            this.variableList = this.triggerVariables
            this.initData()
        },
        methods: {
            initData () {
                this.fieldSchema.forEach((item) => {
                    this.$set(item, 'referenceType', (item.ref_type || 'custom'))
                })
                this.fieldKeyItem = this.fieldSchema[0]
                this.fieldValueItem = this.fieldSchema[1]
                this.$set(this.fieldValueItem, 'itemInfo', [])
                if (this.fieldKeyItem.value) {
                    const tempItemInfo = this.fieldKeyItem.choice.filter(item => item.key === this.fieldKeyItem.value)
                    if (tempItemInfo.length > 0) {
                        tempItemInfo[0].value = tempItemInfo[0].val = this.fieldValueItem.value
                    }
                    this.fieldValueItem.itemInfo = tempItemInfo
                    this.show = true
                }
            },
            selectedFieldKey (key) {
                this.fieldValueItem.itemInfo.splice(0, this.fieldValueItem.itemInfo.length)
                this.show = false
                this.$nextTick(() => {
                    const temp = this.fieldKeyItem.choice.find(item => item.key === key)
                    temp.showFeild = true
                    this.fieldValueItem.itemInfo.push(temp)
                    this.show = true
                })
            },
            selectedReference () {
                this.fieldValueItem.itemInfo[0].value = ''
            }
        }
    }
</script>

<style lang='postcss' scoped>
.modify-fields{
  .bk-field-schema{
    padding: 0 18px;
  }
}
</style>
