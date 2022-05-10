let hoverIns = null
let activeIns = null
let activeComp = null
let delIcon = null

// 组件元素鼠标enter
function handleMouseEnter (e) {
    if (!hoverIns) {
        const hoverEl = document.createElement('div')
        hoverEl.classList.add('hover-ins')
        document.body.appendChild(hoverEl)
        hoverEl.style.cssText = 'position: absolute; top: -10000px; left: -10000px; border: 1px dashed #3a84ff; z-index: 120; cursor: pointer; pointer-events: none;'
        hoverIns = hoverEl
    }
    setInsAttr(hoverIns, e.target)
}

// 组件元素鼠标leave
function handleMouseLeave (e) {
    hoverIns.style.display = 'none'
}

// 选中组件元素
function handleSelectComp (e) {
    e.stopPropagation()
    if (!activeIns) {
        const activeFragment = document.createDocumentFragment('div')
        const activeEl = document.createElement('div')
        activeEl.classList.add('active-ins')
        activeEl.style.cssText = 'position: absolute; top: -10000px; left: -10000px; border: 1px solid #3a84ff; z-index: 120; cursor: pointer; pointer-events: none;'
        activeFragment.appendChild(activeEl)
        const delEl = document.createElement('i')
        delEl.classList.add('del-comp-icon')
        delEl.classList.add('bk-drag-icon', 'bk-drag-shanchu')
        delEl.style.cssText = 'display: none; position: absolute; top: -22px; left: 0; padding: 4px 3px; border-radius: 2px; background: #3a84ff; font-size: 12px; color: #ffffff; pointer-events: all;'
        activeEl.appendChild(delEl)
        document.body.appendChild(activeEl)
        activeIns = activeEl
        delIcon = delEl
        delIcon.addEventListener('click', handleDelIconClick)
    }
    activeComp = e.currentTarget
    hoverIns.style.display = 'none'
    if (typeof e.currentTarget._value.click === 'function') {
        e.currentTarget._value.click(e.currentTarget._value)
    }
    if ('deletable' in e.currentTarget._value) {
        delIcon.style.display = e.currentTarget._value.deletable ? 'block' : 'none'
    } else {
        delIcon.style.display = 'block'
    }
    setInsAttr(activeIns, e.currentTarget)
}

function handleDelIconClick (e) {
    e.stopPropagation()
    if (typeof activeComp._value.delete === 'function') {
        activeComp._value.delete(activeComp._value)
    }
}

// 设置遮罩元素属性
function setInsAttr (ins, target) {
    const { width, height, top, left } = target.getBoundingClientRect()
    ins.style.width = `${width}px`
    ins.style.height = `${height}px`
    ins.style.top = `${top}px`
    ins.style.left = `${left}px`
    ins.style.display = 'block'
}

function init (el, binding) {
    el._value = binding.value
    el.addEventListener('mouseenter', handleMouseEnter)
    el.addEventListener('mouseleave', handleMouseLeave)
    el.addEventListener('click', handleSelectComp)
}

function destroy (el) {
    el.removeEventListener('mouseenter', handleMouseEnter)
    el.removeEventListener('mouseleave', handleMouseLeave)
    el.removeEventListener('click', handleSelectComp)
    if (delIcon) {
        delIcon.removeEventListener('click', handleDelIconClick)
    }
    if (hoverIns) {
        hoverIns.remove()
        hoverIns = null
    }
    if (activeIns) {
        activeIns.remove()
        activeIns = null
    }
}

export default {
    inserted (el, binding) {
        init(el, binding)
    },
    unbind (el) {
        destroy(el)
    }
}
