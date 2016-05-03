clean-repos-dir
---------------

[![Build Status](https://travis-ci.org/pine/clean-repos-dir.svg?branch=master)](https://travis-ci.org/pine/clean-repos-dir)
[![Dependency Status](https://david-dm.org/pine/clean-repos-dir.svg)](https://david-dm.org/pine/clean-repos-dir)
[![devDependency Status](https://david-dm.org/pine/clean-repos-dir/dev-status.svg)](https://david-dm.org/pine/clean-repos-dir#info=devDependencies)

This is a private tool that is able to keep clean state  my repositories directory.

## Install

```
$ npm install -g git+https://github.com/pine/clean-repos-dir.git
```

## Usage

```
$ clean-repos-dir --help

  Usage: clean-repos-dir [options]

  Options:

    -h, --help         output usage information
    -V, --version      output the version number
    -d, --depth <n>    Set a depth that it searchs files [3]
    -e, --elapsed <n>  Set a elapsed time by milliseconds [14 days]

$ clean-repos-dir
Starting: depth = 3, elapsed = 12096000000
Searching: depth = 0
Skip: node_modules
Searching: depth = 1
Searching: depth = 2
Searching: depth = 3
```

## License
MIT License
