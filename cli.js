#!/usr/bin/env node
var map = require('./'),
    args = process.argv.splice(2),
    path = require('path'),
    doc = require(path.resolve(args[0]));

if (args[1]) { doc = doc[args[1]]; }
console.log(JSON.stringify(map(doc), null, 2));

