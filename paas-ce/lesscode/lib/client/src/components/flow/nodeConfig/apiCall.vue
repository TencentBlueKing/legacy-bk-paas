<template>
    <div class="bk-api-call">
        <template v-for="(itemInfo, index) in item.wayInfo.field_schema">
            <bk-form-item :ext-cls="'bk-field-schema mb20'"
                :label="itemInfo.name"
                :required="itemInfo.required"
                :key="index"
                :desc="itemInfo.tips">
                <template v-if="itemInfo.key === 'api_source'">
                    <bk-select :ext-cls="'bk-form-display'"
                        v-model="itemInfo.systemId"
                        :clearable="false"
                        :placeholder="请选择接入系统"
                        searchable
                        @selected="changeCode(...arguments, itemInfo)">
                        <bk-option v-for="option in apiSysList"
                            :key="option.id"
                            :id="option.id"
                            :name="option.name">
                        </bk-option>
                    </bk-select>
                    <template v-if="itemInfo.systemId">
                        <bk-select :ext-cls="'bk-form-display'"
                            v-model="itemInfo.apiId"
                            :clearable="false"
                            searchable
                            @selected="changeApi(...arguments, itemInfo)">
                            <bk-option v-for="option in apiList"
                                :key="option.id"
                                :id="option.id"
                                :name="option.name">
                            </bk-option>
                        </bk-select>
                    </template>
                </template>
                <template v-if="itemInfo.type === 'API_INFO' && apiId">
                    <div style="min-height: 100px;" v-bkloading="{ isLoading: isLoading }">
                        <input-params v-if="!isLoading"
                            :item-info="itemInfo">
                        </input-params>
                    </div>
                </template>
            </bk-form-item>
        </template>
    </div>
</template>
<script>
    import inputParams from './inputParams.vue'

    export default {
        name: 'ApiCall',
        components: {
            inputParams
        },
        props: {
            item: {
                type: Object,
                default () {
                    return {}
                }
            }
        },
        data () {
            return {
                apiSysList: [],
                apiList: [],
                apiId: '',
                isLoading: false
            }
        },
        mounted () {
            this.getRemoteSystemData()
            this.initData()
        },
        methods: {
            initData () {
                this.item.wayInfo.field_schema.forEach((schema) => {
                    if (schema.key === 'api_source' && schema.value) {
                        this.getApiContent(schema.value)
                    }
                })
            },
            getRemoteSystemData () {
                const params = {}
                this.$store.dispatch('manage/getRemoteSystem', params).then((res) => {
                    this.apiSysList = res.data.filter(item => item.is_activated)
                })
                    .catch((res) => {
                        console.error(res)
                    })
                    .finally(() => {
                    })
            },
            changeCode () {
                this.getApiTableList(arguments[2].systemId)
                arguments[2].apiId = ''
                this.apiId = ''
            },
            getApiTableList (id) {
                const params = {
                    remote_system: id || ''
                }
                this.$store.dispatch('manage/getRemoteApi', params).then((res) => {
                    this.apiList = res.data.filter(ite => ite.is_activated)
                })
                    .catch((res) => {
                        console.error(res)
                    })
                    .finally(() => {

                    })
            },
            changeApi (value) {
                this.isLoading = true
                const apiContent = this.apiList.filter(item => item.id === arguments[0])[0]
                this.item.wayInfo.field_schema.forEach((item) => {
                    item.apiContent = apiContent
                    this.$set(item.apiContent, 'bodyTableData', [])
                })
                this.apiId = value
                setTimeout(() => {
                    this.isLoading = false
                }, 1000)
            },
            getApiContent (id) {
                this.isLoading = true
                const params = {
                    id
                }
                this.$store.dispatch('manage/getRemoteApiDetail', params).then((res) => {
                    const backValue = res.data
                    // 二次赋值渲染操作
                    this.item.wayInfo.field_schema.forEach((schema) => {
                        if (schema.key === 'api_source' && schema.value) {
                            schema.apiId = id
                            schema.systemId = backValue.remote_system
                        } else {
                            schema.apiContent = backValue
                            this.$set(schema.apiContent, 'bodyTableData', [])
                        }
                    })
                    this.getApiTableList(backValue.remote_system)
                    this.apiId = id
                })
                    .catch((res) => {
                        console.error(res)
                    })
                    .finally(() => {
                        setTimeout(() => {
                            this.isLoading = false
                        }, 1000)
                    })
            }
        }
    }
</script>

<style lang='postcss' scoped>
.bk-field-schema {
  padding: 0 18px;
}
.bk-form-display {
  float: left;
  width: 359px;
  margin-right: 10px;
  &:last-child{
    margin-right: 0;
  }
}
</style>
