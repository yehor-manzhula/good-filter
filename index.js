const {isArray, isPlainObject, defaults} = require('lodash');
const Stream = require('stream');
const Hoek = require('hoek');

const matcher = require('./matcher');

const internals = {

    // By default exclude everything
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
        const filter = this._settings[data.event];

        /**
         * By default filter out all not specified events
         */  
        if (!filter) {
            return filter;
        }

        const matchProp = prop => matcher(prop, data);

        /**
         * Exclude has higher priority
         */
        return filter.include.some(matchProp) && !filter.exclude.some(matchProp);
    }
}

module.exports = GoodFilter;
