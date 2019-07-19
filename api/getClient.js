module.exports = app => {
    return async function getClient(id) {
        let basket = await app.dbExecute(
            'SELECT * FROM clients WHERE id = ?', [id], {
                dbName: this.dbName,
                single: true
            }
        )
        return basket
    }
}