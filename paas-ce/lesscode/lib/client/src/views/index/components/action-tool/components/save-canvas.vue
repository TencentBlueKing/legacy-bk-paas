<template>
    <menu-item
        v-bkloading="{ isLoading }"
        :item="item"
        :class="{
            disabled: isLocked
        }" />
</template>
<script>
    import {
        ref,
        onBeforeUnmount
    } from '@vue/composition-api'
    import MenuItem from './menu-item'
    import useSave from './common/use-save'
    import usePreviewImg from './common/use-preview-img'
    import useCanvaseLock from './common/use-canvas-lock'

    export default {
        components: {
            MenuItem
        },
        
        setup () {
            const [isLoading, handleSave] = useSave()
            const [, handleUpdatePreiviewImg] = usePreviewImg()
            const {
                check: canvasLockCheck,
                notify: canvasLockNotify,
                update: canvaseLockUpdate,
                relase: canvasLockRelase
            } = useCanvaseLock()

            const isLocked = ref(true)

            // 检测页面的可编辑状态
            canvasLockCheck()
                .then(data => {
                    if (data.isLock) {
                        isLocked.value = true
                        canvasLockNotify({
                            type: 'lock',
                            ...data
                        })
                    } else {
                        isLocked.value = false
                        canvaseLockUpdate()
                    }
                })
            /**
             * @desc 保存页面
             *
             * 保存页面数据，更新页面预览图
             */
            const handleSubmit = async () => {
                if (isLocked.value) {
                    return
                }
                await handleSave()
                await handleUpdatePreiviewImg()
            }

            // 组件卸载释放页面的编辑权
            onBeforeUnmount(() => {
                canvasLockRelase()
            })
            
            return {
                isLoading,
                isLocked,
                item: {
                    icon: 'bk-drag-icon bk-drag-save',
                    text: '保存',
                    func: handleSubmit
                }
            }
        }
    }
</script>
