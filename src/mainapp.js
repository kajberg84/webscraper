/**
 * Main Application.
 *
 * @author Kaj Berg <kb223aw@student.lnu.se>
 * @version 1.0.0
 */

import { GetDays } from './getDays.js'
import { GetMovies } from './getMovies.js'
import { GetDinner } from './getDinner.js'
import { compareDayAndAva } from './utilities/handlingCalcs.js'
import { printSuggestions } from './utilities/printingSuggestions.js'
import { selectorSearch } from './utilities/linkScraper.js'

/**
 * Handling the main logic.
 *
 * @param {string} url - start url.
 */
export async function mainapp (url) {
  // Scraping Main url.
  const arrayLinks = await selectorSearch(url, 'a')
  console.log('Scraping links...OK')

  // All available day(s).
  const days = new GetDays(arrayLinks[0])
  const availableDays = await days.mainDaysLogic()
  console.log('Scraping available days...OK')

  // All available seats.
  const movies = new GetMovies(arrayLinks[1])
  const availableSeats = await movies.mainMoviesLogic()
  console.log('Scraping showtimes...OK')

  // Comparing available seats with available days.
  const theBestTime = compareDayAndAva(availableSeats, availableDays)

  // The perfect match.
  const dinner = new GetDinner(arrayLinks[2])
  const availableDinner = await dinner.mainDinnerLogic(theBestTime)
  console.log('Scraping possible reservations...OK')

  // Prebooking Dinner Table at the restaurant.
  await dinner.preBookDinner(availableDinner)

  // Printing out suggestions.
  printSuggestions(availableDinner)
}
