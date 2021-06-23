/**
 * Get Dinner module.
 *
 * @author Kaj Berg <kb223aw@student.lnu.se>
 * @version 1.0.0
 */

import validator from 'validator'
import fetch from 'node-fetch'
import FormData from 'form-data'
import pkg from 'jsdom'
const { JSDOM } = pkg

/**
 * Class GetDinner.
 */
export class GetDinner {
  /**
   * Initializes a new instance of the GetDinner class.
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
   * The Start of dinner logic.
   *
   * @param {object} bookingTime - Object with all available seats and times.
   * @returns {string} - dinner.
   */
  async mainDinnerLogic (bookingTime) {
    const userName = 'zeke'
    const passWord = 'coys'
    // All available dinner reservations.
    const availableDinnerSeats = await this._availableDinnerTable(userName, passWord)
    const bestTime = this._compareResults(bookingTime, availableDinnerSeats)

    return bestTime
  }

  /**
   * Comparing available movietimes with available reservation.
   *
   * @param {object} avaMovieTimes - Object with all available seats and times.
   * @param {Array} freeTableTimes - All available reservation times at.
   * @returns {object} - The perfect match for the friends to meet.
   * restaurant.
   */
  _compareResults (avaMovieTimes, freeTableTimes) {
    const theFinalChoice = []
    for (let i = 0; i < freeTableTimes.length; i++) {
      for (let x = 0; x < avaMovieTimes.length; x++) {
        if (this._isTableAndMovieTimeEqual(freeTableTimes, avaMovieTimes, x, i)) {
          theFinalChoice.push(avaMovieTimes[x])
        }
      }
    }
    return theFinalChoice
  }

  /**
   * Comparing dinnertime with movietime.
   *
   * @param {Array} tableTime - The dinner reservation times.
   * @param {object} movieTime - The cinema times.
   * @param {number} x - Itterator for movietime.
   * @param {number} i - Itterator for dinnertime.
   * @returns {boolean} - True or false.
   */
  _isTableAndMovieTimeEqual (tableTime, movieTime, x, i) {
    const tableDay = tableTime[i].substring(0, 3)
    const movieDay = movieTime[x].day.toLowerCase().substring(0, 3)
    const movieEnd = Number(movieTime[x].time.substring(0, 2)) + 2
    const tableStart = Number(tableTime[i].substring(3, 5))
    const tableEnd = Number(tableTime[i].substring(5))

    if ((tableDay === movieDay) && (tableStart === movieEnd)) {
      movieTime[x].dinnerRes = `${tableStart}:00-${tableEnd}:00`
      movieTime[x].bookingCode = `${tableTime[i]}`
      return true
    } else {
      return false
    }
  }

  /**
   * Getting booking Url.
   *
   * @param {string} dinnerURL - Url for dinner reservation.
   * @param {string} loginCookie - LoginCookie.
   * @returns {string} - All html from Url.
   */
  async _getBookingInfo (dinnerURL, loginCookie) {
    // Getting cookieArray from header.
    const bookingResponse = await fetch(dinnerURL, {
      method: 'GET',
      headers: {
        cookie: loginCookie
      }
    })
    const textDoc = await bookingResponse.text()
    const dom = new JSDOM(textDoc)
    // Get all the values inside input.
    const bookingTimes = Array.from(dom.window.document.querySelectorAll('[name="group1"]')).map(time => time.value)
    return bookingTimes
  }

  /**
   * Setting searchparameters and getting cookie.
   *
   * @param {string} user - Username.
   * @param {string} pass - Password.
   * @returns {string} - Cockie.
   */
  async _availableDinnerTable (user, pass) {
    const loginURL = `${this._mainURL}login`
    const searchParams = new URLSearchParams()
    searchParams.append('username', user)
    searchParams.append('password', pass)

    // Getting cookieArray from header.
    const response = await fetch(loginURL, {
      method: 'POST',
      body: searchParams,
      headers: {
        accept: '*/*',
        'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8'
      },
      redirect: 'manual'
    })

    // Getting LoginCookie and dinnerURL from response
    const cookieResp = response.headers.raw()['set-cookie']
    const cookieArray = cookieResp[0].split(';')
    this.dinnerURL = response.headers.raw().location
    this.cookie = cookieArray[0]

    // Getting all Dinner reservations.
    const bookingTimes = await this._getBookingInfo(this.dinnerURL, this.cookie)

    return bookingTimes
  }

  /**
   * Prebook Dinner table.
   *
   * @param {object} bookingInfo - object for available booking.
   */
  async preBookDinner (bookingInfo) {
    // Creating a FormData.
    const bookForm = new FormData()

    // Appending "bookingInfo[0].bookingCode" to formdata. Could randomize but better to go at first available time.
    bookForm.append('group1', bookingInfo[0].bookingCode)

    // Prebooking a table at the restaurant.
    await fetch(this.dinnerURL, {
      method: 'POST',
      body: bookForm,
      headers: {
        'Content-type': 'application/x-www-form-urlencoded; charset=utf-8',
        cookie: this.cookie
      }
    })
  }
}
