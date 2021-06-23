/**
 * Printing Suggestion module.
 *
 * @author Kaj Berg <kb223aw@student.lnu.se>
 * @version 1.0.0
 */

/**
 * Final suggestion for gathering.
 *
 * @param {object} suggestions - Suggestions for the gathering.
 */
export function printSuggestions (suggestions) {
  console.log('\nSuggestions\n===========')
  suggestions.forEach(tips => {
    console.log(`* On ${tips.day}, "${tips.movie}" begins at ${tips.time}, and there is a free table to book between ${tips.dinnerRes}.`)
  })
}
