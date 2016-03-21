# Publish

<p align="center">
<i>Simple Command-Line Interface to automatically bump version and push tags.</i>
</p>
<p align="center">
    <img src="https://raw.githubusercontent.com/igor9silva/publish/master/media/demo.gif" alt="demo"/>
</p>

## Installation

Globally using `npm` (requires node `v5+`)
```bash
npm install -g publish-cli
```

## Usage

Inside a git repository, do:

```bash
publish <version|bumplevel> [options]
```

Examples:

```bash
publish 1.2.3 # explicitly sets version to v1.2.3
```

```bash
publish patch # bumps from v1.2.3 to v1.2.4
```

```bash
publish minor # bumps from v1.2.3 to v1.3.0
```

```bash
publish major # bumps from v1.2.3 to v2.0.0
```

Options:

|  Command  | Shortcut |                                                          Usage                                                         | Default |
|:---------:|:--------:|:----------------------------------------------------------------------------------------------------------------------:|:-------:|
|   --tag   |    -t    | The tag name. Use `%@` to output version. E.g. `publish 1.1.9 -t "%@-beta"` will create a tag called '1.1.9-beta'.     |  `v%@`  |
| --message |    -m    | The commit/tag message. Use `%@` to output version. E.g. `publish 1.1.9 -m "Build v%@"` will commit as 'Build v1.1.9'. |  `v%@`  |
|  --force  |    -f    | Force the commit and tag creation even if in the wrong branch and/or have uncommited changes.                          |  false  |

If your default branch isn't `master` and/or your remote isn't called `origin`, you can override it on `package.json`, under the `publish` key:
```json
{
  "name": "publish-demo",
  "version": "1.5.3",
  "publish": {
    "branch": "other-than-master",
    "remote": "not-origin"
  }
}
```

## Contributing

1. Fork it!
2. Create your feature branch: `git checkout -b my-new-feature`
3. Commit your changes: `git commit -am 'Add some feature'`
4. Push to the branch: `git push origin my-new-feature`
5. Submit a pull request 😁

## Licensing

This project is under the [JLMK License](https://github.com/igor9silva/JLMK-License), which means you can do whatever you want with the code, **J**ust **L**et **M**e **K**now.

For the full license check out the `LICENSE` file.