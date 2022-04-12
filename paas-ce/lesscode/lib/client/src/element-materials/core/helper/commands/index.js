import * as copyPaste from './copy-paste'
import { clearLayout } from './clear-layout'
import { remove } from './remove'

const registerMap = {
    clearLayout,
    remove
}

Object.keys(copyPaste).forEach(command => {
    registerMap[command] = copyPaste[command]
})

export const execCommand = (command, param1) => {
    if (!registerMap.hasOwnProperty(command)) {
        console.error(`执行的操作命令不存在 *** ${command} ***`)
        return
    }
    return registerMap[command](param1)
}
