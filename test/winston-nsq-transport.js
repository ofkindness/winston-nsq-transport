/**
 * @module 'winston-nsq-transport-test'
 * @fileoverview Tests of winston transport for logging with NSQ
 * @license MIT
 * @author Andrei Tretyakov <andrei.tretyakov@gmail.com>
 */
const assert = require('assert');
const nsqjs = require('nsqjs');
const vows = require('vows');
const winston = require('winston');

const NSQTransport = require('./../lib/winston-nsq-transport');

const nsqdHost = process.env.NSQ_SERVER_PORT_4150_TCP_ADDR || '127.0.0.1';
const nsqdPort = process.env.NSQ_SERVER_PORT_4150_TCP_PORT || '4150';

const logger = new (winston.Logger)({
  transports: [
    new (NSQTransport)({
      topic: 'winston_logs',
      nsqdHost,
      nsqdPort
    })
  ]
});

const reader = new nsqjs.Reader('winston_logs', 'logs', {
  nsqdTCPAddresses: `${nsqdHost}:${nsqdPort}`
});

reader.connect();

reader.on('nsqd_closed', () => {
  process.exit(0);
});

logger.log('info', 'message', { foo: 'bar' });

vows
  .describe('winston-nsq-transport')
  .addBatch({
    'log info message with meta object': {
      topic: function topic() {
        const self = this;

        reader.on('message', (msg) => {
          msg.finish();
          self.callback(null, msg.json());
          reader.close();
        });

        reader.on('error', (err) => {
          self.callback(err);
        });
      },
      /* eslint no-unused-vars: 0 */
      'Should pass no err': (err, data) => {
        assert.equal(err, null, 'Should have no err');
      },
      'Should pass level info': (err, data) => {
        assert.equal(data.level, 'info', 'Should pass level info');
      },
      'Should pass message': (err, data) => {
        assert.equal(data.message, 'message', 'Should pass level info');
      },
      'Should pass meta object': (err, data) => {
        assert.isObject(data.meta, 'Should have no err');
      }
    }
  })
  .export(module);
