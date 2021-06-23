/**
 * Module for errorhandling.
 *
 * @author Kaj Berg <kb223aw@student.lnu.se>
 * @version 1.0.0
 */

/**
 * Checking input for an url.
 */
export function checkInput () {
  if (process.argv.slice(2, 3).length === 0) {
    throw new InputError('The input is not an valid url')
  }
}

/**
 * InputError.
 *
 * @class
 */
export class InputError extends Error {
  /**
   * InputError.
   *
   * @param {string} text - Errortext.
   */
  constructor (text) {
    super(text)
    this.name = 'InputError.'
  }
}
