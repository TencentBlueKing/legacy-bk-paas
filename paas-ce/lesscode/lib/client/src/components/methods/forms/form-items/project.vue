<template>
    <bk-form :label-width="110" :model="form" ref="funcForm" :form-type="formType" class="func-form-bottom">
        <bk-form-item
            :rules="[requireRule('应用')]"
            label="应用"
            property="projectId"
            error-display-type="normal"
            required>
            <bk-select
                :clearable="false"
                :loading="isLoading"
                :disabled="disabled"
                @toggle="handleToggleSelect"
                @selected="handleSelectProject">
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

            handleToggleSelect (isExpand) {
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

            handleSelectProject (projectId) {
                this.updateValue({
                    projectId,
                    funcGroupId: '',
                    funcGroupName: ''
                })
            }
        }
    }
</script>
