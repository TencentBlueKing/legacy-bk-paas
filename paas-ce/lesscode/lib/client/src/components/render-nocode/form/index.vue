<template>
    <draw-layout
        class="lesscode-editor-page-content">
        <left-panel slot="left" @move="fieldPanelHover = true" @end="fieldPanelHover = false" />
        <layout style="margin: 20px 0">
            <form-content
                :fields="fieldsList"
                @add="handleAddField"
                @select="handleSelectField"
                @copy="handleCopyField"
                @delete="handleDeleteField"
                @move="handleOrderField"
            />
        </layout>
        <right-panel slot="right" :field="crtField" :list="fieldsList" />
    </draw-layout>

</template>

<script>
    import cloneDeep from 'lodash.clonedeep'
    import DrawLayout from '@/views/index/components/draw-layout'
    import LeftPanel from './components/left-panel'
    import RightPanel from './components/right-panel'
    import Layout from '@/components/render/pc/widget/layout'
    import FormContent from './components/form-content'
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
        methods: {
            // 添加字段
            handleAddField (field, index) {
                this.isEdit = true
                this.fieldsList.splice(index, 0, field)
                this.handleSelectField(field, index)
                this.change()
            },
            // 复制字段
            handleCopyField (field, index) {
                this.isEdit = true
                this.fieldsList.splice(index + 1, 0, field)
                this.handleSelectField(field, index + 1)
                this.change()
            },
            // 删除字段
            handleDeleteField (index) {
                this.isEdit = true
                this.fieldsList.splice(index, 1)
                this.crtField = {}
                if (this.crtIndex === index) {
                    this.crtIndex = -1
                }
                this.change()
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
                this.change()
            },
            change () {
                this.$emit('change', cloneDeep(this.fieldsList))
            }

        }
    }
</script>
