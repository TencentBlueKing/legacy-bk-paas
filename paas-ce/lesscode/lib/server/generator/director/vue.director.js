/**
 * 构造VUE相关的文件
 * 主要负责组装具体的生成方法
 */
import processTargetData from '../process/target-data'
import getProduct from '../build/vue.product'
import buildHtml from '../build/vue.html'
import buildCss from '../build/common.css'
import buildMethods from '../build/common.methods'
import buildScript from '../build/vue.script'

class Director {
    constructor () {
        this.css = ''
        this.html = []
        this.data = {}
        this.methods = []
        this.lifeCycle = {}
        this.callBacks = []
    }

    registerMethods (...callBacks) {
        this.callBacks.push(...callBacks)
    }

    processTargetData (targetData) {
        processTargetData(targetData, this)
    }

    getProduct () {
        return getProduct(this)
    }
}

/**
 * 生成VUE单页文件
 */
const constructPage = (targetData) => {
    const director = new Director()
    director.registerMethods(buildHtml, buildCss, buildMethods, buildScript)
    director.processTargetData(targetData)
    return director.getProduct()
}

/**
 * 生成VUE项目
 */
const constructProject = () => {

}

export {
    constructPage,
    constructProject
}
