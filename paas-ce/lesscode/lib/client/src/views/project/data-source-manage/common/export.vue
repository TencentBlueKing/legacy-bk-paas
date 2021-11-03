<template>
    <section>
        <bk-button v-if="onlyExportAll" size="small" @click="showExport('select')">导出</bk-button>
        <bk-dropdown-menu ref="dropdownRef" v-else>
            <div class="dropdown-trigger-btn" slot="dropdown-trigger">
                <span>导出</span>
                <i :class="['bk-icon icon-angle-down']"></i>
            </div>
            <ul class="bk-dropdown-list" slot="dropdown-content">
                <li><a href="javascript:;" :class="{ disabled: disablePartialSelection }" @click="showExport('select')">导出选中数据</a></li>
                <li><a href="javascript:;" @click="showExport('all')">导出所有数据</a></li>
            </ul>
        </bk-dropdown-menu>

        <bk-dialog
            theme="primary"
            header-position="left"
            width="640"
            v-model="isShowExport"
            :title="title"
            :show-footer="false">
            <section class="export-home">
                <h3 class="export-title">请选择导出格式</h3>
                <p class="export-items">
                    <span @click="downLoad('csv')" class="export-item">
                        <i class="bk-drag-icon bk-drag-csv"></i>
                        CSV 文件
                    </span>
                    <span @click="downLoad('sql')" class="export-item">
                        <i class="bk-drag-icon bk-drag-sql"></i>
                        SQL 文件
                    </span>
                </p>
            </section>
        </bk-dialog>
    </section>
</template>

<script lang="ts">
    import { defineComponent, ref } from '@vue/composition-api'

    export default defineComponent({
        props: {
            title: {
                type: String
            },
            disablePartialSelection: {
                type: Boolean,
                default: false
            },
            onlyExportAll: {
                type: Boolean,
                default: false
            }
        },

        setup (props, { emit }) {
            const isShowExport = ref<boolean>(false)
            const isDropdownShow = ref<boolean>(false)
            const downLoadType = ref('all')
            const dropdownRef = ref(null)

            const dropdownHide = () => {
                dropdownRef.value?.hide()
            }

            const showExport = (type) => {
                if (type === 'select' && props.disablePartialSelection) return

                isShowExport.value = true
                downLoadType.value = type
                dropdownHide()
            }

            const downLoad = (type) => {
                emit('download', type, downLoadType.value)
            }

            return {
                isShowExport,
                isDropdownShow,
                dropdownRef,
                showExport,
                downLoad
            }
        }
    })
</script>

<style lang="postcss" scoped>
    .export-home {
        display: flex;
        flex-direction: column;
    }
    .export-title {
        line-height: 19px;
        margin: 0 0 16px;
        font-weight: normal;
        font-size: 14px;
        text-align: center;
    }
    .export-items {
        display: flex;
        justify-content: center;
        margin-bottom: 75px;
    }
    .export-item {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        width: 120px;
        height: 100px;
        border: 1px solid #dcdee5;
        border-radius: 4px;
        cursor: pointer;
        &:first-child {
            margin-right: 29px;
        }
        &:hover {
            background: #e1ecff;
            border: 1px solid #3a84ff;
            color: #3a84ff;
        }
        .bk-drag-icon {
            font-size: 32px;
            margin-bottom: 11px;
        }
    }
    .dropdown-trigger-btn {
        display: flex;
        align-items: center;
        justify-content: center;
        border: 1px solid #c4c6cc;
        height: 32px;
        border-radius: 2px;
        padding: 0 5px 0 14px;
        color: #63656E;
        font-size: 14px;
        background: #fff;
    }
    ::v-deep .bk-dropdown-content {
        left: auto !important;
        right: 0 !important;
    }
    .dropdown-trigger-btn.bk-icon {
        font-size: 18px;
    }
    .dropdown-trigger-btn .bk-icon {
        font-size: 22px;
    }
    .dropdown-trigger-btn:hover {
        cursor: pointer;
        border-color: #979ba5;
    }
    .bk-dropdown-list .disabled {
        cursor: not-allowed;
        color: #dcdee5;
        &:hover {
            color: #dcdee5;
        }
    }
</style>
