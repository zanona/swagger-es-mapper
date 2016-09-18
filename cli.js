#!/usr/bin/env node
'use strict';
const path = require('path'),
      map = require('./'),
      args = process.argv.splice(2),
      throughPipe = !process.stdin.isTTY;

function run(schema, model) {
  if (schema.definitions) {
    console.log(JSON.stringify(map(schema.definitions, model), null, 2));
  } else {
    console.error('definitions not found in schema');
  }
}

if (throughPipe) {
  let input = '';
  process.stdin.setEncoding('utf8');
  process.stdin.on('readable', function () {
    const chunk = process.stdin.read();
    if (chunk !== null) { input += chunk; }
  });
  process.stdin.on('end', () => run(JSON.parse(input), args[0]));
} else {
  run(require(path.resolve(args[0]), args[1]));
}

