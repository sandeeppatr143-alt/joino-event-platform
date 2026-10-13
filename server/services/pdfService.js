const puppeteer = require('puppeteer')

async function generatePdfFromHtml(html) {
  const browser = await puppeteer.launch({ headless: true })
  try {
    const page = await browser.newPage()
    await page.setContent(html, { waitUntil: 'networkidle0' })
    return await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: { top: '18mm', bottom: '18mm', left: '15mm', right: '15mm' },
    })
  } finally {
    await browser.close()
  }
}

module.exports = generatePdfFromHtml
