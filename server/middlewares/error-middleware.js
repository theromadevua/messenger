import ApiError from '../exceptions/api-error.js';

function errorMiddleware(err, req, res, next) {
    console.log(err);
    if (err instanceof ApiError) {
        return res.status(err.status).json({message: err.message, errors: err.errors})
    }
    return res.status(err.status || 400).json({message: err.message, errors: err.errors})

};

export default errorMiddleware