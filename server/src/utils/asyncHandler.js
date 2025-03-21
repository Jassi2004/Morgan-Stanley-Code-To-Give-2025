
/**
 * A higher-order function that wraps an asynchronous request handler function
 * and ensures that any errors are passed to the next middleware.
 *
 * @param {Function} requestHandler - The asynchronous request handler function to be wrapped.
 * @returns {Function} A new function that wraps the request handler and catches any errors.
 */
const asyncHandler = ( requestHandler ) => {
    return (req, res, next) => {
        Promise.resolve(requestHandler(req, res, next))
        .catch((err) => next(err));
    }
}


export { asyncHandler }

