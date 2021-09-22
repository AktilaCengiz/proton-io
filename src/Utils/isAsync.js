const noop = (async () => {}).constructor;

/**
 * Returns whether the function is asynchronous.
 * @param {Function} value - Target value.
 * @returns {boolean}
 */
module.exports = (value) => Object.prototype.toString.call(value) === "[object AsyncFunction]"
    && value instanceof noop;
