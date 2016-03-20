/**
 * Contains error messages and emitters.
 * @module Error
 */

"use strict";

/* Dependencies */
const util = require('./util');

/* Message Map */
const usageInfo = "Type 'publish --help' for usage info.";
const ERROR_MSG = {
	ERR_GIT: "Could not gather git info. Are you inside a repository?",
	ERR_UNKNOWN: "An unknown error happened.",
	ERR_GIT_PUSH: "Something went wront on git. Check if a commit/tag were created using the msg `%@.`",
	ERR_NO_VERSION: "You must specify a version! " + usageInfo,
	ERR_TOO_MANY_ARGS: "Too many arguments! " + usageInfo,
	ERR_SAME_VERSION: "It's needed to update the version for each publish. Actual is %@.",
	ERR_WRONG_BRANCH: "You're in the wrong branch. You must be in the %@ branch to be able to publish.",
	ERR_LOWER_VERSION: "You cannot downgrade the version. Please use a higher version then the actual one (%@).",
	ERR_NO_VERSION_ON_JSON: "No key 'version' found on package.json.",
	ERR_UNCOMMITTED_CHANGES: "You have uncommitted changes in the working branch. Please commit or stash them before publishing.",
	ERR_CANT_OPEN_PACKAGE_JSON: "Could not open package.json. Do you have one?",
	ERR_VERSION_NOT_SEMVER_COMPLIANT: "The specified version (%@) is not SemVer compliant.",
};

module.exports = function(cli) {

	/**
	 * Get a human-readable message for the given key.
	 * @param {string} errKey Error key
	 * @param {string[]} params Parameters to be replaced in the error message
	 * @private
	 */
	function messageForError(errKey, params) {
		const key = errKey || 'ERR_UNKNOWN';
		const text = ERROR_MSG[key] || ERROR_MSG['ERR_UNKNOWN'];
		const msg = util.replace(text, params);

		return msg;
	}

	/**
	 * Outputs the error message to stdout.
	 * @param {string} key Error key
	 * @param {...string} params Any amount of strings to replace %@'s in the error message
	 * @public
	 */
	const error = (key, ...params) => cli.error(messageForError(key, params));

	/**
	 * Outputs the error message to stdout and exits with non-zero code.
	 * @param {string} key Error key
	 * @param {...string} params Any amount of strings to replace %@'s in the error message
	 * @public
	 */
	error.fatal = (key, ...params) => cli.fatal(messageForError(key, params));

	return error;
};