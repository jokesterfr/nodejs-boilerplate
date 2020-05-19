# Node.js boilerplate

[![branch develop](https://img.shields.io/badge/branch-develop-blue.svg)]()
[![version](https://img.shields.io/badge/version-0.0.2-blue.svg)](./package.json)
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
npm version minor
npm run release
```

> Note: this release script relies on [git-flow](https://github.com/nvie/gitflow/wiki/Installation).

## Coverage

```sh
npm run test
browse ./coverage/lcov-report/index.html
```
