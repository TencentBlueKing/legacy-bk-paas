export const toHyphenate = (str) => {
    return str.replace(/\B([A-Z])/g, '-$1').toLowerCase()
}
