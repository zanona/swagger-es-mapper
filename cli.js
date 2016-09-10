#!/usr/bin/env node
var map = require('./'),
    args = process.argv.splice(2),
    schema = require(require('path').resolve(args[0])),
    path = args[1];

//if (path) path.split(/[\[\]\.]/).filter((p) => p).forEach((p) => doc = doc[p]);
if (schema.definitions) {
  console.log(JSON.stringify(map(schema.definitions, path), null, 2));
} else {
  console.error('definitions not found in schema');
}

