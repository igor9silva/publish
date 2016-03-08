#!/usr/bin/env node
"use strict";

// Dependencies
const fs		= require('fs');
const semver	= require('semver');
const git 		= require('simple-git')();
const prompter	= require('keypress-prompt');

// Config Constants
const DEFAULT_BRANCH = 'master';
const DEFAULT_REMOTE = 'origin';
const VERSION_JSON	 = 'package.json';

// Error Constants
const ERR_GIT = 0;
const ERR_GIT_PUSH = 1;
const ERR_NO_VERSION = 2;
const ERR_SAME_VERSION = 3;
const ERR_WRONG_BRANCH = 4;
const ERR_LOWER_VERSION = 5;
const ERR_NO_VERSION_ON_JSON = 6;
const ERR_UNCOMMITTED_CHANGES = 7;
const ERR_CANT_OPEN_PACKAGE_JSON = 8;
const ERR_VERSION_NOT_SEMVER_COMPLIANT = 9;

// Args
const version = process.argv[2];

// Start publishing routine
publish(version);

// Publishing routine
function publish(version) {
	
	// Check if received version
	if (!version) return exit(ERR_NO_VERSION);

	// Check if version is SemVer compliant
	if (!semver.valid(version)) return exit(ERR_VERSION_NOT_SEMVER_COMPLIANT, [version]);

	git.status((err, status) => {
		if (err) return exit(ERR_GIT);
		if (!status.isClean()) return exit(ERR_UNCOMMITTED_CHANGES);
		if (status.current !== DEFAULT_BRANCH) return exit(ERR_WRONG_BRANCH); 

		fs.readFile(VERSION_JSON, (err, json) => {
			if (err) return exit(ERR_CANT_OPEN_PACKAGE_JSON);

			// Parse the package.json
			const parsed = JSON.parse(json);
			if (parsed.version === undefined) return exit(ERR_NO_VERSION_ON_JSON);
			if (parsed.version === version) return exit(ERR_SAME_VERSION, [parsed.version]);
			if (semver.lt(version, parsed.version)) return exit(ERR_LOWER_VERSION, [parsed.version]);

			// Asks if the user is sure about what he is doing
			prompter.prompt(`Moving from v${parsed.version} to v${version}.\nAre you sure about that?`, ['y', 'n'])
			.then(function(r) {
				if (r === 'n') return process.exit();

				// Update the package.json
				parsed.version = version;
				fs.writeFile(VERSION_JSON, JSON.stringify(parsed, null, 2) + '\n', (err) => {
					if (err) return exit();

					const tag = `v${version}`;
					const msg = `Build ${tag}`;
					var handler = function(err) { if (err) return exit(ERR_GIT_PUSH, msg); }

					git
					.add([VERSION_JSON])
					.commit(msg, handler)
					.addAnnotatedTag(tag, msg, handler)
					.push(DEFAULT_REMOTE, DEFAULT_BRANCH, handler)
					.pushTags(DEFAULT_REMOTE, handler)
					.then(function(params) {
						console.log(`SUCCESS. The app is now at version ${version}.`);
						process.exit();
					});
				});
			}, process.exit);
		});
	});	
}

function exit(err, params) {
	let msg;

	switch (err) {
		case ERR_GIT:
			msg = `Could not gather git info. Are you inside a repository?`;
		break;
		
		case ERR_GIT_PUSH:
			msg = `Something went wront with git. Check if a commit/tag were created using the msg ${params[0]}.`;
		break;

		case ERR_NO_VERSION:
			msg = `You must specify a version.`;
		break;
		
		case ERR_SAME_VERSION:
			msg = `It's needed to update the version for each publish. Actual is ${params[0]}.`;
		break;

		case ERR_WRONG_BRANCH:
			msg = `You're in the wrong branch. You must be in the ${DEFAULT_BRANCH} branch to be able to publish.`;
		break;

		case ERR_LOWER_VERSION:
			msg = `You cannot downgrade the version. Please use a higher version then the actual one (${params[0]}).`;
		break;
		
		case ERR_NO_VERSION_ON_JSON:
			msg = `No key 'version' found on package.json. Please fix it before publishing.`;
		break;

		case ERR_UNCOMMITTED_CHANGES:
			msg = `You have uncommitted changes in the working branch. Please commit or stash them before publishing.`;
		break;
		
		case ERR_CANT_OPEN_PACKAGE_JSON:
			msg = `Could not open package.json. Do you even have one?`;
		break;

		case ERR_VERSION_NOT_SEMVER_COMPLIANT:
			msg = `The specified version (${params[0]}) is not SemVer compliant.`;
		break;
		
		default:
			msg = `An unknow error happened.`;
		break;
	}

	console.error(msg);
	process.exit();
}