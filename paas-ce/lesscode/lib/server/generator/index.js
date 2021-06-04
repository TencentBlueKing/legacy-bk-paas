/**
 * 生成源码相关代码
 * 主要功能：
 * 1. 基于不同生成类型，选择不同的主管对象
 * 2. 准备生成资源相关的数据，进行lesscode上的业务处理
 */

import { vueDirector } from './director'

/**
 * 生成页面入口
 * @param {*} pageId
 * @returns 页面字符串
 */
const generatorPage = (pageId) => {
    vueDirector.constructPage()
}

/**
 * 生成项目入口
 * @param {*} projectId
 * @returns 生成的文件路径
 */
const generatorProject = (projectId) => {
    vueDirector.constructProject()
}

export default {
    generatorPage,
    generatorProject
}
