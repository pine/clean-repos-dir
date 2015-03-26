'use strict';
/*jslint node: true */

var path = require('path');
var fs = require('fs');

var _ = require('lodash');
var async = require('async');
var glob = require('glob-all');
var rimraf = require('rimraf');

var SELF_NODE_MODULES = path.resolve(__dirname, '../node_modules');


function Remover(minDepth, maxDepth, elapsed) {
  this.minDepth = minDepth;
  this.maxDepth = maxDepth;
  this.elapsed = elapsed;
  this.blackList = [];
}

Remover.prototype.removeAll = function (cb) {
  var self = this;
  var count = this.maxDepth - this.minDepth + 1;
  
  async.timesSeries(count, function (n, next) {
    self.removeWithDepth(n - self.minDepth, next);
  }, cb);
};


Remover.prototype.removeWithDepth = function (depth, cb) {
  var self = this;
  var patterns = this.createPatterns(depth);
  console.log('Searching: depth = ' + depth);
  
  glob(patterns, function (err, files) {
    if (err) { return cb(err); }
    self.removeFiles(files, cb);
  });
};


Remover.prototype.removeFiles = function (files, cb) {
  var self = this;
  
  async.eachSeries(files, function (file, done) {
    // 自身の node_modules は除外する
    if (path.resolve(file) === SELF_NODE_MODULES) {
      self.blackList.push(file);
      return done();
    }
    
    // 親ディレクトリが除外されている場合、除外
    var inBlackList = _.some(self.blackList, function (p) {
      return file.indexOf(p) === 0; // startsWith
    });
    
    if (inBlackList) { return done(); }

    // 親ディレクトリの更新時間を調べる
    self.checkTime(file, function (err, isRemove) {
      if (err) {
        return done(err);
      }
      
      if (isRemove) {
        console.log('Removing: ' + file);
        return rimraf(file, done);
      }
      
      console.log('Skip: ' + file);
      self.blackList.push(file);
      return done();
    });
  }, function (err) {
    cb(err);
  });
};


/**
 * 指定された階層のパターンを生成する
 */
Remover.prototype.createPatterns = function (depth) {
  var prefix = '';
  
  for (var i = 0; i < depth; ++i) {
    prefix += '*/';
  }
  
  return [
    prefix + 'node_modules',
    prefix + 'bower_components'
  ];
};


/**
 * 削除するか否か最終更新日を確認する
 */
Remover.prototype.checkTime = function (file, cb) {
  var self = this;
  var parent = path.resolve(file, '..');
  
  fs.stat(parent, function (err, stat) {
    if (err) { return cb(err); }
    
    var now = new Date();
    var mtime = stat.mtime;
    
    return cb(null, now - mtime > self.elapsed);
  });
};


module.exports = Remover;