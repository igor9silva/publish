/**
 * Contains output string manipulations.
 * @module Util
 */

"use strict";

module.exports = function(options) {

	/**
	 * Replaces %@'s within the given params.
	 * @param {string} str A string containing 0 or more %@'s to be replaced
	 * @param {string[]} params The strings to replace the %@'s
	 * @return {string} The replaced string
	 * @public
	 */
	function replace(str, params) {
		const isArr = params instanceof Array;
		str = str.split('%@');

		let ret = "";
		for (let i = 0, len = str.length - 1; i < len; i++) {
			const subs = isArr? params[i] : params;
			ret += str[i] + subs;
		}
		ret += str[str.length - 1];

		return ret;
	}

	/**
	 * Greens the text. Returns the original string if options.no_color evaluates to true
	 * @param {string} str The string to be green'd
	 * @return {string} The green'd string
	 * @public
	 */
	function green(str) {
		return options.no_color? str : `\x1B[32m${str}\x1B[0m`;
	}

	return { replace, green };
}