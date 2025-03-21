class ApiError extends Error{
    /**
     * Creates an instance of ApiError.
     * 
     * @param {number} statusCode - The HTTP status code.
     * @param {string} [message="Something went wrong"] - The error message.
     * @param {Array} [errors=[]] - An array of error details.
     * @param {string} [stack=""] - The stack trace of error.
     */
    constructor(
        statusCode,
        message = "Something went wrong",
        errors = [],
        stack = ""
    ){
        super(message);
        this.statusCode = statusCode;
        this.data = null;
        this.message = message;
        this.success = false;
        this.errors = errors;
        if(stack){
            this.stack = stack;
        }else{
            Error.captureStackTrace(this, this.constructor);
        }
    }
}

export { ApiError }

