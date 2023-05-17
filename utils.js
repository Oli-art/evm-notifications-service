const hex2a = function (hex) {
  let str = ''
  for (let i = 2; i < hex.length; i += 2) {
    const v = parseInt(hex.substr(i, 2), 16)
    if (v) str += String.fromCharCode(v)
  }
  return str
}

module.exports = hex2a
