const { parseSource } = require('scalameta-parsers');
/**
 * Lints Scala source code using scalameta-parsers.
 * @param {string} code - Scala code to check
 * @returns {{ success: boolean, error?: string }}
 */
function lintScala(code) {
    try {
      parseSource(code); // Throws if syntax is invalid
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  }
  
  module.exports = { lintScala };
  