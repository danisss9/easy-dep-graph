# Easy Dep Graph

Easily see the dependency graph of your npm project!

## Table of Contents

- [Easy Dep Graph](#easy-dep-graph)
  - [Table of Contents](#table-of-contents)
  - [Install](#install)
  - [Use](#use)
  - [Arguments](#arguments)
    - [Packages](#packages)
    - [Package Dependents](#package-dependents)
    - [Port](#port)
    - [No Open](#no-open)
  - [Changelog](#changelog)
  - [FAQs](#faqs)

## Install

```cmd
npm install -g easy-dep-graph
```

## Use

Run the following command on the folder where you package.json is:

```cmd
npx easy-dep-graph
```

## Arguments

### Packages

A list of packages to show on the graph separated by ','. (By default it shows all packages)

Command: `--packages <packages names>` 

Example:
```cmd
npx easy-dep-graph --packages open,mustache,fastify
```

### Package Dependents

This option will only show on graph the packages that depend on the submited package.

Command: `--package-dependents <package name>` 

Example:
```cmd
npx easy-dep-graph --package-dependents is-docker
```

### Port

The port number to be used when serving the dependency graph. (Default is 8080)

Command: `--port <port number>` 

Example:
```cmd
npx easy-dep-graph --port 8000
```

### No Open

Flag to not open the browser after the depedency graph is done.

Command: `--no-open` 

Example:
```cmd
npx easy-dep-graph --no-open
```

## Changelog

**Version 1.0:**

- published library

## FAQs

No FAQs for now. (⌐■_■)
