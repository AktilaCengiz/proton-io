module.exports = {
    noopAsync: (async () => { }).constructor,
    isString: (value) => typeof value === "string",
    isArray: (value) => value instanceof Array && Array.isArray(value),
    isFunction: (value) => typeof value === "function",
    isAsync: (value) => Object.prototype.toString.call(value) === "[object AsyncFunction]"
        && value instanceof this.noopAsync,
    isBoolean: (value) => typeof value === "boolean",
    isNumber: (value) => typeof value === "number",
    isObject: (value) => value !== null && typeof value === "object"
};
