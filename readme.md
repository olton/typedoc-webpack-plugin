# Typedoc-Webpack-Plugin

This is a plugin for the Webpack5 (+) build system that will run Typedoc in order to generate API documentation.

[![npm version](https://img.shields.io/npm/v/@olton/typedoc-webpack-plugin.svg?color=brightgreen)](https://www.npmjs.com/package/@olton/typedoc-webpack-plugin)
[![Downloads](https://img.shields.io/npm/dm/@olton/typedoc-webpack-plugin.svg)](https://www.npmjs.com/package/@olton/typedoc-webpack-plugin)

<hr>

## Installation

Run the following command inside your project directory to install:
```bash
npm install @olton/typedoc-webpack-plugin --save-dev
```

__Note:__ Typedoc is required as peer dependency.

To install Typedoc, run the following command inside your project directory:
```bash
npm install typedoc --save-dev
```


## Usage

To use, add a require for the module to the Webpack Configuration file, and then place into the plugin section:

```
var TypedocWebpackPlugin = require('@olton/typedoc-webpack-plugin');

...

plugins: [
	new TypedocWebpackPlugin({})
]
```


The options for the plugin mirror the options that are passed to typedoc. Refer to https://github.com/TypeStrong/typedoc for full options.

The default options that are set by the plugin are:

```
{
    out: "docs",
    entryPoints: ["./src/**/*.ts"],
    tsconfig: "tsconfig.json",
    compilerOptions: {}
}
```

You can pass either absolute or relative paths as the configuration parameter out. The default output path of the docs is relative to the output path specified in the webpack configuration. For example:

```
output: {
	path: './target/',
}
```

With the default configuration, the above example would produce the docs under the following path: ./target/docs.

Relative paths can also be specified as the out parameter. For example out: '../docs', would produce the docs under the following path: ./docs.

Output to a json file is also supported by setting the 'json' property instead of the 'out' property in your configuration. For example:

```
plugins: [
	new TypedocWebpackPlugin({
		name: 'Contoso',
		json: './docs.json'
	})
]
```

__Input__

Specifying input for the plugin can be done in multiple ways

Single file or directory:
```
new TypedocWebpackPlugin({}, './src')
```

Array of files or directories:
```
new TypedocWebpackPlugin({}, ['./src', './other'])
```

Or this parameter can be left blank, in which case all .ts files in project root directory will be used as input
```
new TypedocWebpackPlugin({})
```

2023 © Copyright by [Serhii Pimenov](https://pimenov.com.ua). All Rights Reserved. Created by Serhii Pimenov.