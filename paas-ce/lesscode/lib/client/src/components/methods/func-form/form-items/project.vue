<template>
    <bk-form :label-width="84" :model="copyForm" ref="funcForm" :form-type="formType" class="func-form-bottom">
        <bk-form-item
            :rules="[requireRule('项目')]"
            label="项目"
            property="projectId"
            error-display-type="normal"
            required>
            <bk-select @toggle="getProjectList" @selected="changeMarketFunc" :clearable="false" :loading="isLoading">
                <bk-option v-for="option in projectList"
                    :key="option.id"
                    :id="option.id"
                    :name="option.projectName">
                </bk-option>
            </bk-select>
        </bk-form-item>
    </bk-form>
</template>

<script>
    import mixins from './form-item-mixins'
    import { mapActions } from 'vuex'

    export default {
        mixins: [mixins],

        data () {
            return {
                projectList: [],
                isLoading: false
            }
        },

        methods: {
            ...mapActions('project', ['query']),
            ...mapActions('functions', ['getAllGroupFuncs']),

            getProjectList (isExpand) {
                if (isExpand) {
                    this.isLoading = true
                    this.query({}).then((res = {}) => {
                        this.projectList = res.projectList || []
                    }).catch((err) => {
                        this.messageError(err.message || err)
                    }).finally(() => {
                        this.isLoading = false
                    })
                }
            },

            changeMarketFunc (id) {
                this.updateValue('projectId', id)
                this.getAllGroupFuncs(id).then((res = []) => {
                    const firstGroup = res[0] || {}
                    this.updateValue('funcGroupId', firstGroup.id)
                }).catch((err) => {
                    this.messageError(err.message || err)
                })
            }
        }
    }
</script>
