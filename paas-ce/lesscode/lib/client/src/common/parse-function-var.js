const parseFuncBodyVariable = str => {
    const pat = /lesscode\['\$\{prop:([^}]+)\}'\]/g
    const res = {}
    let match = null
    while ((match = pat.exec(str)) !== null) {
        res[match[1]] = true
    }
    return res
}

const parseFuncBodyMethod = str => {
    const pat = /lesscode\['\$\{func:([^}]+)\}'\]/g
    const res = {}
    let match = null
    while ((match = pat.exec(str)) !== null) {
        res[match[1]] = true
    }
    return res
}

export function parseFuncAndVar (templateNode, variableList, funcGroups) {
    const methodCodes = []
    const varCodes = []
    const recTree = node => {
        if (!node) {
            return
        }

        Object.keys(node.method).forEach(methodPathKey => {
            const methodCode = node.method[methodPathKey].code
            if (methodCodes.indexOf(methodCode) === -1) {
                methodCodes.push(methodCode)
            }
        })
        Object.keys(node.variable).forEach(variablePathKey => {
            const variableCode = node.variable[variablePathKey].code
            if (varCodes.indexOf(variableCode) === -1) {
                varCodes.push(variableCode)
            }
        })
        node.children.forEach(childNode => recTree(childNode))
    }
    // 遍历 node tree 收集组件中 variable、method 的引用信息
    recTree(templateNode)

    // 项目中所有变量，以 variableCode 作为索引 key
    const projectVarialbeCodeMap = variableList.reduce((result, variableData) => {
        result[variableData.variableCode] = variableData
        return result
    }, {})
    // 项目中所有函数，以 funcCode 作为索引 key
    const projectMethodCodeMap = funcGroups.reduce((result, methodGroup) => {
        methodGroup.children.forEach(methodData => {
            result[methodData.funcCode] = methodData
        })
        return result
    }, {})

    // 解析被引用 method 的 funcBody 内使用的 method、variable
    const funcBodyContainontainMethodMap = {}
    const funcBodyContainontainVariableMap = {}
    methodCodes.forEach(methodCode => {
        const funcbody = projectMethodCodeMap[methodCode].funcBody
        // 使用的函数在检测变量时需要解析出 funcbody 引用的变量，并判断变量的有效性
        Object.assign(funcBodyContainontainMethodMap, parseFuncBodyMethod(funcbody))
        Object.assign(funcBodyContainontainVariableMap, parseFuncBodyVariable(funcbody))
    })
    Object.keys(funcBodyContainontainVariableMap).forEach(variable => {
        if (varCodes.indexOf(variable)) {
            varCodes.push(variable)
        }
    })
    Object.keys(funcBodyContainontainMethodMap).forEach(method => {
        if (methodCodes.indexOf(method)) {
            methodCodes.push(method)
        }
    })
    // 转换 variableCode、methodCode 到具体的资源 id
    const varList = []
    const funcList = []
    varCodes.forEach(item => {
        if (projectVarialbeCodeMap[item] && projectVarialbeCodeMap[item].id) {
            varList.push({
                ...projectVarialbeCodeMap[item],
                id: projectVarialbeCodeMap[item].id,
                variableCode: item
            })
        }
    })
    methodCodes.forEach(item => {
        if (projectMethodCodeMap[item] && projectMethodCodeMap[item].id) {
            funcList.push({
                ...projectMethodCodeMap[item],
                id: projectMethodCodeMap[item].id,
                funcCode: item
            })
        }
    })
    return {
        varList,
        funcList
    }
}
