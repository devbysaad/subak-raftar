const success = (data, message = "Success") => ({
    success: true,
    message,
    data,
});

const failure = (message = "Something went wrong", errors = null) => ({
    success: false,
    message,
    errors,
});

module.exports = { success, failure };