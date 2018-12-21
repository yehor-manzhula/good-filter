# good-filter

`good-filter` is a transform stream useful for filtering [good](https://github.com/hapijs/good) server events based on given conditions.
[![Current Version](https://img.shields.io/npm/v/good-filter.svg)](https://www.npmjs.com/package/good-filter)

Maintainer: [Yehor Manzhula][author-github]

## Usage

## `new GoodFilter([config])`
Creates a new GoodFilter object with the following arguments:

    - `[config]` - optional configuration object with the following keys
    - `response` - filter for response event 
    - `error` - filter for error event
    - `log` - filter for log event
    - `opts` - filter for opts event

**Notice: By default good filter filters out all the events to allow event * sign should be used**

In manifest.js

```javascript
    const GoodFilter = require('good-filter');
    
    // Another one awesome plugin you definitely need to try
    const GoodFormat = require('good-format');

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
                                    log: '*',   // Allow all log events
                                    error: '*', // Allow all error events
                                    response: {
                                        include: '*', 
                                        exclude: {
                                            route: /\/swaggerui\/.*/ // Route property should match regexp
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

## Customization

#### Matchers
good-filter supports few types of matcher values

    - String - Property value should be equal to matcher value, * sign is used to match any value
    - RegExp - Property value should match given RegExp using .match method
    - Function - Function to be invoked with property value
    - Array - Each array value is a separate matcher, under the hood OR logical operator is used, that mean that all of matchers should pass to pass the filter 

#### String

```javascript
    const GoodFilter = require('good-filter');
    
    // Another one awesome plugin you definitely need to try
    const GoodFormat = require('good-format');

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
                                log: '*', // Allow all log events
                                error: '*', // Allow all error events
                                response: {
                                    include: '*', // Include all responses
                                    exclude: {
                                        method: 'OPTIONS' // Exclude responses for OPTIONS method
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

### RegExp

```javascript
    const GoodFilter = require('good-filter');

    // Another one awesome plugin you definitely need to try
    const GoodFormat = require('good-format'); 

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
                                        route: /\/swaggerui\/.*/ // Exclude swaggerui routes
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

### Function

```javascript
    const GoodFilter = require('good-filter');

    // Another one awesome plugin you definitely need to try
    const GoodFormat = require('good-format'); 

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
                                        method: method => ['OPTIONS', 'DELETE'].includes(method); // Exclude OPTIONS and DELETE method
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

### Array values
```javascript
    const GoodFilter = require('good-filter');

    // Another one awesome plugin you definitely need to try
    const GoodFormat = require('good-format'); 

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
                                        method: ['OPTIONS', 'DELETE']
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

### Array of matchers
```javascript
    const GoodFilter = require('good-filter');

    // Another one awesome plugin you definitely need to try
    const GoodFormat = require('good-format'); 

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
                                    exclude: [{
                                        method: method => ['OPTIONS', 'DELETE'].includes(method); // Exclude OPTIONS and DELETE method

                                        // Works as AND logical operator
                                        route: '/health'    
                                    }, 
                                    // Works as OR operator
                                    {
                                        route: '/test'
                                    }]
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

[author-github]: <https://github.com/yehor-manzhula>