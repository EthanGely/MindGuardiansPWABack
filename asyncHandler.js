function asyncHandler(fn) {
    if (typeof fn !== 'function') {
        console.error("asyncHandler received a non-function:", fn);
        throw new TypeError("Expected a function, but got: " + typeof fn);
    }
    return function (req, res, next) {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
}

module.exports = asyncHandler;
