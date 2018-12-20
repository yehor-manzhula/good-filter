# good-filter

`good-filter` is a transform stream useful for filtering [good](https://github.com/hapijs/good) server events based on given conditions.
[![Current Version](https://img.shields.io/npm/v/good-filter.svg)](https://www.npmjs.com/package/good-filter)

Maintainer: [Yehor Manzhula][author-github]

## Usage

## `new GoodFilter([config])`
Creates a new GoodFilter object with the following arguments:

    - `[config]` - optional configuration object with the following keys **by default**
    - `response` - filter for response event 
    - `error` - filter for error event
    - `log` - filter for log event
    - `opts` - filter for opts event

In manifest.js

```javascript
    const GoodFilter = require('good-filter');

    module.exports = {
        // ...
        register: {
            plugins: {
                // ...
                plugin: 'good',
                options: {
                    reporters: {
                        consoleReporter: [
                            new GoodFilter({
                                    log: '*',
                                    error: '*',
                                    response: {
                                        include: '*',
                                        exclude: {
                                            route: /\/swaggerui\/.*/
                                        }
                                    }
                                }), 
                            new GoodFormat(),
                            'stdout']
                    } 
                }
                // ...
            }
        }
    };
```
## Usage

[author-github]: <https://github.com/yehor-manzhula>