import { getVarList, getFuncList } from '@/common/process-targetdata'
import { mapActions } from 'vuex'

export default {
    methods: {
        ...mapActions('functions', [
            'getAllGroupFuncs'
        ]),
        ...mapActions('variable', ['getAllVariable', 'getFunctionVariable']),

        async getVarAndFuncList (template) {
            // 将模板中用到的函数和变量都获取出来
            const [variableList, funcGroups] = await Promise.all([
                this.getAllVariable({ projectId: template.belongProjectId, versionId: template.versionId, pageCode: template.fromPageCode, effectiveRange: 0 }, false),
                this.getAllGroupFuncs({ projectId: template.belongProjectId, versionId: template.versionId }, false)
            ])
            const targetData = []
            targetData.push(JSON.parse(template.content || {}))
            const varList = getVarList(targetData, variableList)
            const funcList = getFuncList(targetData, funcGroups)

            const funcCodes = funcList.map(func => func.funcCode) || []
            let funcVars = []
            if (funcCodes && funcCodes.length) {
                funcVars = await this.getFunctionVariable({ projectId: template.belongProjectId, versionId: template.versionId, funcCodes })
            }
            const varDetailList = variableList.filter(item => (varList.find(val => val.variableCode === item.variableCode) || funcVars.find(val => val.variableId === item.id)))
            return { varList, funcList, varDetailList }
        }

    }
}
