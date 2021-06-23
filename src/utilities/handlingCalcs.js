/**
 * Calculating Module.
 *
 * @author Kaj Berg <kb223aw@student.lnu.se>
 * @version 1.0.0
 */

/**
 * Checking for the most frequent item(s).
 *
 * @param {string[]} item - Array of items.
 * @returns {string[]} - The most frequent item(s).
 */
export function mostFreqItem (item) {
  const obj = {}
  let mostFreq = 0
  let theBestDay = []

  item.forEach(day => {
    if (!obj[day]) {
      obj[day] = 1
    } else {
      obj[day]++
    }

    if (obj[day] > mostFreq) {
      mostFreq = obj[day]
      theBestDay = [day]
    } else if (obj[day] === mostFreq) {
      theBestDay.push(day)
    }
  })
  return theBestDay
}

/**
 * Filtering array for the day(s) available.
 *
 * @param {string[]} avaSeats - Array of available seats.
 * @param {string[]} bestDays - The best day(s).
 * @returns {string[]} - Filtered array.
 */
export function compareDayAndAva (avaSeats, bestDays) {
  const filtered = avaSeats.filter((item) => {
    return bestDays.includes(item.day)
  })

  return filtered
}
