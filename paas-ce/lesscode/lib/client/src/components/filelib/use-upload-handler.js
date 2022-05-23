/**
 * Tencent is pleased to support the open source community by making 蓝鲸智云PaaS平台社区版 (BlueKing PaaS Community Edition) available.
 * Copyright (C) 2017-2019 THL A29 Limited, a Tencent company. All rights reserved.
 * Licensed under the MIT License (the "License"); you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * http://opensource.org/licenses/MIT
 * Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on
 * an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the
 * specific language governing permissions and limitations under the License.
 */

import { computed, ref, watch } from '@vue/composition-api'
import { useStore } from '@/store'

let fileId = 1
export const genFileId = () => Date.now() + fileId++

const revokeObjectURL = (file) => {
    if (file.url?.startsWith('blob:')) {
        URL.revokeObjectURL(file.url)
    }
}

export default (props, uploadRef) => {
    const store = useStore()

    const userName = computed(() => store.getters['user']?.username)

    const uploadFiles = ref([])

    const isUploading = ref(false)

    const getFile = (rawFile) => uploadFiles.value.find((file) => file.uid === rawFile.uid)

    function abort (file) {
        uploadRef.value?.abort(file)
    }

    const handleError = (err, rawFile) => {
        const file = getFile(rawFile)
        if (!file) return

        file.status = 'fail'
        props?.onError?.(err, file, uploadFiles.value)
        props?.onChange?.(file, uploadFiles.value)
    }

    const handleProgress = (event, rawFile) => {
        const file = getFile(rawFile)
        if (!file) return

        props?.onProgress?.(event, file, uploadFiles.value)
        file.status = 'uploading'
        file.percentage = Math.round(event.percent)
    }

    const handleSuccess = (response, rawFile) => {
        const file = getFile(rawFile)
        if (!file) return

        file.status = 'success'
        file.response = response
        props?.onSuccess?.(response, file, uploadFiles.value)
        props?.onChange?.(file, uploadFiles.value)
    }

    const handleStart = (file) => {
        const uploadFile = {
            name: file.name,
            percentage: 0,
            status: 'ready',
            size: file.size,
            raw: file,
            uid: file.uid
        }

        const isImage = file.type.startsWith('image/')

        let error = null

        // 图片缩略图处理
        if (isImage) {
            try {
                uploadFile.url = window.URL.createObjectURL(file)
            } catch (err) {
                console.error(err)
            }
            uploadFile.isPic = true
        }

        if (isImage && file.size > (props.maxImageSize * 1024 ** 2)) {
            uploadFile.status = 'fail'
            uploadFile.statusText = '超过限制大小'
            error = new Error(uploadFile.statusText)
        }

        if (!isImage && file.size > (props.maxFileSize * 1024 ** 2)) {
            uploadFile.status = 'fail'
            uploadFile.statusText = '超过限制大小'
            error = new Error(uploadFile.statusText)
        }

        uploadFiles.value.unshift(uploadFile)
        props?.onChange?.(uploadFile, uploadFiles.value)

        return error
    }

    const handleRemove = async (file) => {
        const uploadFile = getFile(file)
        if (!uploadFile) {
            throw new Error('file not found')
        }

        const remove = (file) => {
            abort(file)
            const fileList = uploadFiles.value
            fileList.splice(fileList.indexOf(file), 1)
            props?.onRemove?.(file, fileList)
            revokeObjectURL(file)
        }

        if (props.beforeRemove) {
            const before = await props?.beforeRemove?.(uploadFile, uploadFiles.value)
            if (before !== false) remove(uploadFile)
        } else {
            remove(uploadFile)
        }
    }

    function submit () {
        uploadFiles.value
            .filter(({ status }) => status === 'ready')
            .forEach(({ raw }) => raw && uploadRef.value?.sendFile(raw))
    }

    watch(
        () => props.fileList,
        (fileList) => {
            for (const file of fileList) {
                file.uid = file.uid || genFileId()
                file.status = file.status || 'success'
                file.createUser = file.createUser || userName.value
                file.createTime = file.createTime || new Date(Date.now())
            }
            uploadFiles.value = fileList
        },
        { immediate: true, deep: true }
    )

    watch(uploadFiles, (files) => {
        isUploading.value = files.some(file => file?.status === 'uploading')
    }, { deep: true })

    return {
        abort,
        handleError,
        handleProgress,
        handleStart,
        handleSuccess,
        handleRemove,
        submit,
        uploadFiles,
        isUploading
    }
}
