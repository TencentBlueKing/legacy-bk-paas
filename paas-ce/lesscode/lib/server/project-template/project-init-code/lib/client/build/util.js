const path = require('path')
const os = require('os')

exports.assetsPath = _path => {
    return path.posix.join('', _path)
}

exports.getIP = () => {
    const ifaces = os.networkInterfaces()
    const defultAddress = '127.0.0.1'
    let ip = defultAddress

    /* eslint-disable no-loop-func */
    for (const dev in ifaces) {
        if (ifaces.hasOwnProperty(dev)) {
            /* jshint loopfunc: true */
            ifaces[dev].forEach(details => {
                if (ip === defultAddress && details.family === 'IPv4') {
                    ip = details.address
                }
            })
        }
    }
    /* eslint-enable no-loop-func */
    return ip
}

exports.convert = str => {
    str = str.replace(/(&#x)(\w{4});/gi, () => String.fromCharCode(
        // eslint-disable-next-line no-undef
        parseInt(encodeURIComponent($0).replace(/(%26%23x)(\w{4})(%3B)/g, '$2'), 16))
    )
    return str
}

/**
 * 相对于 node_modules 的路径。内外版本 node_modules 安装的路径是不一样的
 */
exports.pathToNodeModules = '../../../node_modules'
