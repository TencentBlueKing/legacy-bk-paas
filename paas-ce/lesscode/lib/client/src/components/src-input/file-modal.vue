<script>
    import { computed, defineComponent, onBeforeUnmount, reactive, ref } from '@vue/composition-api'
    import { useStore } from '@/store'
    import { useRoute } from '@/router'
    import { messageError, messageSuccess } from '@/common/bkmagic'

    import useUploadHandler from '@/components/filelib/use-upload-handler.js'
    import useUploadList from '@/components/filelib/use-upload-list.js'

    import Upload from '@/components/filelib/upload.vue'
    import ListCard from '@/components/filelib/list-card.vue'

    export default defineComponent({
        components: {
            ListCard,
            Upload
        },
        props: {
            isShow: {
                type: Boolean,
                default: false
            }
        },
        setup (props, { emit }) {
            const store = useStore()
            const route = useRoute()

            const uploadRef = ref(null)

            const projectId = computed(() => route.params.projectId)
            const paramsData = computed(() => ({ projectId: projectId.value }))

            const {
                keyword,
                list,
                loading: listLoading,
                displayList,
                handleSearch
            } = useUploadList({ projectId: projectId.value })

            const baseUploadProps = reactive({
                fileList: displayList,
                maxImageSize: 5,
                maxFileSize: 10,
                beforeRemove: async (file) => {
                    if (!file.id) {
                        return
                    }

                    try {
                        await store.dispatch('file/del', { ...paramsData.value, fileId: file.id })
                        messageSuccess('删除成功')
                    } catch (err) {
                        messageError('删除失败')
                        console.error(err)
                        return false
                    }
                },
                onSuccess: async (res) => {
                    const data = {
                        ...paramsData.value,
                        fileData: {
                            ...res.data,
                            status: 'success'
                        }
                    }
                    try {
                        await store.dispatch('file/create', data)
                    } catch (err) {
                        messageError('保存上传文件失败')
                        console.error(err)
                    }
                }
            })

            const {
                uploadFiles,
                handleStart,
                handleError,
                handleSuccess,
                handleProgress,
                handleRemove
            } = useUploadHandler(baseUploadProps, uploadRef)

            const uploadProps = computed(() => ({
                params: paramsData.value,
                maxImageSize: baseUploadProps.maxImageSize,
                maxFileSize: baseUploadProps.maxFileSize,
                onStart: handleStart,
                onProgress: handleProgress,
                onSuccess: handleSuccess,
                onError: handleError
            }))

            onBeforeUnmount(() => {
                uploadFiles.value.forEach(({ url }) => {
                    if (url?.startsWith('blob:')) URL.revokeObjectURL(url)
                })
            })

            const handleSelect = (file) => {
                emit('select', file)
            }
            const handleView = (file) => {
                emit('')
                console.log(file)
            }

            const handleCancel = () => {
                show.value = false
            }

            const show = computed({
                get () {
                    return props.isShow
                },
                set (val) {
                    emit('update:isShow', val)
                }
            })

            return {
                show,
                keyword,
                list,
                listLoading,
                uploadRef,
                uploadProps,
                uploadFiles,
                displayList,
                handleSearch,
                handleRemove,
                handleSelect,
                handleView,
                handleCancel
            }
        }
    })
</script>

<template>
    <bk-dialog v-model="show"
        :class="'filelib-dialog'"
        :render-directive="'if'"
        :width="980"
        :mask-close="false"
        header-position="left"
        title="文件库">
        <div :class="$style['modal-container']">
            <div :class="$style['modal-head']">
                <div :class="$style['buttons']">
                    <upload ref="uploadRef" v-bind="uploadProps" />
                </div>
                <div :class="$style['search-bar']">
                    <span :class="$style['total']" v-show="displayList.length">共<em :class="$style['count']">{{displayList.length}}</em>个文件</span>
                    <bk-input placeholder="请输入文件名"
                        style="width: 360px"
                        :clearable="true"
                        right-icon="bk-icon icon-search"
                        v-model="keyword"
                        @input="handleSearch">
                    </bk-input>
                </div>
            </div>
            <div :class="$style['modal-body']">
                <list-card class="model-list-card" :files="uploadFiles" @remove="handleRemove" :card-height="166" :card-width="218">
                    <template #use-action="file">
                        <div :class="$style['use-action-inner']">
                            <bk-button :class="$style['action-button']" theme="primary" @click="handleSelect(file)">使用</bk-button>
                            <bk-button :class="$style['action-button']" @click="handleView(file)">查看</bk-button>
                        </div>
                    </template>
                </list-card>
            </div>
            <div :class="$style['modal-foot']"></div>
        </div>
        <template #footer>
            <div :class="$style['modal-foot']">
                <bk-button @click="handleCancel">取消</bk-button>
            </div>
        </template>
    </bk-dialog>
</template>

<style lang="postcss" module>
    @import "@/css/mixins/scroller";

    .modal-container {
        .modal-head {
            display: flex;
            align-items: center;
            justify-content: space-between;
            height: 52px;

            .search-bar {
                display: flex;
                align-items: center;

                .total {
                    font-size: 12px;
                    margin-right: 8px;
                    .count {
                        font-style: normal;
                        margin: 0 .1em;
                    }
                }
            }
        }
        .modal-body {
            height: 45vh;
            overflow-y: auto;
            @mixin scroller;
        }
    }

    .use-action-inner {
        .action-button {
            margin: 0 4px;
        }
    }

    .list-card.model-list-card {
        .card-item {
            color: bleed;
        }
    }
</style>

<style lang="postcss" scoped>
    .filelib-dialog {
        ::v-deep .bk-dialog-header {
            padding-bottom: 8px;
        }
    }

    .model-list-card {
        ::v-deep {
            .card-item {
                &:nth-child(4n) {
                    margin-right: 0;
                }
            }
        }
    }
</style>
