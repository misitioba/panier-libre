module.exports = app => {
    return async function removeProgramation(id) {
        return await app.dbExecute(
            'DELETE FROM basket_programations WHERE id = ?', [id], {
                dbName: this.dbName
            }
        )
    }
}