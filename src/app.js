/**
 * The starting point of the application.
 *
 * @author Kaj Berg <kb223aw@student.lnu.se>
 * @version 1.0.0
 */

import { mainapp } from './mainapp.js'
import { InputError, checkInput } from './utilities/errorhandling.js'
/**
 * The starting application.
 */
const startApp = async () => {
  try {
    // Check if argument is send in. or else throw error
    checkInput()
    // Get the third argument in command-line.
    const commandLine = process.argv.slice(2, 3)
    const url = commandLine.toString()
    // Starting main applikation.
    mainapp(url)
  } catch (error) {
    console.error(error.message)
    if (error instanceof InputError) {
      process.exitCode = 25
    }
  }
}

startApp()
