export const success = (data, message = "Success") => ({
    success: true,
    message,
    data,
});

export const failure = (message = "Something went wrong", errors = null) => ({
    success: false,
    message,
    errors,
});
