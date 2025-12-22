import axios from 'axios'
import * as cheerio from 'cheerio'


export async function scrapeWebsite(url) {
  const res = await axios.get(url, { timeout: 10000 })
  const html = res.data // get HTML

  const $ = cheerio.load(html) //Load into Cheerio
  let content = $('body').text() //Extract text
  content = content.replace(/\s+/g, ' ').trim() // Clean whitespace

  if (content.length < 50) {
    return { success: false, error: 'Content too short' } // if false
  }

  if (content.length > 20000) {
    content = content.slice(0, 20000) // return truncate
  }

  return { success: true, content }
}
