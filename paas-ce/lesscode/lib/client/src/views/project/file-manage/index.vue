<!--
  Tencent is pleased to support the open source community by making 蓝鲸智云PaaS平台社区版 (BlueKing PaaS Community Edition) available.
  Copyright (C) 2017-2019 THL A29 Limited, a Tencent company. All rights reserved.
  Licensed under the MIT License (the "License"); you may not use this file except in compliance with the License.
  You may obtain a copy of the License at
  http://opensource.org/licenses/MIT
  Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on
  an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the
  specific language governing permissions and limitations under the License.
-->

<script lang="ts">
    import { computed, defineComponent, onBeforeUnmount, reactive, ref, watchEffect } from '@vue/composition-api'
    import { useStore } from '@/store'
    import { useRoute } from '@/router'
    import { messageError, messageSuccess } from '@/common/bkmagic'

    import useUpload from './use-upload.js'
    import { DISPLAY_TYPES } from './helper'

    import Upload from './children/upload.vue'
    import ListCard from './children/list-card.vue'
    import ListTable from './children/list-table.vue'

    export default defineComponent({
        components: {
            ListCard,
            ListTable,
            Upload
        },
        setup () {
            const store = useStore()
            const route = useRoute()

            const uploadRef = ref(null)

            const keyword = ref('')
            const displayType = ref<string>(DISPLAY_TYPES.CARD)
            const loading = reactive({
                list: false
            })

            const list = ref([])
            const displayList = ref([])

            const projectId = computed(() => route.params.projectId)
            const paramsData = computed(() => ({ projectId: projectId.value }))

            const listComponent = computed(() => {
                const compMap = {
                    [DISPLAY_TYPES.CARD]: ListCard,
                    [DISPLAY_TYPES.LIST]: ListTable
                }
                return compMap[displayType.value]
            })

            const handleUploadSuccess = async (res) => {
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
                }
            })

            const {
                uploadFiles,
                handleStart,
                handleError,
                handleSuccess,
                handleProgress,
                handleRemove
            } = useUpload(baseUploadProps, uploadRef)

            const uploadProps = computed(() => ({
                params: paramsData.value,
                maxImageSize: baseUploadProps.maxImageSize,
                maxFileSize: baseUploadProps.maxFileSize,
                onStart: handleStart,
                onProgress: handleProgress,
                onSuccess: handleSuccess,
                onError: handleError
            }))

            watchEffect(async () => {
                loading.list = true
                try {
                    const data = await store.dispatch('file/getList', paramsData.value)
                    list.value = displayList.value = data?.list
                } catch (e) {
                    console.error(e)
                } finally {
                    loading.list = false
                }
            })

            const handleSearch = (clear = false) => {
                if (clear) {
                    keyword.value = ''
                    displayList.value = list.value
                } else {
                    displayList.value = list.value.filter(item => new RegExp(keyword.value, 'i').test(item.name))
                }
            }
            const handleToggleDisplayType = (type: string) => {
                displayType.value = type
            }

            onBeforeUnmount(() => {
                uploadFiles.value.forEach(({ url }) => {
                    if (url?.startsWith('blob:')) URL.revokeObjectURL(url)
                })
            })

            return {
                keyword,
                loading,
                list,
                uploadRef,
                uploadProps,
                displayType,
                uploadFiles,
                displayList,
                DISPLAY_TYPES,
                listComponent,
                handleSearch,
                handleToggleDisplayType,
                handleRemove,
                handleUploadSuccess
            }
        }
    })
</script>

<template>
    <div class="page-content">
        <div class="page-head file-manage-head">
            <div class="buttons">
                <upload ref="uploadRef" v-bind="uploadProps" @success="handleUploadSuccess" />
            </div>
            <div class="search-bar">
                <span class="total" v-show="displayList.length">共<em class="count">{{displayList.length}}</em>个文件</span>
                <bk-input placeholder="请输入文件名"
                    style="width: 400px"
                    :clearable="true"
                    right-icon="bk-icon icon-search"
                    v-model="keyword"
                    @clear="handleSearch(true)"
                    @enter="handleSearch(false)">
                </bk-input>
                <div class="display-type-toggle">
                    <div class="icon-button" @click="handleToggleDisplayType(DISPLAY_TYPES.CARD)">
                        <img src="@/images/svg/icon-card.svg" width="14px" alt="">
                    </div>
                    <div class="icon-button" @click="handleToggleDisplayType(DISPLAY_TYPES.LIST)">
                        <img src="@/images/svg/icon-column.svg" width="14px" alt="">
                    </div>
                </div>
            </div>
        </div>
        <div class="page-body file-manage-body" v-bkloading="{ isLoading: loading.list }">
            <component :is="listComponent" :files="uploadFiles" @remove="handleRemove"></component>
        </div>
    </div>
</template>

<style lang="postcss" scoped>
    .file-manage-head {
        justify-content: space-between;

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

        .display-type-toggle {
            display: flex;
            align-items: center;
            height: 32px;
            padding: 0 4px;
            margin-left: 8px;
            background: #eaebf0;
            border-radius: 2px;
            .icon-button {
                display: flex;
                align-items: center;
                justify-content: center;
                width: 24px;
                height: 24px;
                cursor: pointer;

                &:hover {
                    background: #fff;
                }

                & + .icon-button {
                    margin-left: 8px;
                }
            }
        }
    }
</style>
