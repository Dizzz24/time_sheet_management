async function errorHandler(error, req, res, next) {
    // console.log(error, "< ==== error broo")
    let statusCode = 500
    let message = "Internal server error"

    if (error.name === "SequelizeValidationError" || error.name === "SequelizeUniqueConstraintError") {
        statusCode = 400
        message = error.errors.map(el => el.message)
    } else if (error.name === "invalidIdFormat") {
        statusCode = 400
        message = "Please Provide a valid ID"
    } else if (error.name === "notFound") {
        statusCode = 404
        message = `${error.type} not found`
    } else if (error.name === "invalidToken" || error.name === "JsonWebTokenError") {
        statusCode = 401
        message = "Invalid Token"
    } else if (error.name === "invalidFile") {
        statusCode = 401
        message = "Please Provide a valid file"
    } else if (error.name === "missingColumns" || error.name === "required") {
        statusCode = 400
        message = error.message
    }

    console.log({ message })
    res.status(statusCode).json({ message })
}

module.exports = errorHandler