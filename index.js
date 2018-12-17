const {isArray, isPlainObject, defaults} = require('lodash');
const Stream = require('stream');
const Hoek = require('hoek');

const matcher = require('./matcher');

const internals = {
    defaults: {},

    utils: {
        normalize(config) {
            return Object.keys(config || {})
                .reduce((result, key) => {
                    const value = normalizeValue(config[key]);

                    result[key] = defaults(isArray(value) ? {
                        include: value
                    } : value, {
                        include: [],
                        exclude: []
                    });

                    return result;
                }, {});

            function normalizeValue(value) {
                if (isArray(value)) {
                    return value;
                }
                
                if (isPlainObject(value)) {
                    return Object.keys(value).reduce((result, key) => {
                        const _value = normalizeValue(value[key]);
                        result[key] = isArray(_value) ? _value : [_value];
    
                        return result;
                    }, {});
                }
                
                return [value];
            }
        }
    }
};

class GoodFilter extends Stream.Transform {

    constructor(config) {
        super({objectMode: true});

        config = internals.utils.normalize(config || {});
        this._settings = Hoek.applyToDefaults(internals.defaults, config);
    }

    _transform(data, enc, next) {
        try {   
            if (this._filter(data)) {
                return next(null, data);
            }
        } catch (e) {
            console.error('good-filter filter data error', e);
            return next(null, data);
        }

        return next(null, null);
    }

    _filter(data) {
        const eventFilter = this._settings[data.event];

        /**
         * By default filter out all not specified events
         */  
        if (!eventFilter) {
            return eventFilter;
        }

        const matchWith = event => matcher(event, data);

        return eventFilter.include.some(matchWith) && !eventFilter.exclude.some(matchWith);
    }
}

module.exports = GoodFilter;
