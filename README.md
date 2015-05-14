<<<<<<< HEAD
# tsutil

[![NPM Version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Coverage][coveralls-image]][coveralls-url]

TypeScript Utility Data Structures.

## DataStructures

- **Optional** A class representing the presence or absence of a value
- **Try** A class representing a value or an error
- **Perishable** An immutable reference that can notify subscribers when it
  becomes stale.

## Installation

Install with npm

```sh
npm install tsutil --save
```

## Contributing

Feel free to fork and submit pull requests for the code. Please follow the
existing code as an example of style and make sure that all your code passes
lint and test. For a sanity check

```sh
git clone git@github.com:Asana/tsutil.git
cd tsutil
=======
# typescript-starter

[![NPM Version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Coverage][coveralls-image]][coveralls-url]

A starter project for TypeScript libraries

## Usage

This repository is meant to be forked and kept as another git remote so future
changes can be merged in. The developer should replace all instances of
`typescript-starter` with their package name and change the appropriate fields
in the `package.json`.

## Commands

The default is to use simple npm scripts instead of `gulp` or `grunt` because
it is easier to understand for new developers and reduces the devDependencies.
The `npm run` supports the following commands.

- **prebundle** Automatically run before `bundle`. Compiles the TypeScript and
  moves the files in source into the current working directory.
- **bundle** Generates a master dts file for the package from `index.d.ts`.
- **clean** Removes `build`, `coverage`, and artifacts from `bundle`.
- **precompile** Automatically run before `compile`. Runs `clean`.
- **compile** Compiles the TypeScript.
- **coveralls** Sends code coverage information to Coveralls.
- **prelint** Automatically run before `lint`. Runs `compile` with `sourceMaps` 
  this is both for `test` and to make sure any custom lint rules will be
  compiled.
- **lint** Runs `tslint` on all of the files.
- **pretest** Automatically run before `test`. Runs `lint` and modifies the
  compiled JavaScript for sourcemap support and coverage.
- **test** Runs mocha with istanbul code coverage. Set `$MOCHA_REPORTER` to
  override which reporter is used in tests.
- **posttest** Automatically run after `test`. Checks the code coverage and will
  fail if the code coverage is not sufficient.
- **typings** Installs the type definitions.

## Contributing

Feel free to fork and submit pull requests for the configuration. For a sanity
check:

```sh
git clone git@github.com:Asana/typescript-starter.git
cd typescript-starter
>>>>>>> 059ef000252e380f5517478b89cea6edbc8bb0f2
npm install
npm run typings
npm test
```

<<<<<<< HEAD
[npm-url]: https://www.npmjs.org/package/tsutil
[npm-image]: http://img.shields.io/npm/v/tsutil.svg?style=flat-square

[travis-url]: http://travis-ci.org/Asana/tsutil
[travis-image]: http://img.shields.io/travis/Asana/tsutil.svg?style=flat-square

[coveralls-url]: https://coveralls.io/r/Asana/tsutil
[coveralls-image]: https://img.shields.io/coveralls/Asana/tsutil/master.svg?style=flat-square
=======
[npm-url]: https://www.npmjs.org/package/typescript-starter
[npm-image]: http://img.shields.io/npm/v/typescript-starter.svg?style=flat-square

[travis-url]: http://travis-ci.org/Asana/typescript-starter
[travis-image]: http://img.shields.io/travis/Asana/typescript-starter.svg?style=flat-square

[coveralls-url]: https://coveralls.io/r/Asana/typescript-starter
[coveralls-image]: https://img.shields.io/coveralls/Asana/typescript-starter/master.svg?style=flat-square
>>>>>>> 059ef000252e380f5517478b89cea6edbc8bb0f2
