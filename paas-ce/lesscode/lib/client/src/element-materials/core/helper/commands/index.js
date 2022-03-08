import { clearLayout } from './clear-layout'
import { remove } from './remove'

const registerMap = {
    clearLayout,
    remove
}

export const execCommand = (command) => {
    if (!registerMap.hasOwnProperty(command)) {
        console.error(`执行的操作命令不存在 *** ${command} ***`)
        return
    }
    return registerMap[command]()
}
