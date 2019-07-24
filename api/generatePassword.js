module.exports = app => {
    return async function generatePassword(newPassword) {
        return app.generatePassword(newPassword)
    }
}