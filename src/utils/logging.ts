export const disableConsoleErrorsInProduction = () => {
    if (process.env.NODE_ENV === 'production') {
        console.error = () => {};
    }
};