'use strict';
/*jslint node: true */

var path = require('path');
var commander = require('commander');

var Remover = require('./remover');
var pkg = require('../package.json');

var SELF_NODE_MODULES = path.resolve(__dirname, '../node_modules');

exports.execute = function (maxDepth, elapsed) {
  console.log('Starting: depth = ' + maxDepth + ', elapsed = ' + elapsed);
  
  var minDepth = 0;
  var remover = new Remover(minDepth, maxDepth, elapsed);
  remover.removeAll(function (err) {
    if (err) { console.error(err); }
  });
};

var parseDecimal = function (x) { return parseInt(x, 10); };

exports.parser = commander
  .version(pkg.version)
  .usage('[options]')
  .option(
    '-d, --depth <n>',
    'Set a depth that it searchs files [3]',
    parseDecimal, 3)
  .option(
    '-e, --elapsed <n>',
    'Set a elapsed time by milliseconds [14 days]',
    parseDecimal, 14 * 24 * 60 * 60 * 10000);
