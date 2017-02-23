# winston-nsq-transport
[![NPM version](https://img.shields.io/npm/v/winston-nsq-transport.svg)](https://npmjs.org/package/winston-nsq-transport)
[![Dependency Status](https://david-dm.org/ofkindness/winston-nsq-transport.svg?theme=shields.io)](https://david-dm.org/ofkindness/winston-nsq-transport)
[![NPM Downloads](https://img.shields.io/npm/dm/winston-nsq-transport.svg)](https://npmjs.org/package/winston-nsq-transport)

Winston NSQ transport. Uses official NSQ client library (nsqjs).

## Installation

  - Latest release:

  ``` bash
  $ npm install winston-nsq-transport
  ```


## Options

* __nsqdHost:__ A string representing the host of nsqd instance.
* __nsqdPort:__ A string representing the port of nsqd instance.
* __topic:__ A string representing the topic.
* __level:__ The winston's log level, default: "info"

See the default values used:

``` js
var options = {
  nsqdHost: '127.0.0.1',
  nsqdPort: 4150,
  topic: 'winston_logs',
  level: 'info'
};
```

## Usage


``` js
'use strict';

var winston = require("winston");
require("winston-nsq-transport");

var logger = new(winston.Logger)({
  transports: [
    new(winston.transports.Nsq)({
      nsqdHost: '127.0.0.1',
      nsqdPort: 4150,
      topic: 'winston_logs',
      level: 'info'
    })
  ]
});

module.exports = logger;
```


``` js

logger.log('info', 'message', {});

```

## Run Tests

The tests are written in [vows](http://vowsjs.org), and designed to be run with npm.

``` bash
  $ npm test
```

## LICENSE

[MIT License](http://en.wikipedia.org/wiki/MIT_License)
