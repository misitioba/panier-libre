module.exports = app => {
    return async function getDbnameFromUserModuleId(id) {
        let userModule = await app.dbExecute(
            `SELECT * FROM user_modules WHERE id = ?`, [id], {
                single: true
            }
        )
        return userModule.dbname
    }
}