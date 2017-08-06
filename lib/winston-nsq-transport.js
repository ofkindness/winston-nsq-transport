'use strict';

var nsqjs = require('nsqjs');
var util = require('util');
var winston = require('winston');

var Nsq = winston.transports.Nsq = function(options) {
  //
  // Name this logger
  //
  this.name = 'Nsq';
  //
  // Set the level from your options
  //
  this.level = options.level || 'info';

  //
  // Configure your storage backing as you see fit
  //
  options.nsqdHost = options.nsqdHost || '127.0.0.1';
  options.nsqdPort = options.nsqdPort || 4150;
  options.nsqOptions = options.nsqOptions || {
    clientId: 'winston-nsq-transport'
  };

  this.topic = options.topic || 'winston_logs';

  this.writer = new nsqjs.Writer(options.nsqdHost, options.nsqdPort, options.nsqOptions);
  this.writer.connect();

};

//
// Inherit from `winston.Transport` so you can take advantage
// of the base functionality and `.handleExceptions()`.
//
util.inherits(Nsq, winston.Transport);

Nsq.prototype.name = 'Nsq';

Nsq.prototype.log = function(level, msg, meta, callback) {
  var self = this;
  var data = {
    level: level,
    message: msg,
    meta: meta instanceof Array ? JSON.stringify(meta) : meta
  };
  //
  // Store this message and metadata, maybe use some custom logic
  // then callback indicating success.
  //
  this.writer.publish(this.topic, data, function(err) {
    // executing statement, emit error if failed.
    if (err) {
      self.emit('error', err);
      return callback(err);
    }
    // acknowledge successful logging event
    self.emit('logged');
    return callback(null, true);
  });
};

module.exports = winston.transports.Nsq = Nsq;
