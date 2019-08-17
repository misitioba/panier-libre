module.exports = app => {
    return async function removeClient(id) {
        return await app.dbExecute('DELETE FROM clients WHERE id = ?', [id], {
            dbName: this.dbName
        })
    }
}