class LesscodeCanvas extends HTMLElement {
    render () {
        const date = new Date(this.getAttribute('datetime') || Date.now())

        this.innerHTML = new Intl.DateTimeFormat('default', {
            year: this.getAttribute('year') || undefined,
            month: this.getAttribute('month') || undefined,
            day: this.getAttribute('day') || undefined,
            hour: this.getAttribute('hour') || undefined,
            minute: this.getAttribute('minute') || undefined,
            second: this.getAttribute('second') || undefined,
            timeZoneName: this.getAttribute('time-zone-name') || undefined
        }).format(date)
    }

    // 在 custom element 首次被插入到文档 DOM 节点上时被调用
    connectedCallback () {
        if (!this.rendered) {
            this.render()
            this.rendered = true
        }
    }

    static get observedAttributes () { // (3)
        return ['datetime', 'year', 'month', 'day', 'hour', 'minute', 'second', 'time-zone-name']
    }

    // 在 custom element 增加、删除或者修改某个属性时被调用。
    attributeChangedCallback (name, oldValue, newValue) { // (4)
        this.render()
    }

    // 当 custom element 被移动到新的文档时，被调用
    adoptedCallback () {

    }

    // 当 custom element 从文档 DOM 中删除时，被调用
    disconnectedCallback () {

    }
}

customElements.define('lesscode-canvas', LesscodeCanvas)
