# winston-nsq-transport

[![CircleCI](https://circleci.com/gh/ofkindness/winston-nsq-transport/tree/master.svg?style=svg)](https://circleci.com/gh/ofkindness/winston-nsq-transport/tree/master)
[![NPM version](https://img.shields.io/npm/v/winston-nsq-transport.svg)](https://npmjs.org/package/winston-nsq-transport)
[![Dependency Status](https://david-dm.org/ofkindness/winston-nsq-transport.svg?theme=shields.io)](https://david-dm.org/ofkindness/winston-nsq-transport)
[![NPM Downloads](https://img.shields.io/npm/dm/winston-nsq-transport.svg)](https://npmjs.org/package/winston-nsq-transport)

[Winston](https://www.npmjs.com/package/winston) NSQ transport. Uses official [NSQ](http://nsq.io) client library [nsqjs](https://www.npmjs.com/package/nsqjs).

## Installation

  ```console
    $ npm install winston
    $ npm install winston-nsq-transport
  ```

## Options

* __level:__ The winston's log level, default: "info"
* __nsqdHost:__ A string representing the host of nsqd instance.
* __nsqdPort:__ A string representing the port of nsqd instance.
* __nsqOptions:__ An object representing the nsqjs writer [options](https://github.com/dudleycarr/nsqjs#new-writer)
* __topic:__ A string representing NSQ topic.

See the default values used:

```js
const options = {
  level: 'info',
  nsqdHost: '127.0.0.1',
  nsqdPort: '4150',
  nsqOptions: {
    clientId: 'winston-nsq-transport'
  },
  topic: 'winston_logs'
};
```

## Usage


```js
const winston = require('winston');
const NSQTransport = require('winston-nsq-transport');

const logger = new (winston.Logger)({
  transports: [
    new (NSQTransport)({
      nsqdHost: '127.0.0.1',
      nsqdPort: '4150',
      topic: 'winston_logs',
      level: 'info'
    })
  ]
});

module.exports = logger;
```

## Logging
```js

logger.log('info', 'message', {});

```

## Run Tests

The tests are written in [vows](http://vowsjs.org), and designed to be run with [npm](https://www.npmjs.com).

```console
  $ npm test
```

## LICENSE

[MIT License](http://en.wikipedia.org/wiki/MIT_License)
