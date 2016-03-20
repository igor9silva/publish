#!/usr/bin/env node --harmony
"use strict";

/* Dependencies */
const cli 		= require('cli');
const fs		= require('fs');
const semver	= require('semver');
const msgs		= require('./src/msgs');
const error		= require('./src/error')(cli);
const git 		= require('simple-git')();
const prompter	= require('keypress-prompt');
const spawn		= require('child_process').spawn;

/* Defaults */
const DEFAULT_BRANCH = 'master';
const DEFAULT_REMOTE = 'origin';
const PACKAGE_PATH	 = 'package.json';
const TEMP_CHANGELOG = '.git/CHANGELOG_EDITMSG';

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
	force: 		['f', msgs.help.force,   'bool',   false],
});

function generateChangeLog() {
	const msg = "\n[//]: # Please fill in the changelog for that version (markdown). Lines starting" +
				"\n[//]: # with '[//]: #' will be ignored, and an empty file aborts the changelog creation.";

	return new Promise((Resolve, Reject) => {
		const editor = process.env.EDITOR || 'vi';

		fs.writeFile(TEMP_CHANGELOG, msg, (err) => {
			if (err) return Reject();
			const child = spawn(editor, [TEMP_CHANGELOG], { stdio: 'inherit' });
			child.on('exit', () => {
				fs.readFile(TEMP_CHANGELOG, 'UTF-8', (err, content) => {
					if (err) return Reject(err);
					Resolve(content);
				})
			});
		});
	});
}

generateChangeLog().then((content) => {
	const lines = content.split('\n');;

	let res = "";
	for (var line of lines) {
		if (!line.startsWith('[//]: #')) res += '\n' + line;
	}

	console.log(res);
}, (err) => console.log(err));

/* Main Entry */
// cli.main(function(args, options) {
// 	const util = require('./src/util')(options);

// 	// Check arguments and grab version
// 	if (args.length === 0) error.fatal('ERR_NO_VERSION');
// 	if (args.length > 1) error.fatal('ERR_TOO_MANY_ARGS');

// 	fs.readFile(PACKAGE_PATH, 'UTF-8', (err, content) => {
// 		if (err) error.fatal('ERR_CANT_OPEN_PACKAGE_JSON');

// 		// Parse the package.json
// 		const packageJSON = JSON.parse(content);
// 		if (packageJSON.version === undefined) error.fatal('ERR_NO_VERSION_ON_JSON');

// 		const isBump = ['major', 'minor', 'patch'].indexOf(args[0]) > -1;
// 		const version = isBump? semver.inc(packageJSON.version, args[0]) : args[0];

// 		// Check version validity
// 		if (!semver.valid(version)) error.fatal('ERR_VERSION_NOT_SEMVER_COMPLIANT', version);
// 		if (packageJSON.version === version) error.fatal('ERR_SAME_VERSION', packageJSON.version);
// 		if (semver.lt(version, packageJSON.version)) error.fatal('ERR_LOWER_VERSION', packageJSON.version);

// 		// Asks if the user is sure about what he is doing
// 		prompter.prompt(util.replace(msgs.prompt.areYouSure, [packageJSON.version, version]), ['y', 'n']).then(r => {
// 			if (r === 'n') process.exit(0);


// 			git.status((err, status) => {
// 				if (err) error.fatal('ERR_GIT');
// 				if (!status.isClean() && !options.force) error.fatal('ERR_UNCOMMITTED_CHANGES');

// 				const branch = status.current;
// 				const mustBeBranch = (packageJSON.publish && packageJSON.publish.branch) || DEFAULT_BRANCH;
// 				const remote = (packageJSON.publish && packageJSON.publish.remote) || DEFAULT_REMOTE;

// 				if (branch !== mustBeBranch && !options.force) error.fatal('ERR_WRONG_BRANCH', mustBeBranch);
			
// 				// Has passed every validation, now, just do it
// 				packageJSON.version = version;
// 				fs.writeFile(PACKAGE_PATH, JSON.stringify(packageJSON, null, 2) + '\n', (err) => {
// 					if (err) error.fatal();

// 					const msg  = util.replace(options.message, version);
// 					const tag  = util.replace(options.tag, version);
// 					const handler = err => { err && error.fatal('ERR_GIT_PUSH', msg); };

// 					let lastMsg;
// 					const setMsg 	= (msg) => { cli.spinner(`${msg}...`); lastMsg = msg; };
// 					const doneLast 	= (   ) => { lastMsg && cli.spinner(`${lastMsg} ${util.green('✓')}`, true); };
// 					const updtMsg	= (msg) => { doneLast(); setMsg(msg); };

// 					git
// 					.add([PACKAGE_PATH])				.then(() => updtMsg(msgs.success.add))
// 					.commit(msg, handler)				.then(() => updtMsg(msgs.success.commit))
// 					.addAnnotatedTag(tag, msg, handler)	.then(() => updtMsg(msgs.success.tag))
// 					.push(remote, branch, handler)		.then(() => updtMsg(msgs.success.push))
// 					.pushTags(remote, handler)			.then(() => updtMsg(msgs.success.pushTag))
// 					.then(() => {
// 						doneLast();
// 						const txt = util.green(msgs.success.end);
// 						console.log(util.replace(txt, version));
// 						process.exit(0);
// 					}); // git

// 				}); // write file

// 			}); // git status

// 		}); // prompt

// 	}); // readfile

// }); // main