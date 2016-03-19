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

	/* Get a human-readable message for the given key */
	function messageForError(errKey, params) {
		const key = errKey || DEFAULT_ERROR;
		const text = ERROR_MSG[key] || ERROR_MSG[DEFAULT_ERROR];
		const msg = util.replace(text, params);

		return msg;
	}

	// Log error
	const error = (key, ...params) => cli.error(messageForError(key, params));

	// Log error and exits with non-zero code
	error.fatal = (key, ...params) => cli.fatal(messageForError(key, params));

	return error;
};