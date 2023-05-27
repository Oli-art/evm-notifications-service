const { createCanvas } = require('canvas')
const fs = require('fs')

const blockies = async function(address) {
    // The random number is a js implementation of the Xorshift PRNG
    const randseed = new Array(4) // Xorshift: [x, y, z, w] 32 bit values

    const seed = address.toLowerCase()

    const source = createIcon({ seed:seed ,size: 8, scale: 1}, randseed).toBuffer("image/png")

    await fs.writeFileSync('./images/last-blockie.png', source)
}

function seedrand(seed, randseed) {
    for (let i = 0; i < randseed.length; i++) {
        randseed[i] = 0
    }
    for (let i = 0; i < seed.length; i++) {
        randseed[i%4] = ((randseed[i%4] << 5) - randseed[i%4]) + seed.charCodeAt(i)
    }
}

function rand(randseed) {
    // based on Java's String.hashCode(), expanded to 4 32bit values
    const t = randseed[0] ^ (randseed[0] << 11)

    randseed[0] = randseed[1]
    randseed[1] = randseed[2]
    randseed[2] = randseed[3]
    randseed[3] = (randseed[3] ^ (randseed[3] >> 19) ^ t ^ (t >> 8))

    return (randseed[3]>>>0) / ((1 << 31)>>>0)
}

function createColor(randseed) {
    //saturation is the whole color spectrum
    const h = Math.floor(rand(randseed) * 360)
    //saturation goes from 40 to 100, it avoids greyish colors
    const s = ((rand(randseed) * 60) + 40) + '%'
    //lightness can be anything from 0 to 100, but probabilities are a bell curve around 50%
    const l = ((rand(randseed)+rand(randseed)+rand(randseed)+rand(randseed)) * 25) + '%'

    const color = 'hsl(' + h + ',' + s + ',' + l + ')'
    return color
}

function createImageData(size, randseed) {
    const width = size // Only support square icons for now
    const height = size

    const dataWidth = Math.ceil(width / 2)
    const mirrorWidth = width - dataWidth

    const data = []
    for(let y = 0; y < height; y++) {
        let row = []
        for(let x = 0; x < dataWidth; x++) {
            // this makes foreground and background color to have a 43% (1/2.3) probability
            // spot color has 13% chance
            row[x] = Math.floor(rand(randseed)*2.3)
        }
        const r = row.slice(0, mirrorWidth)
        r.reverse()
        row = row.concat(r)

        for(let i = 0; i < row.length; i++) {
            data.push(row[i])
        }
    }

    return data
}

function buildOpts(opts, randseed) {
    const newOpts = {}
    newOpts.seed = opts.seed || Math.floor((Math.random()*Math.pow(10,16))).toString(16)
    seedrand(newOpts.seed, randseed)
    newOpts.size = opts.size || 8
    newOpts.scale = opts.scale || 4
    newOpts.color = opts.color || createColor(randseed)
    newOpts.bgcolor = opts.bgcolor || createColor(randseed)
    newOpts.spotcolor = opts.spotcolor || createColor(randseed)

    return newOpts
}

function renderIcon(opts, canvas, randseed) {
    opts = buildOpts(opts || {}, randseed)
    const imageData = createImageData(opts.size, randseed)
    const width = Math.sqrt(imageData.length)
    const cc = canvas.getContext('2d')
    cc.fillStyle = opts.bgcolor
    cc.fillRect(0, 0, canvas.width, canvas.height)
    cc.fillStyle = opts.color

    for(let i = 0; i < imageData.length; i++) {

        // if data is 0, leave the background
        if(imageData[i]) {
            const row = Math.floor(i / width)
            const col = i % width

            // if data is 2, choose spot color, if 1 choose foreground
            cc.fillStyle = (imageData[i] == 1) ? opts.color : opts.spotcolor

            cc.fillRect(col * opts.scale, row * opts.scale, opts.scale, opts.scale)
        }
    }
    return canvas
}

function createIcon(opts, randseed) {
    let canvas = createCanvas(opts.size, opts.size)

    canvas = renderIcon(opts, canvas, randseed)

    return canvas
}

module.exports = blockies