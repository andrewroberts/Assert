//234567890123456789012345678901234567890123456789012345678901234567890123456789

// JShint: 22 March 2015 13:00 GMT
// Unit Tests: 22 March 2015 13:00 GMT

/*
 * Copyright (C) 2014 Andrew Roberts
 * 
 * This program is free software: you can redistribute it and/or modify it under
 * the terms of the GNU General Public License as published by the Free Software
 * Foundation, either version 3 of the License, or (at your option) any later 
 * version.
 * 
 * This program is distributed in the hope that it will be useful, but WITHOUT
 * ANY WARRANTY without even the implied warranty of MERCHANTABILITY or FITNESS
 * FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.
 * 
 * You should have received a copy of the GNU General Public License along with 
 * this program. If not, see http://www.gnu.org/licenses/.
 */

// Assert.gs
// =========
//
// Debug, assertions and error handling.
//
// These functions assume that all top-level functions (event handlers) 
// catch errors thrown by any lower level functions to centralise the processing 
// of errors before the are passed - or not - to the user, by calling 
// Assert.handleError().

// TODO - Reword this to allow for not passing in the function name, just a string.
// TODO - Make it possible to display 'internal error' in a dialog, but see the 
// actual error in the Log
// TODO - Make calling function last param
// TODO - Add option to email admin about the error

var HandleError = Object.freeze({

  // Throw the error
  THROW: 'throw',  
  
  // Try to display it to the user if that is possible within the context the 
  // script is running, for example in a spreadsheet
  DISPLAY: 'display',
  
  // Simply return (the caller will already have the error message)
  RETURN: 'return',
  
})

var config_ 

/**
 * Initialise the Assert library
 *
 * @param {object} config {
 *   handleError {HandleError} 
 *   sendErrorEmail {boolean}
 *   emailAddress {string}
 *   scriptName {string}
 *   scriptVersion {string}
 * }
 */
  
// TODO - Add parameter checking see the Log library  
  
function init(config) {

  config_ = config
     
} // init()

/**
 * Assert the passed condition is true.
 *
 * @param {boolean} assertion value to test
 * @param {string} callingfunction calling function name
 * @param {string} message error message if it fails
 */

function assert(assertion, callingfunction, message) {
  
  var functionName = 'assert()'
  var errorMessage
  
  if (!Util_.isBoolean(assertion)) {
      
    throw_(functionName, 'first arg should be a boolean')
  }
  
  if (!Util_.isString(callingfunction)) {
    
    throw_(functionName, 'second arg should be the calling function.')
  }
  
  if (!Util_.isUndefined(message) && !Util_.isString(message)) {

    throw_(functionName, 'third arg should be a string.')
  }  
  
  if (!assertion) {
    
    throw_(callingfunction, message)
  } 

} // assert()

/**
 * Assert that the passed value is a number.
 *
 * @param {number} testNumber value to test
 * @param {string} callingfunction calling function name
 * @param {string} message error message if it fails
 */

function assertNumber(testNumber, callingfunction, message) {

  assert(Util_.isNumber(testNumber), callingfunction, message)
  
} // assertNumber()

/**
 * Assert that the passed value is a string.
 *
 * @param {string} testString value to test
 * @param {string} callingfunction calling function name
 * @param {string} message error message if it fails
 */

function assertString(testString, callingfunction, message) {

  assert(Util_.isString(testString), callingfunction, message)
  
} // assertString()

/**
 * Assert that the passed value is a not null.
 *
 * @param {string} test value to test
 * @param {string} callingfunction calling function name
 * @param {string} message error message if it fails
 */

function assertNotNull(test, callingfunction, message) {

  assert(!Util_.isNull(test), callingfunction, message)
  
} // assertNotNull()

/**
 * Assert that the passed value is defined.
 *
 * @param {string} test value to test
 * @param {string} callingfunction calling function name
 * @param {string} message error message if it fails
 */

function assertDefined(test, callingfunction, message) {

  assert(!Util_.isUndefined(test), callingfunction, message)
  
} // assertDefined()

/**
 * Assert that the passed value is an object.
 *
 * @param {string} test value to test
 * @param {string} callingfunction calling function name
 * @param {string} message error message if it fails
 */

function assertObject(test, callingfunction, message) {

  assert(Util_.isObject(test), callingfunction, message)
  
} // assertObject()

/**
 * Assert that the passed value is a date object.
 *
 * @param {string} test value to test
 * @param {string} callingfunction calling function name
 * @param {string} message error message if it fails
 */

function assertDate(test, callingfunction, message) {

  assert(Util_.isDate(test), callingfunction, message)
  
} // assertDate()

/**
 * Assert that the passed value is a boolean.
 *
 * @param {string} test value to test
 * @param {string} callingfunction calling function name
 * @param {string} message error message if it fails
 */

function assertBoolean(test, callingfunction, message) {

  assert(Util_.isBoolean(test), callingfunction, message)
  
} // assertDate()

// Error functions called at top level
// -----------------------------------

/**
 * Handle an error. This is only called from the top level of 
 * the script, everything else should throw an error which 
 * will be caught at the top-level and handled by this function.
 *
 * @param {Error} error Error object
 * @param {string} message string
 * @param {object} log Logging object
 */

function handleError(error, message, log) {
    
  var functionName = 'handleError()'
  
  if (typeof config_ === 'undefined') {
    throw new Error('Assert library not initialised. Call Assert.init() first')
  }

  var hyphen = ' - '  
  var fullErrorMessage = ''
  Dialog.init(log)

  if (error instanceof Error && typeof log !== 'undefined') {
  
    fullErrorMessage = 'user message:' + message + ' - ' +
      'name: ' + error.name + ' - ' +
      'error message: ' + error.message + '\n\n' + 
      'fileName: ' + error.fileName + ' - ' + 
      'lineNumber: ' + error.lineNumber + ' - ' +     
      'stack: ' + error.stack
    
    log.severe(fullErrorMessage)
  }
  
  if (config_.sendErrorEmail) {
    
    MailApp.sendEmail(
      config_.emailAddress, 
      'Error thrown in ' + config_.scriptName + ', ' + 
        config_.scriptVersion, 
      'Error: ' + fullErrorMessage)
  }
    
  switch (config_.handleError) {
  
  case HandleError.DISPLAY:
  
    // TODO - Shouldn't we be doing some of the error checking like below??
  
    Dialog.show(message, error.message)
    break
    
  case HandleError.THROW:
    
    if (!(error instanceof Error)) {
      handleError(new TypeError(functionName + ' - first arg not an Error'))
    }
    
    if (Util_.isUndefined(message)) {
      
      message = ''
      hyphen = ''
      
    } else {
      
      if (!Util_.isString(message)) {
        
        handleError(new TypeError(functionName + ' - second arg not a string'))
      }
    }
    
    // Tag the user message on
    error.message += hyphen + message 
    
    throw error
    
  case HandleError.RETURN:
    return
    
  default:
    throw new TypeError(functionName + ' - Invalid HandleError, has init() been called?')
    
  }
  
} // handleError()

// Error functions called at low-level
// -----------------------------------

/**
 * Throw an error, to be caught and processed by handleError().
 *
 * @param {string} callingfunction calling function name
 * @param {string} message error message
 */

function throw_(callingfunction, message) {

  var functionName = 'throw_()'

  var errorMessage

  if (!Util_.isString(callingfunction)) {
    
    errorMessage = getErrorMessage(functionName + 
                                    ' - first arg should be the calling function.')
                                    
    throw new TypeError(errorMessage)        
  }
  
  if (!Util_.isUndefined(message) && !Util_.isString(message)) {

    errorMessage = getErrorMessage(functionName + 
                                    ' - second arg should be a string.')
                                    
    throw new TypeError(errorMessage)        
  }

  errorMessage = getErrorMessage(callingfunction + ' - ' + message)
  
  throw new Error(errorMessage)
  
  // Private Functions
  // -----------------

  /**
   * If we're throwing the error - usually during developement - display 
   * the internal error message, otherwise just display 'internal error'.
   */
  
  function getErrorMessage(message) {
  
  // TODO - Add another option to display the internal error message or not
  
  /*    
    return (handleError === null) ? 'Internal error.' : message
  */

  return message

  } // throw_().getErrorMessage()
  
} // throw_()
