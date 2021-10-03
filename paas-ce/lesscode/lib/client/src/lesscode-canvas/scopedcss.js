let templateStyle // 模版sytle

/**
 * 进行样式隔离
 * @param {HTMLStyleElement} styleElement style元素
 * @param {string} appName 应用名称
 */
export default function scopedCSS (styleElement, appName) {
    // 前缀
    const prefix = `lesscode-canvas[name=${appName}]`

    // 初始化时创建模版标签
    if (!templateStyle) {
        templateStyle = document.createElement('style')
        document.body.appendChild(templateStyle)
        // 设置样式表无效，防止对应用造成影响
        templateStyle.sheet.disabled = true
    }

    if (styleElement.textContent) {
    // 将元素的内容赋值给模版元素
        templateStyle.textContent = styleElement.textContent
        // 格式化规则，并将格式化后的规则赋值给style元素
        styleElement.textContent = scopedRule(
            Array.from((templateStyle.sheet && templateStyle.sheet.cssRules) || []), prefix
        )
        // 清空模版style内容
        templateStyle.textContent = ''
    } else {
    // 监听动态添加内容的style元素
        const observer = new MutationObserver(function () {
            // 断开监听
            observer.disconnect()
            // 格式化规则，并将格式化后的规则赋值给style元素
            styleElement.textContent = scopedRule(
                Array.from((styleElement.sheet && styleElement.sheet.cssRules) || []), prefix
            )
        })

        // 监听style元素的内容是否变化
        observer.observe(styleElement, { childList: true })
    }
}

/**
 * 依次处理每个cssRule
 * @param rules cssRule
 * @param prefix 前缀
 */
function scopedRule (rules, prefix) {
    let result = ''
    // 遍历rules，处理每一条规则
    for (const rule of rules) {
        switch (rule.type) {
            case 1: // STYLE_RULE
                result += scopedStyleRule(rule, prefix)
                break
            case 4: // MEDIA_RULE
                result += scopedPackRule(rule, prefix, 'media')
                break
            case 12: // SUPPORTS_RULE
                result += scopedPackRule(rule, prefix, 'supports')
                break
            default:
                result += rule.cssText
                break
        }
    }

    return result
}

// 处理media 和 supports
function scopedPackRule (rule, prefix, packName) {
    // 递归执行scopedRule，处理media 和 supports内部规则
    const result = scopedRule(Array.from(rule.cssRules), prefix)
    return `@${packName} ${rule.conditionText} {${result}}`
}

/**
 * 修改CSS规则，添加前缀
 * @param {CSSRule} rule css规则
 * @param {string} prefix 前缀
 */
function scopedStyleRule (rule, prefix) {
    // 获取CSS规则对象的选择和内容
    const { selectorText, cssText } = rule

    // 处理顶层选择器，如 body，html 都转换为 lesscode-canvas[name=xxx]
    if (/^((html[\s>~,]+body)|(html|body|:root))$/.test(selectorText)) {
        return cssText.replace(/^((html[\s>~,]+body)|(html|body|:root))/, prefix)
    } else if (selectorText === '*') {
    // 选择器 * 替换为 lesscode-canvas[name=xxx] *
        return cssText.replace('*', `${prefix} *`)
    }

    const builtInRootSelectorRE = /(^|\s+)((html[\s>~]+body)|(html|body|:root))(?=[\s>~]+|$)/

    // 匹配查询选择器
    return cssText.replace(/^[\s\S]+{/, (selectors) => {
        return selectors.replace(/(^|,)([^,]+)/g, (all, $1, $2) => {
            // 如果含有顶层选择器，需要单独处理
            if (builtInRootSelectorRE.test($2)) {
                // body[name=xx]|body.xx|body#xx 等都不需要转换
                return all.replace(builtInRootSelectorRE, prefix)
            }
            // 在选择器前加上前缀
            return `${$1} ${prefix} ${$2.replace(/^\s*/, '')}`
        })
    })
}
