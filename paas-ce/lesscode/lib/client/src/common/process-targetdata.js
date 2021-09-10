// import store from '@/store'
import { walkGrid } from '@/common/util'
import { replaceFuncKeyword } from '@/components/methods/function-helper.js'

function getVarList (targetData, variableList = []) {
    // 记录已使用的变量
    const usedVariableMap = {}
    function addUsedVariable (id, dir) {
        const { modifiers, prop, type, val, valType, slot } = dir
        function generateUseInfo (variableId) {
            const useInfo = { type, componentId: id, prop, modifiers, val, slot }
            const useInfos = (usedVariableMap[variableId] || (usedVariableMap[variableId] = [], usedVariableMap[variableId]))
            useInfos.push(useInfo)
        }
        if (val !== '' && !(val.startsWith('form') && val.indexOf('.') > 0) && valType === 'variable') {
            const variable = variableList.find((variable) => (variable.variableCode === val))
            if (variable) {
                generateUseInfo(variable.id)
            }
        }
        if (val !== '' && valType === 'expression') {
            variableList.forEach(({ variableCode, id }) => {
                if (val.includes(variableCode)) generateUseInfo(id)
            })
        }
    }

    const callBack = (component) => {
        const renderSlots = component.renderSlots || {}
        Object.keys(renderSlots).forEach((key) => {
            const { payload = {} } = renderSlots[key] || {}

            if (payload.variableData && payload.variableData.val) {
                const { val, valType } = payload.variableData
                const dir = { slot: key, type: 'slots', val, valType }
                addUsedVariable.call(this, component.componentId, dir)
            }
        })

        const renderDirectives = component.renderDirectives || []
        renderDirectives.forEach((dir) => {
            addUsedVariable.call(this, component.componentId, dir)
        })
    }
    targetData.forEach((grid, index) => walkGrid(targetData, grid, callBack, callBack, index))
    const ids = Object.keys(usedVariableMap)
    return ids.map(id => ({
        id,
        variableCode: usedVariableMap[id][0] && usedVariableMap[id][0].val
    }))
}

function getFuncList (targetData = [], funcGroups = []) {
    const usedFuncMap = {}
    const findUsedFuncsByCode = (code) => {
        if (typeof code === 'object') code = code.methodCode
        if ([undefined, ''].includes(code)) return
        funcGroups.forEach((group) => {
            const functionList = group.functionList || []
            const curFunc = functionList.find((x) => (x.funcCode === code))
            if (curFunc) {
                if (!usedFuncMap[curFunc.id]) {
                    usedFuncMap[curFunc.id] = curFunc
                    replaceFuncKeyword(curFunc.funcBody, (all, first, second, dirKey, funcStr, funcCode) => {
                        if (funcCode) findUsedFuncsByCode(funcCode)
                    })
                }
            }
        })
    }

    const callBack = (component) => {
        const renderProps = component.renderProps || {}
        Object.keys(renderProps).forEach((key) => {
            const { type, payload } = renderProps[key] || {}

            if (type === 'remote' || (Array.isArray(type) && type.includes('remote'))) {
                if (payload && payload.methodCode) {
                    const code = payload.methodCode
                    findUsedFuncsByCode(code)
                }
            }
        })

        const renderSlots = component.renderSlots || {}
        Object.keys(renderSlots).forEach((key) => {
            const { type, payload = {} } = renderSlots[key] || {}

            if (type === 'remote') {
                if (payload && payload.methodData && payload.methodData.methodCode) {
                    findUsedFuncsByCode(payload.methodData.methodCode)
                }
            }
        })

        const renderEvents = component.renderEvents || {}
        Object.keys(renderEvents).forEach((event) => {
            const code = renderEvents[event]
            if (code) findUsedFuncsByCode(code)
        })
    }
    targetData.forEach((grid, index) => walkGrid(targetData, grid, callBack, callBack, index))

    const funcIds = Object.keys(usedFuncMap)
    return funcIds.map(id => ({
        id,
        funcCode: usedFuncMap[id].funcCode
    }))
}

export default {
    getVarList,
    getFuncList
}
