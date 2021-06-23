/**
 * Get Movies module.
 *
 * @author Kaj Berg <kb223aw@student.lnu.se>
 * @version 1.0.0
 */

import { fetchURL } from './utilities/linkScraper.js'
import validator from 'validator'
import pkg from 'jsdom'
const { JSDOM } = pkg

/**
 * Class GetMovies.
 */
export class GetMovies {
  /**
   * Initializes a new instance of the GetMovies class.
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
   * The Start of movies logic.
   *
   * @returns {string}- movies.
   */
  async mainMoviesLogic () {
    const movieText = await fetchURL(this._mainURL)

    // Object with all movies all days.
    const dom = new JSDOM(movieText)
    this.moviesAndDays = await this._getMoviesAndDays(dom)

    // Getting status for all days.
    const statusFridayJSON = this._getAvailableSeats('friday')
    const statusSaturdayJSON = this._getAvailableSeats('saturday')
    const statusSundayJSON = this._getAvailableSeats('sunday')

    Promise.all([statusFridayJSON, statusSaturdayJSON, statusSundayJSON])

    // Parsing status
    const fridayStatus = this.jsonParseIt(await statusFridayJSON)
    const saturdayStatus = this.jsonParseIt(await statusSaturdayJSON)
    const sundayStatus = this.jsonParseIt(await statusSundayJSON)

    // Concat the arrays.
    const allInfo = fridayStatus.concat(saturdayStatus, sundayStatus)

    // Setting movie name and day.
    this._setDayAndMovieName(allInfo)

    // Getting array with only available seats.
    return this._filterStatus(allInfo)
  }

  /**
   * Removing all not available days.
   *
   * @param {string[]} allInfo - Array with all info.
   * @returns {string[]} - Array with only available seats.
   */
  _filterStatus (allInfo) {
    const filteredStatus = allInfo.filter((item) => {
      return item.status === 1
    })
    return filteredStatus
  }

  /**
   * Match Titles and days.
   *
   * @param {string[]} status - Array with all info
   */
  _setDayAndMovieName (status) {
    status.forEach(item => {
      item.movie = this._getMovieTitle(item.movie)
      item.day = this._getDay(item.day)
      item.dinnerRes = ''
      item.bookingCode = ''
    })
  }

  /**
   * Getting day.
   *
   * @param {string} dayValue - DayValue.
   * @returns {string} - Day.
   */
  _getDay (dayValue) {
    if (dayValue === '05') {
      return 'Friday'
    } else if (dayValue === '06') {
      return 'Saturday'
    } else { return 'Sunday' }
  }

  /**
   * Getting movietitle.
   *
   * @param {string} titleValue - MovieValue.
   * @returns {string} - MovieTitle.
   */
  _getMovieTitle (titleValue) {
    if (titleValue === '01') {
      return this.moviesAndDays[0]
    } else if (titleValue === '02') {
      return this.moviesAndDays[1]
    } else { return this.moviesAndDays[2] }
  }

  /**
   * Parsing and flatting array.
   *
   * @param {string} item - item to parse.
   * @returns {string} - parsed and flattened item.
   */
  jsonParseIt (item) {
    return (item.map(time => JSON.parse(time))).flat()
  }

  /**
   * Get all status on days and movies.
   *
   * @param {string} day - day to scrape.
   * @returns {string[]} - JSON format object.
   */
  async _getAvailableSeats (day) {
    // url = https://cscloud6-127.lnu.se/scraper-site-1/cinema
    const urlFriday = `${this._mainURL}/check?day=05&movie=0`
    const urlSaturday = `${this._mainURL}/check?day=06&movie=0`
    const urlSunday = `${this._mainURL}/check?day=07&movie=0`

    if (day === 'friday') {
      return Promise.all([fetchURL(`${urlFriday}1`), fetchURL(`${urlFriday}2`), fetchURL(`${urlFriday}3`)])
    } else if (day === 'saturday') {
      return Promise.all([fetchURL(`${urlSaturday}1`), fetchURL(`${urlSaturday}2`), fetchURL(`${urlSaturday}3`)])
    } else {
      return Promise.all([fetchURL(`${urlSunday}1`), fetchURL(`${urlSunday}2`), fetchURL(`${urlSunday}3`)])
    }
  }

  /**
   * Itterating through the movies.
   *
   * @param {string} dom - text from url.
   * @returns {string[]} - All the available movies and all days.
   */
  async _getMoviesAndDays (dom) {
    // All movies.
    const movies = await Array.from(dom.window.document.querySelectorAll('form[action="cinema/movie"] select#movie option:not(:disabled)')).map(movie => movie.textContent)
    // All days to go to the movies.
    const movieDays = await Array.from(dom.window.document.querySelectorAll('form[action="cinema/day"] select#day option:not(:disabled)')).map(day => day.textContent)

    return movies.concat(movieDays)
  }
}
