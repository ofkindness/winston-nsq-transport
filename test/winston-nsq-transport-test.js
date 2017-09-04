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

const helpers = require('./../node_modules/winston/test/helpers');
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

reader.on('message', (msg) => {
  msg.finish();
  reader.close();
});

reader.on('error', (err) => {
  throw err;
});

const transport = logger.transports.NSQ;

vows
  .describe('winston-nsq-transport')
  .addBatch({
    'An instance of the NSQ Transport': {
      topic: logger,
      'when passed valid options': {
        'should have the proper methods defined': () => {
          assert.isFunction(transport.log);
        }
      },
      'the log() method': helpers.testNpmLevels(transport,
        'should respond with true', (ign, err, logged) => {
          assert.isNull(err);
          assert.isNotNull(logged);
        }
      )
    }
  }).export(module);
