'use strict';

var winston = require('winston');
require(__dirname + '/../lib/winston-nsq-transport');

var logger = new(winston.Logger)({
  transports: [
    new(winston.transports.Nsq)({
      nsqdHost: (process.env.NSQ_SERVER_PORT_4150_TCP_ADDR || '127.0.0.1'),
      nsqdPort: (process.env.NSQ_SERVER_PORT_4150_TCP_PORT || 4150),
      topic: 'test',
      level: 'info'
    })
  ]
});

var nsqjs = require('nsqjs');

var reader = new nsqjs.Reader('test', 'test', {
  nsqdTCPAddresses: ((process.env.NSQ_SERVER_PORT_4150_TCP_ADDR || '127.0.0.1') + ':' + (process.env.NSQ_SERVER_PORT_4150_TCP_PORT || 4150))
});

reader.connect();

reader.on('nsqd_closed', function() {
  process.exit(0);
})

var vows = require('vows'),
  assert = require('assert');

logger.log('info', 'message', {});

vows
  .describe('winston-nsq-transport')
  .addBatch({
    'log info message with meta object': {
      topic: function() {
        var self = this;

        reader.on('message', function(msg) {
          msg.finish()
          self.callback(null, msg.json());
          reader.close();
        });

        reader.on('error', function(err) {
          self.callback(err);
        });
      },
      'Should pass no err': function(err, data) {
        assert.equal(err, null, 'Should have no err');
      },
      'Should pass level info': function(err, data) {
        assert.equal(data.level, 'info', 'Should pass level info');
      },
      'Should pass message': function(err, data) {
        assert.equal(data.message, 'message', 'Should pass level info');
      },
      'Should pass meta object': function(err, data) {
        assert.isObject(data.meta, 'Should have no err');
      }
    }
  })
  .export(module);