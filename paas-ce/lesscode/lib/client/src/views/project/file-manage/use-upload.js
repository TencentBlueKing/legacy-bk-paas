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

        // 图片缩略图处理
        if (isImage) {
            try {
                uploadFile.url = window.URL.createObjectURL(file)
            } catch (err) {
                console.error(err)
            }
            uploadFile.isPic = true
        }

        uploadFiles.value.unshift(uploadFile)
        props?.onChange?.(uploadFile, uploadFiles.value)
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

    return {
        abort,
        handleError,
        handleProgress,
        handleStart,
        handleSuccess,
        handleRemove,
        submit,
        uploadFiles
    }
}
