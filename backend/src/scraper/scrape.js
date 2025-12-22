import axios from 'axios'
import cheerio from 'cheerio'

export async function scrapeWebsite(url) {
  const res = await axios.get(url, { timeout: 10000 })
  const html = res.data

  const $ = cheerio.load(html)
  let content = $('body').text()
  content = content.replace(/\s+/g, ' ').trim()

  if (content.length < 50) {
    return { success: false, error: 'Content too short' }
  }

  if (content.length > 20000) {
    content = content.slice(0, 20000)
  }

  return { success: true, content }
}
