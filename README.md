# tsutil [![NPM Version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Code Coverage][coveralls-image]][coveralls-url]

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

## Documentation

The code is documented via TypeDoc [here][doc]

## Contributing

Feel free to fork and submit pull requests for the code. Please follow the
existing code as an example of style and make sure that all your code passes
lint and test. For a sanity check

```sh
git clone git@github.com:Asana/tsutil.git
cd tsutil
npm install
npm test
```

[npm-url]: https://www.npmjs.org/package/tsutil
[npm-image]: http://img.shields.io/npm/v/tsutil.svg?style=flat-square

[travis-url]: http://travis-ci.org/Asana/tsutil
[travis-image]: http://img.shields.io/travis/Asana/tsutil.svg?style=flat-square

[coveralls-url]: https://coveralls.io/r/Asana/tsutil
[coveralls-image]: https://img.shields.io/coveralls/Asana/tsutil/master.svg?style=flat-square

[doc]: http://asana.github.io/tsutil
