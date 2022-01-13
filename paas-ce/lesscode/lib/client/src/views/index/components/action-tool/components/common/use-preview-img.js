import html2canvas from 'html2canvas'
import { ref } from '@vue/composition-api'
import { useStore } from '@/store'
import { useRoute } from '@/router'
import previewErrorImg from '@/images/preview-error.png'

export default () => {
    const store = useStore()
    const route = useRoute()

    const isLoading = ref(false)

    const submit = () => {
        isLoading.value = true
        return html2canvas(document.querySelector('#drawTarget'))
            .then(async (canvas) => {
                const imgData = canvas.toDataURL('image/png')
                return store.dispatch('page/update', {
                    data: {
                        projectId: route.params.projectId,
                        pageData: {
                            id: parseInt(route.params.pageId),
                            previewImg: imgData || previewErrorImg
                        }
                    }
                })
            })
            .finally(() => {
                isLoading.value = false
            })
    }
    return [
        isLoading,
        submit
    ]
}
