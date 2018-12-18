const {isString, isRegExp, isArray, isFunction, isPlainObject, isEqual, get} = require('lodash');

/**
 * Available matcher values
 */
const matchers = [{
    condition: isString,
    matcher: (matchTo, matchWith) => isEqual(matchTo, '*') ? true : isEqual(matchTo, matchWith)
}, {
    condition: isRegExp,
    matcher: (matchTo, matchWith) => !!matchWith.match(matchTo)
}, {
    condition: isArray,
    matcher: (matchTo, matchWith) => matchTo.includes(matchWith)
}, {
    condition: isFunction, 
    matcher: (matchTo, matchWith) => matchTo(matchWith)
}];

module.exports = matcher;

/**
 * Matcher function iterates
 * @param {*} filter 
 * @param {*} data 
 */
function matcher(filter, data) {
    /**
     * Iterate over array
     * and call matcher on each item
     */
    if (isArray(filter)) {
        return filter.length ? filter.every(prop => matcher(prop, data)) : false;
    }

    /**
     * Iterate over filter object
     * and match every key with data available by it
     */
    if (isPlainObject(filter)) {
        const keys = Object.keys(filter);
        
        // If key value exists check every value
        return keys.length ? keys.every(key => {
            // If any of key match
            return filter[key].some(matchTo => matcher(matchTo, get(data, key)));
        }) : false;
    }

    return match(filter, data);
}

/**
 * @param  {*} matchTo Value to match to
 * @param  {*} matchWith Value to match with
 * 
 * @return {bool}
 */
function match(matchTo, matchWith) {
    if (!matchWith || !matchTo) {
        return false;
    }

    // Choose appropriate matcher
    const {matcher} = matchers.find(matcher => matcher.condition(matchTo)) || {matcher: isEqual};

    return matcher(matchTo, matchWith);
}