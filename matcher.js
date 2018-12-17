const {isString, isRegExp, isArray, isFunction, isPlainObject, isEqual, get} = require('lodash');

module.exports = (filter, data) => {
    if (isString(filter)) {
        return match(filter, data);
    }

    if (isArray(filter)) {
        return filter.length ? filter.every(matchFilter) : false;
    }

    /**
     * @description
     * Iterate over filter object
     * and match every field
     */
    if (isPlainObject(filter)) {
        const keys = Object.keys(filter);
        
        return keys.length ? keys.every(key => {
            return filter[key].some(matchTo => match(matchTo, get(data, key)));
        }) : false;
    }

    return false;
}

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

function match(matchTo, matchWith) {
    if (!matchWith || !matchTo) {
        return false;
    }

    const {matcher} = matchers.find(matcher => matcher.condition(matchTo)) || {matcher: isEqual};
    
    return matcher(matchTo, matchWith);
}