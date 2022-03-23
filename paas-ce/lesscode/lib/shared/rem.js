const recalculate = () => {
    const html = window.document.documentElement
    const clientWidth = html.clientWidth || 375
    html.style.fontSize = `${clientWidth / 20}px`
}

window.addEventListener('resize', recalculate, false)
window.document.addEventListener('DOMContentLoaded', recalculate, false)
