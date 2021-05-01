const notFoundHandler = (req, res, next) => {
    const error = new Error(`Resource not found ${req.originalUrl}`)
    res.status(404)
    next(error)
}

const errorHandler = (err, req, res, next) => {
    //Per errors no controlats indiquem un error de servidor (500)
    console.log(err)
    const status = res.statusCode === 200 ? 500 : res.statusCode
    res.status(status)
    res.json({
        message: err.message,
        stack: process.env.NODE_ENV === 'production' ? '' : err.stack
    })
}

export { notFoundHandler, errorHandler }