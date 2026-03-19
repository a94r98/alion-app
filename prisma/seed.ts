import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

// Helper: store badge in metadata JSON
function meta(badge?: string, extra?: Record<string, unknown>) {
  return JSON.stringify({ badge: badge || null, ...extra })
}

async function main() {
  console.log('🌱 بدء seed البيانات...')

  // ─── Admin ───
  const adminPw = await bcrypt.hash(process.env.ADMIN_PASSWORD || 'Admin@123456', 12)
  const admin = await prisma.user.upsert({
    where: { email: process.env.ADMIN_EMAIL || 'admin@alion-app.com' },
    update: {},
    create: { name: 'مدير ALION', email: process.env.ADMIN_EMAIL || 'admin@alion-app.com', password: adminPw, role: 'admin', kycStatus: 'verified' }
  })
  console.log('✅ Admin:', admin.email)

  // ─── Categories ───
  const catGames = await prisma.category.upsert({ where: { slug: 'games' }, update: {}, create: { name: 'الألعاب', nameAr: 'الألعاب', nameEn: 'Games', slug: 'games', icon: '🎮', color: '#00D4FF', sortOrder: 1 } })
  const catChat = await prisma.category.upsert({ where: { slug: 'chat-apps' }, update: {}, create: { name: 'تطبيقات الدردشة', nameAr: 'تطبيقات الدردشة', nameEn: 'Chat Apps', slug: 'chat-apps', icon: '💬', color: '#9B59B6', sortOrder: 2 } })
  const catGiftCards = await prisma.category.upsert({ where: { slug: 'gift-cards' }, update: {}, create: { name: 'بطاقات هدايا', nameAr: 'بطاقات الهدايا', nameEn: 'Gift Cards', slug: 'gift-cards', icon: '🎁', color: '#00E676', sortOrder: 3 } })
  const catVip = await prisma.category.upsert({ where: { slug: 'subscriptions' }, update: {}, create: { name: 'اشتراكات VIP', nameAr: 'اشتراكات VIP', nameEn: 'Subscriptions', slug: 'subscriptions', icon: '👑', color: '#FFD700', sortOrder: 4 } })
  const catWallets = await prisma.category.upsert({ where: { slug: 'wallets' }, update: {}, create: { name: 'محافظ إلكترونية', nameAr: 'محافظ إلكترونية', nameEn: 'E-Wallets', slug: 'wallets', icon: '💳', color: '#FF9800', sortOrder: 5 } })
  const catTelecom = await prisma.category.upsert({ where: { slug: 'telecom' }, update: {}, create: { name: 'الاتصالات', nameAr: 'الاتصالات', nameEn: 'Telecom', slug: 'telecom', icon: '📞', color: '#E91E63', sortOrder: 6 } })

  // ─── PUBG Mobile ───
  const pubgPackages = [
    { nameAr: 'ببجي موبايل - 60 UC', en: '60 UC', price: 1.00, slug: 'pubg-60-uc', badge: 'الأوفر' },
    { nameAr: 'ببجي موبايل - 325 UC', en: '325 UC', price: 4.99, slug: 'pubg-325-uc', badge: '' },
    { nameAr: 'ببجي موبايل - 660 UC', en: '660 UC', price: 9.99, slug: 'pubg-660-uc', badge: '' },
    { nameAr: 'ببجي موبايل - 1800 UC', en: '1800 UC', price: 24.99, slug: 'pubg-1800-uc', badge: 'شائع' },
    { nameAr: 'ببجي موبايل - 3850 UC', en: '3850 UC', price: 49.99, slug: 'pubg-3850-uc', badge: '' },
    { nameAr: 'ببجي موبايل - 8100 UC', en: '8100 UC', price: 99.99, slug: 'pubg-8100-uc', badge: 'VIP' },
  ]
  for (const p of pubgPackages) {
    await prisma.product.upsert({ where: { slug: p.slug }, update: {}, create: { categoryId: catGames.id, name: p.nameAr, nameAr: p.nameAr, nameEn: `PUBG ${p.en}`, slug: p.slug, price: p.price, type: 'game', inputType: 'userId', inputLabel: 'Player ID', inputLabelAr: 'معرف اللاعب', metadata: meta(p.badge) } })
  }

  // ─── Free Fire ───
  const ffPackages = [
    { nameAr: 'فري فاير - 100 💎', price: 1.50, slug: 'ff-100-diamonds', badge: '' },
    { nameAr: 'فري فاير - 210 💎', price: 2.99, slug: 'ff-210-diamonds', badge: '' },
    { nameAr: 'فري فاير - 520 💎', price: 7.49, slug: 'ff-520-diamonds', badge: '' },
    { nameAr: 'فري فاير - 1080 💎', price: 14.99, slug: 'ff-1080-diamonds', badge: 'شائع' },
    { nameAr: 'فري فاير - 2200 💎', price: 29.99, slug: 'ff-2200-diamonds', badge: '' },
  ]
  for (const p of ffPackages) {
    await prisma.product.upsert({ where: { slug: p.slug }, update: {}, create: { categoryId: catGames.id, name: p.nameAr, nameAr: p.nameAr, nameEn: p.nameAr, slug: p.slug, price: p.price, type: 'game', inputType: 'userId', inputLabel: 'Player ID', inputLabelAr: 'معرف اللاعب', metadata: meta(p.badge) } })
  }

  // ─── Yalla Ludo ───
  const yallaPackages = [
    { nameAr: 'يلا لودو - 830 💎', price: 1.99, slug: 'yalla-830', badge: '' },
    { nameAr: 'يلا لودو - 2100 💎', price: 4.99, slug: 'yalla-2100', badge: '' },
    { nameAr: 'يلا لودو - 5600 💎', price: 12.99, slug: 'yalla-5600', badge: 'شائع' },
    { nameAr: 'يلا لودو - 12000 💎', price: 24.99, slug: 'yalla-12000', badge: '' },
    { nameAr: 'يلا لودو - 25000 💎', price: 49.99, slug: 'yalla-25000', badge: '' },
  ]
  for (const p of yallaPackages) {
    await prisma.product.upsert({ where: { slug: p.slug }, update: {}, create: { categoryId: catGames.id, name: p.nameAr, nameAr: p.nameAr, nameEn: p.nameAr, slug: p.slug, price: p.price, type: 'game', inputType: 'userId', inputLabel: 'User ID', inputLabelAr: 'الايدي', metadata: meta(p.badge) } })
  }

  // ─── Chat Apps ───
  const chatApps = [
    { name: 'Our Talk', nameAr: 'اورتوك', slug: 'ourtalk' },
    { name: 'Wadi Chat', nameAr: 'وادي شات', slug: 'wadichat' },
    { name: 'Vilaa Chat', nameAr: 'فيلا شات', slug: 'vilaachat' },
    { name: 'Waaw Chat', nameAr: 'واو شات', slug: 'waawchat' },
    { name: 'Wechill', nameAr: 'ويشيل', slug: 'wechill' },
    { name: 'Pota Live', nameAr: 'بوتا لايف', slug: 'potalive' },
    { name: 'Wyak Chat', nameAr: 'وياك شات', slug: 'wyakchat' },
    { name: 'Cocco Live', nameAr: 'كوكو لايف', slug: 'coccolive' },
    { name: 'Yudo Fun', nameAr: 'يودو', slug: 'yudofun' },
    { name: 'ROKA', nameAr: 'روكا', slug: 'roka' },
    { name: 'HAPI', nameAr: 'هابي', slug: 'hapi' },
    { name: 'ROOH', nameAr: 'روح', slug: 'rooh' },
    { name: 'Yoki Chat', nameAr: 'يوكي', slug: 'yokichat' },
    { name: 'UME Chat', nameAr: 'يومي', slug: 'umechat' },
    { name: 'Nahki Live', nameAr: 'ناهكي', slug: 'nahkilive' },
    { name: 'Crush Live', nameAr: 'كراش لايف', slug: 'crushlive' },
    { name: 'PK Star', nameAr: 'بي كي ستار', slug: 'pkstar' },
    { name: 'OLOO Live', nameAr: 'أولو لايف', slug: 'oloolive' },
  ]
  for (const app of chatApps) {
    await prisma.product.upsert({ where: { slug: app.slug }, update: {}, create: { categoryId: catChat.id, name: app.name, nameAr: app.nameAr, nameEn: app.name, slug: app.slug, price: 0.0001, type: 'chat', inputType: 'userId', inputLabel: 'User ID', inputLabelAr: 'الايدي', metadata: meta() } })
  }

  // ─── iTunes Gift Cards ───
  const itunesCards = [
    { nameAr: 'iTunes $5 USA', price: 5.50, slug: 'itunes-5-usd', badge: '' },
    { nameAr: 'iTunes $10 USA', price: 10.99, slug: 'itunes-10-usd', badge: '' },
    { nameAr: 'iTunes $15 USA', price: 16.49, slug: 'itunes-15-usd', badge: '' },
    { nameAr: 'iTunes $25 USA', price: 26.99, slug: 'itunes-25-usd', badge: 'شائع' },
    { nameAr: 'iTunes $50 USA', price: 53.99, slug: 'itunes-50-usd', badge: 'الأوفر' },
    { nameAr: 'iTunes $100 USA', price: 106.99, slug: 'itunes-100-usd', badge: '' },
  ]
  for (const c of itunesCards) {
    await prisma.product.upsert({ where: { slug: c.slug }, update: {}, create: { categoryId: catGiftCards.id, name: c.nameAr, nameAr: c.nameAr, nameEn: c.nameAr, slug: c.slug, price: c.price, type: 'giftcard', inputType: 'email', inputLabel: 'Apple ID Email', inputLabelAr: 'بريد Apple ID', metadata: meta(c.badge) } })
  }

  // ─── Google Play Gift Cards ───
  const googleCards = [
    { nameAr: 'Google Play $5 USA', price: 5.50, slug: 'gplay-5-usd', badge: '' },
    { nameAr: 'Google Play $10 USA', price: 10.99, slug: 'gplay-10-usd', badge: '' },
    { nameAr: 'Google Play $25 USA', price: 26.99, slug: 'gplay-25-usd', badge: 'شائع' },
    { nameAr: 'Google Play $50 USA', price: 53.99, slug: 'gplay-50-usd', badge: 'الأوفر' },
    { nameAr: 'Google Play $100 USA', price: 106.99, slug: 'gplay-100-usd', badge: '' },
  ]
  for (const c of googleCards) {
    await prisma.product.upsert({ where: { slug: c.slug }, update: {}, create: { categoryId: catGiftCards.id, name: c.nameAr, nameAr: c.nameAr, nameEn: c.nameAr, slug: c.slug, price: c.price, type: 'giftcard', inputType: 'email', inputLabel: 'Google Account', inputLabelAr: 'حساب Google', metadata: meta(c.badge) } })
  }

  // ─── SHAHID VIP ───
  const shahidPlans = [
    { nameAr: 'SHAHID VIP - شهر', price: 4.99, slug: 'shahid-1m', badge: '' },
    { nameAr: 'SHAHID VIP - 3 أشهر', price: 12.99, slug: 'shahid-3m', badge: 'شائع' },
    { nameAr: 'SHAHID VIP - 6 أشهر', price: 22.99, slug: 'shahid-6m', badge: '' },
    { nameAr: 'SHAHID VIP - سنة كاملة', price: 39.99, slug: 'shahid-12m', badge: 'الأوفر' },
  ]
  for (const p of shahidPlans) {
    await prisma.product.upsert({ where: { slug: p.slug }, update: {}, create: { categoryId: catVip.id, name: p.nameAr, nameAr: p.nameAr, nameEn: p.nameAr, slug: p.slug, price: p.price, type: 'subscription', inputType: 'email', inputLabel: 'Email', inputLabelAr: 'البريد الإلكتروني', metadata: meta(p.badge) } })
  }

  // ─── PAYEER ───
  await prisma.product.upsert({ where: { slug: 'payeer-usd' }, update: {}, create: { categoryId: catWallets.id, name: 'PAYEER', nameAr: 'PAYEER', nameEn: 'PAYEER Wallet', slug: 'payeer-usd', price: 0.001, type: 'wallet', inputType: 'walletId', inputLabel: 'Wallet ID', inputLabelAr: 'رمز المحفظة', metadata: meta() } })

  // ─── Telecom ───
  const telecomPackages = [
    { nameAr: 'رصيد MTN 500 ل.س', slug: 'mtn-500', price: 0.20 },
    { nameAr: 'رصيد MTN 1000 ل.س', slug: 'mtn-1000', price: 0.40 },
    { nameAr: 'رصيد MTN 2500 ل.س', slug: 'mtn-2500', price: 0.99 },
    { nameAr: 'رصيد MTN 5000 ل.س', slug: 'mtn-5000', price: 1.99 },
    { nameAr: 'رصيد سيريتل 500 ل.س', slug: 'syratel-500', price: 0.20 },
    { nameAr: 'رصيد سيريتل 1000 ل.س', slug: 'syratel-1000', price: 0.40 },
    { nameAr: 'رصيد سيريتل 5000 ل.س', slug: 'syratel-5000', price: 1.99 },
  ]
  for (const pkg of telecomPackages) {
    await prisma.product.upsert({ where: { slug: pkg.slug }, update: {}, create: { categoryId: catTelecom.id, name: pkg.nameAr, nameAr: pkg.nameAr, nameEn: pkg.nameAr, slug: pkg.slug, price: pkg.price, type: 'telecom', inputType: 'phone', inputLabel: 'Phone Number', inputLabelAr: 'رقم الهاتف', metadata: meta() } })
  }

  const total = await prisma.product.count()
  console.log(`✅ ${total} منتج بإجمالي 6 فئات`)
  console.log('🎉 اكتمل seed!')
}

main()
  .catch(e => { console.error(e); process.exit(1) })
  .finally(() => prisma.$disconnect())
