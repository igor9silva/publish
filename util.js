"use strict";

// Replaces %@ within params
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

module.exports = {
	replace: replace,	
};