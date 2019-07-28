module.exports = app => {
    return async function addProgramation(form) {
        return await app.dbExecute(
            'INSERT INTO basket_programations (enabled)VALUES(?)', [0], {
                dbName: this.dbName
            }
        )
    }
}