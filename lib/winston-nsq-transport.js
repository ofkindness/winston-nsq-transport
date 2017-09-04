/**
 * @module 'winston-nsq-transport'
 * @fileoverview Winston transport for logging with NSQ
 * @license MIT
 * @author Andrei Tretyakov <andrei.tretyakov@gmail.com>
 */

const circularJSON = require('circular-json');
const nsqjs = require('nsqjs');
const winston = require('winston');

/**
 * Class for the NSQ transport object.
 * @class
 * @param {Object} options
 * @param {String} [options.level=info] - Level of messages that this transport
 * should log.
 * @param {Boolean} [options.silent=false] - Boolean flag indicating whether to
 * suppress output.
 * @param {String} [options.nsqdHost='127.0.0.1'] - NSQ service host
 * @param {String} [options.nsqdPort=4150] - NSQ service port
 * @param {Object} [options.nsqOptions={ clientId: 'winston-nsq-transport' }] - NSQ options
 * @param {String} [options.topic='winston_logs'] - name of NSQ topic
 * @param {String} [options.name] - Transport instance identifier. Useful if you
 * need to create multiple Postgres transports.
 */
class NSQ extends winston.Transport {
  constructor(options = {}) {
    super();

    const { level, name, topic } = options;
    let { nsqdHost, nsqOptions, nsqdPort } = options;
    //
    // Name this logger
    //
    this.name = name || 'NSQ';
    //
    // Set the level from your options
    //
    this.level = level || 'info';

    this.topic = topic || 'winston_logs';
    //
    // Configure your storage backing as you see fit
    //
    nsqdHost = nsqdHost || '127.0.0.1';
    nsqdPort = nsqdPort || 4150;
    nsqOptions = nsqOptions || {
      clientId: 'winston-nsq-transport'
    };

    this.writer = new nsqjs.Writer(nsqdHost, nsqdPort, nsqOptions);
    this.writer.connect();
  }

  /**
   * Core logging method exposed to Winston. Metadata is optional.
   * @param {string} level Level at which to log the message.
   * @param {string} msg Message to log
   * @param {Object=} meta Metadata to log
   * @param {Function} callback Continuation to respond to when complete.
   */
  log(...args) {
    const level = args.shift() || this.level;
    const message = args.shift() || '';
    let meta = args.shift();
    let callback = args.shift();

    if (typeof meta === 'function') {
      callback = meta;
      meta = {};
    }

    const self = this;
    const data = {
      level,
      message,
      meta: circularJSON.stringify(meta)
    };
    //
    // Store this message and metadata, maybe use some custom logic
    // then callback indicating success.
    //
    this.writer.publish(this.topic, data, (err) => {
      // executing statement, emit error if failed.
      if (err) {
        self.emit('error', err);
        return callback(err);
      }
      // acknowledge successful logging event
      self.emit('logged');
      return callback(null, true);
    });
  }
}

module.exports = NSQ;
