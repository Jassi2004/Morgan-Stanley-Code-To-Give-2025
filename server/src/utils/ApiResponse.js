class ApiResponse{
    /**
     * Creates an instance of ApiResponse.
     * 
     * @constructor
     * @param {number} statusCode - The HTTP status code of the response.
     * @param {*} data - The data to be included in the response.
     * @param {string} [message="success"] - The message to be included in the response.
     */
    constructor(
        statusCode,
        data,
        message = "success"
    ){
        this.statusCode = statusCode;
        this.data = data;
        this.message = message;
        this.success = statusCode < 400
    }
}


export { ApiResponse }

