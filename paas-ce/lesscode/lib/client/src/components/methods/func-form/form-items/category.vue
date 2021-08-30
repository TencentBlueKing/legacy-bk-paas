<template>
    <bk-form :label-width="110" :model="copyForm" ref="funcForm" :form-type="formType" class="func-form-item">
        <bk-form-item label="所属分类"
            :required="true"
            :rules="[requireRule('所属分类')]"
            property="funcGroupId"
            error-display-type="normal">
            <bk-select
                v-model="copyForm.funcGroupId"
                @selected="(val) => updateValue('funcGroupId', val)"
                :popover-options="{ appendTo: 'parent' }"
                :disabled="disabled">
                <bk-option v-for="option in funcGroups"
                    :key="option.id"
                    :id="option.id"
                    :name="option.groupName">
                </bk-option>
            </bk-select>
        </bk-form-item>
    </bk-form>
</template>

<script>
    import { mapGetters } from 'vuex'
    import mixins from './form-item-mixins'

    export default {
        mixins: [mixins],

        computed: {
            ...mapGetters('functions', ['funcGroups'])
        }
    }
</script>
