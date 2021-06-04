/**
 * @file app store
 * @author
 */

function getInitVariableValue (defaultValue, defaultValueType) {
    let val = defaultValue.all
    if (defaultValueType === 1) val = defaultValue[window.BKPAAS_ENVIRONMENT]
    return val
}

export default {
    namespaced: true,
    state: {
        ${stateStr}
    },
    mutations: {
        setBkProjectVariable (state, { code, val }) {
            state[code] = val
        }
    },
    actions: {
        setBkProjectVariable ({ commit }, variableData) {
            commit('setBkProjectVariable', variableData)
        }
    }
}
