<template>
    <bk-form :label-width="110" :model="form" ref="funcForm" :form-type="formType" class="func-form-item">
        <bk-form-item
            label="所属分类"
            property="funcGroupId"
            error-display-type="normal"
            :required="true"
            :rules="[requireRule('所属分类')]">
            <bk-select
                :value="form.funcGroupId"
                :popover-options="{ appendTo: 'parent' }"
                :disabled="disabled"
                :loading="isLoading"
                :clearable="false"
                @toggle="handleSetSelectList"
                @selected="handleSelectCategory"
            >
                <bk-option v-for="option in groupList"
                    :key="option.id"
                    :id="option.id"
                    :name="option.groupName">
                </bk-option>
            </bk-select>
        </bk-form-item>
    </bk-form>
</template>

<script>
    import { mapActions, mapGetters } from 'vuex'
    import mixins from './form-item-mixins'

    export default {
        mixins: [mixins],

        data () {
            return {
                groupList: [],
                isLoading: false
            }
        },

        computed: {
            ...mapGetters('projectVersion', ['currentVersionId'])
        },

        watch: {
            'form.projectId' (val) {
                if (val) {
                    this.handleSetSelectList(true)
                }
            }
        },

        created () {
            this.handleSetSelectList(true)
        },

        methods: {
            ...mapActions('functions', [
                'getGroupList'
            ]),

            handleSetSelectList (isExpand) {
                if (isExpand && this.form.projectId) {
                    this.isLoading = true
                    this.getGroupList({
                        projectId: this.form.projectId,
                        versionId: this.currentVersionId
                    }).then((groupList) => {
                        this.groupList = groupList || []
                    }).catch((err) => {
                        this.messageError(err.message || err)
                    }).finally(() => {
                        this.isLoading = false
                    })
                }
            },

            handleSelectCategory (funcGroupId) {
                this.updateValue({
                    funcGroupId
                })
            }
        }
    }
</script>
