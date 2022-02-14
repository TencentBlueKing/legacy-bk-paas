export const toPascal = (str) => {
    return str.toLocaleLowerCase().split(/[-_]/).reduce((result, word) => {
        return result + word.replace(/^\w/, letter => letter.toLocaleUpperCase())
    }, '')
}
