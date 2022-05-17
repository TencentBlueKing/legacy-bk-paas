<template>
    <draw-layout
        class="lesscode-editor-page-content"
        v-bkloading="{ isLoading }">
        <left-panel slot="left" @move="fieldPanelHover = true" @end="fieldPanelHover = false" />
        <layout style="margin: 20px 0;height: 100%">
            <form-content
                :fields="fieldsList"
                @add="handleAddField"
                @select="handleSelectField"
                @copy="handleCopyField"
                @delete="handleDeleteField"
                @move="handleOrderField"
            />
        </layout>
        <right-panel slot="right" :field="crtField" :list="fieldsList" @update="handleUpdateField" />
    </draw-layout>

</template>

<script>
    import { mapGetters } from 'vuex'
    import cloneDeep from 'lodash.clonedeep'
    import DrawLayout from '@/views/index/components/draw-layout'
    import LeftPanel from './components/left-panel'
    import RightPanel from './components/right-panel'
    import Layout from '@/components/render/pc/widget/layout'
    import FormContent from './components/form-content'
    import { bus } from '@/common/bus'
    export default {
        components: {
            DrawLayout,
            LeftPanel,
            RightPanel,
            Layout,
            FormContent
        },
        data () {
            return {
                fieldsList: [],
                fieldPanelHover: false,
                isEdit: false, // 判断用户是否编辑
                crtIndex: -1, // 当前选中字段索引
                crtField: {} // 当前选中字段
            }
        },
        computed: {
            ...mapGetters('page', ['pageDetail']),
            formId () {
                return this.pageDetail.formId
            }
        },
        created () {
            this.getFieldList()
            bus.$on('restFieldList', () => {
                this.fieldsList = []
                this.crtField = {}
                this.crtIndex = -1
            })
        },
       
        beforeDestroy () {
            bus.$off('restFieldList')
        },
        methods: {
            // 添加字段
            handleAddField (field, index) {
                this.isEdit = true
                this.fieldsList.splice(index, 0, field)
                this.handleSelectField(field, index)
                this.saveFieldList()
            },
            async getFieldList () {
                try {
                    if (this.formId) {
                        this.isLoading = true
                        const form = await this.$store.dispatch('nocode/form/formDetail', { formId: this.formId })
                        console.log(form, 22666)
                        this.fieldsList = JSON.parse(form.content) || []
                    }
                } catch (err) {

                } finally {
                    this.isLoading = false
                }
            },
            // 复制字段
            handleCopyField (field, index) {
                this.isEdit = true
                this.fieldsList.splice(index + 1, 0, field)
                this.handleSelectField(field, index + 1)
                this.saveFieldList()
            },
            // 删除字段
            handleDeleteField (index) {
                this.isEdit = true
                this.fieldsList.splice(index, 1)
                this.crtField = {}
                if (this.crtIndex === index) {
                    this.crtIndex = -1
                }
                this.saveFieldList()
            },
            // 选中字段
            handleSelectField (field, index) {
                this.crtField = field
                this.crtIndex = index
            },
            // 拖拽字段顺序
            handleOrderField (newIndex, oldIndex) {
                this.isEdit = true
                const field = this.fieldsList.splice(oldIndex, 1)
                this.fieldsList.splice(newIndex, 0, field[0])
                this.crtIndex = newIndex
                this.crtField = cloneDeep(this.fieldsList[newIndex])
                this.saveFieldList()
            },
            // change () {
            //     this.$emit('change', cloneDeep(this.fieldsList))
            // },
            handleUpdateField (val) {
                this.isEdit = true
                this.crtField = val
                this.fieldsList.splice(this.crtIndex, 1, val)
                this.saveFieldList()
            },
            saveFieldList () {
                this.$store.commit('nocode/formSetting/setFieldsList', this.fieldsList)
            }
        }
    }
</script>
<style lang="postcss" >
.middle{
  display: none;
}
</style>
