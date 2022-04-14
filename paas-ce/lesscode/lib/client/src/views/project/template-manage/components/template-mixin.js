import { parseFuncAndVar } from '@/common/parse-function-var'
import { mapActions } from 'vuex'
import LC from '@/element-materials/core'

export default {
    methods: {
        ...mapActions('functions', [
            'getAllGroupAndFunction'
        ]),
        ...mapActions('variable', ['getAllVariable', 'getFunctionVariable']),

        async getVarAndFuncList (template) {
            // 将模板中用到的函数和变量都获取出来
            const [variableList, funcGroups] = await Promise.all([
                this.getAllVariable({ projectId: template.belongProjectId, versionId: template.versionId, pageCode: template.fromPageCode, effectiveRange: 0 }, false),
                this.getAllGroupAndFunction({ projectId: template.belongProjectId, versionId: template.versionId })
            ])
            const templateNode = LC.parseTemplate(JSON.parse(template.content || {}))
            const result = parseFuncAndVar(templateNode, variableList, funcGroups)
            return result
        }
    }
}
