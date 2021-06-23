/**
 * Get Days module.
 *
 * @author Kaj Berg <kb223aw@student.lnu.se>
 * @version 1.0.0
 */
import { fetchURL, selectorSearch } from './utilities/linkScraper.js'
import { mostFreqItem } from './utilities/handlingCalcs.js'
import validator from 'validator'
import pkg from 'jsdom'
const { JSDOM } = pkg

/**
 * Class getDays.
 */
export class GetDays {
  /**
   * Initializes a new instance of the getDays class.
   *
   * @param {string[]} url - The URL to scrape from.
   */
  constructor (url) {
    this.url = url
    this._mainURL = new URL(this._url)
  }

  /**
   * Getter for the url.
   *
   * @returns {string} - Url.
   */
  get url () {
    return this._url
  }

  /**
   * Setter for the url.
   *
   * @param {string} value - Url.
   * Throw error if the url is not valid.
   */
  set url (value) {
    if (!validator.isURL(value)) {
      throw new Error('Insert valid URL')
    }
    this._url = value
  }

  /**
   * The start on finding the day.
   *
   * @returns {string[]} - With the best day(s).
   */
  async mainDaysLogic () {
    // All available days.
    const availableDays = await this.getCalendar()

    // Flattening, filtering all available days and returning.
    return mostFreqItem(availableDays.flat())
  }

  /**
   * Itterating through the url.
   *
   * @returns {string[]} all the available days.
   */
  async getCalendar () {
    const calendarLink = new URL(this._mainURL)

    // Scraping friends.
    const friends = await selectorSearch(calendarLink.href, 'a')
    const friendsArray = []
    const allDays = []

    friends.forEach(friend => {
      const url = new URL(friend, calendarLink.href)
      friendsArray.push(url.href)
    })

    // Getting all available days from all friends.
    for (let i = 0; i < friendsArray.length; i++) {
      allDays.push(await this._getAvailableDays(friendsArray[i]))
    }

    return allDays
  }

  /**
   * Checking all available days from a friend.
   *
   * @param {string} friendsUrl - Url to a friend.
   * @returns {string[]} - All available days.
   */
  async _getAvailableDays (friendsUrl) {
    const daysText = await fetchURL(friendsUrl)
    const dom = new JSDOM(daysText)
    const avaDays = []

    // Getting all Days.
    const allScheduledDays = await Array.from(dom.window.document.querySelectorAll('.responsive-table thead tr th')).map(day => day.textContent)
    // Getting all available days.
    const available = await Array.from(dom.window.document.querySelectorAll('.responsive-table tbody tr td')).map(available => available.textContent)

    available.forEach((days, i) => {
      if (days.toLowerCase() === 'ok') {
        avaDays.push(allScheduledDays[i])
      }
    })

    return avaDays
  }
}
