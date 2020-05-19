# Node.js boilerplate

[![branch develop](https://img.shields.io/badge/branch-develop-blue.svg)]()
[![version](https://img.shields.io/badge/version-0.0.1-blue.svg)](./package.json)
[![linting](https://img.shields.io/badge/code_style-xo-brightgreen.svg)](https://github.com/xojs/xo)

A blue/green demo testing with an Nginx reverse proxy.

## Install

```sh
npm i
```

## Run

```sh
npm start
```

## Release

```sh
npm run release minor
```

> Note: the package.json "release" script entry uses a syntax trick I want to clarify here. In fact we rely on `npm --no-git-tag-version version <major|minor|patch>`, and npm just append the last CLI parameter to the above command.

## Coverage

```sh
npm run test
browse ./coverage/lcov-report/index.html
```
