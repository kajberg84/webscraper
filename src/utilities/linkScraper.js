/**
 * The linkscraper module.
 *
 * @author Kaj Berg <kb223aw@student.lnu.se>
 * @version 1.0.0
 */

import fetch from 'node-fetch'
import pkg from 'jsdom'
const { JSDOM } = pkg

/**
 * Scraping the link.
 *
 * @param {string} url - Url to search matching selector.
 * @param {string} selector - Selector to search for.
 * @returns {string[]} - Array with search results.
 */
export async function selectorSearch (url, selector) {
  const urlText = await fetchURL(url)
  const dom = new JSDOM(urlText)
  const arrayLinks = Array.from(dom.window.document.querySelectorAll(selector)).map(ele => ele.href)
  return arrayLinks
}

/**
 * Fetching and reading all HTML.
 *
 * @param {string} url - Url to scrape from.
 * @returns {string} The content as plain text(promise).
 */
export async function fetchURL (url) {
  const urlResponse = await fetch(url)
  const urlResponseText = urlResponse.text()
  return urlResponseText
}
