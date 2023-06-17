const qr = require('qr-image');
const fs = require('fs');

module.exports = function generateQRCode(text) {
    const qrCode = qr.image(text, { type: 'png' });
    qrCode.pipe(fs.createWriteStream('src/images/last-qr-code.png'));

    qrCode.on('end', () => {
        console.log('QR code saved successfully!');
    });

    qrCode.on('error', (error) => {
        console.error('Error while generating QR code:', error);
    });
}
  