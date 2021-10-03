export default function request (url, options) {
    if (!window.fetch) {
        throw Error('not support fetch')
    }
    return fetch(url, { mode: 'cors', cache: 'no-cache', ...options }).then(res => res.text())
}
