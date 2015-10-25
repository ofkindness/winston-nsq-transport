winston-nsq-transport
=================

Winston NSQ transport. Uses official NSQ client library (nsqjs).

## Installation

  - Latest release:

    $ npm install winston-nsq-transport


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

## AUTHORS

[AUTHORS](https://github.com/nololabout/winston-pg-native/blob/master/AUTHORS)

## LICENSE

MIT