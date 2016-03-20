"use strict";

module.exports = function(options) {
	const util = {};

	// Replaces %@ within params
	util.replace = function(str, params) {
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

	// Returns green'd text if user hasn't used --no-color
	util.green = function(str) {
		return options.no_color? str : `\x1B[32m${str}\x1B[0m`;
	}

	return util;
}