/**
 * Contains output messages.
 * @module Msgs
 */

"use strict";

const usage = "publish <version|bumplevel> [OPTIONS]\n" +
				"      <version> -> SemVer compatible version (e.g. 1.1.9)\n" +
				"      <bumplevel> -> Bump level (i.e. major, minor or patch).\n" +
				"      E.g. \`publish minor\` will bump version 1.1.4 to 1.2.0.";

const help = {
	message: "The commit/tag message. Use %@ to output version." +
			" E.g. `publish 1.1.9 -m \"Build v%@\"` will commit as 'Build v1.1.9'.",
	tag: 	 "The tag name. Use %@ to output version." +
			" E.g. `publish 1.1.9 -t \"%@-beta\"` will create a tag called '1.1.9-beta'.",
	force: "Force the commit and tag creation even if in the wrong branch and/or have uncommited changes.",
};

const prompt = {
	areYouSure: "Moving from v%@ to v%@.\nAre you sure about that?",
};

const success = {
	end:		"SUCCESS! Now at version %@.",
	add:		"Adding package.json",
	commit: 	"Commiting",
	tag: 		"Tagging",
	push: 		"Pushing files",
	pushTag:	"Pushing tags",
}

module.exports = { help, usage, prompt, success };