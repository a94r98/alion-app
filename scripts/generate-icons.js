const path = require('path')
const sharp = require('sharp')

const sizes = [72, 96, 128, 144, 152, 192, 384, 512]
const inputLogo = path.join(__dirname, '../../App Icon.jpg')
const outputDir = path.join(__dirname, '../public/icons')

async function generateIcons() {
  console.log('🎨 توليد أيقونات PWA...')
  for (const size of sizes) {
    await sharp(inputLogo)
      .resize(size, size, { fit: 'cover' })
      .png()
      .toFile(path.join(outputDir, `icon-${size}x${size}.png`))
    console.log(`  ✅ icon-${size}x${size}.png`)
  }
  // Also generate a screenshot placeholder
  await sharp(inputLogo)
    .resize(390, 844, { fit: 'contain', background: { r: 5, g: 10, b: 20 } })
    .png()
    .toFile(path.join(outputDir, 'screenshot-mobile.png'))
  console.log('  ✅ screenshot-mobile.png')
  console.log('🎉 اكتمل توليد الأيقونات!')
}

generateIcons().catch(console.error)
