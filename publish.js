#!/usr/bin/env node --harmony
"use strict";

/* Dependencies */
const cli 		= require('cli');
const fs		= require('fs');
const semver	= require('semver');
const git 		= require('simple-git')();
const prompter	= require('keypress-prompt');
const error		= require('./error')(cli);
const msgs		= require('./msgs');
const util		= require('./util');

/* Defaults */
const DEFAULT_BRANCH = 'master';
const DEFAULT_REMOTE = 'origin';
const DEFAULT_ERROR  = 'ERR_UNKNOWN';
const PACKAGE_PATH	 = 'package.json';

/* Enable CLI plugins */
cli.enable('help', 'version', 'status')

/* Point package.json so CLI can grab name and version */
.setApp('./package.json')

/* Set usage string */
.setUsage(msgs.usage);

/* Set the available options */
cli.parse({
	tag: 		['t', msgs.help.tag, 	 'string', 'v%@'],
	message: 	['m', msgs.help.message, 'string', 'Publish v%@'],
	force: 		['f', msgs.help.force,   'true',   false],
});

/* Main Entry */
cli.main(function(args, options) {

	// Check arguments and grab version
	if (args.length === 0) error.fatal('ERR_NO_VERSION');
	if (args.length > 1) error.fatal('ERR_TOO_MANY_ARGS');
	const version = args[0];

	// Check version validity
	if (!semver.valid(version)) error.fatal('ERR_VERSION_NOT_SEMVER_COMPLIANT', version);

	fs.readFile(PACKAGE_PATH, (err, content) => {
		if (err) error.fatal('ERR_CANT_OPEN_PACKAGE_JSON');

		// Parse the package.json
		const packageJSON = JSON.parse(content);
		if (packageJSON.version === undefined) error.fatal('ERR_NO_VERSION_ON_JSON');
		if (packageJSON.version === version) error.fatal('ERR_SAME_VERSION', packageJSON.version);
		if (semver.lt(version, packageJSON.version)) error.fatal('ERR_LOWER_VERSION', packageJSON.version);

		// Asks if the user is sure about what he is doing
		prompter.prompt(util.replace(msgs.prompt.areYouSure, [packageJSON.version, version]), ['y', 'n']).then(r => {
			if (r === 'n') return process.exit();

			git.status((err, status) => {
				if (err) error.fatal('ERR_GIT');
				if (!status.isClean()) error.fatal('ERR_UNCOMMITTED_CHANGES');
				if (status.current !== DEFAULT_BRANCH) error.fatal('ERR_WRONG_BRANCH', DEFAULT_BRANCH); 
			
				// Has passed every validation, now, just do it
				packageJSON.version = version;
				fs.writeFile(PACKAGE_PATH, JSON.stringify(packageJSON, null, 2) + '\n', (err) => {
					if (err) error.fatal();

					const msg  = util.replace(options.message, version);
					const tag  = util.replace(options.tag, version);
					const handler = err => { err && error.fatal('ERR_GIT_PUSH', msg); };

					git
					.add([PACKAGE_PATH])
					.commit(msg, handler)
					.addAnnotatedTag(tag, msg, handler)
					.push(DEFAULT_REMOTE, DEFAULT_BRANCH, handler)
					.pushTags(DEFAULT_REMOTE, handler)
					.then(() => {
						console.log(util.replace(msgs.success, version));
						process.exit(0);
					}); // git 

				}); // write file

			}); // git status

		}); // promtp

	}); // readfile

}); // main