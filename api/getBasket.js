module.exports = app => {
    return async function getBasket(id) {
        return await app.dbExecute('SELECT * FROM baskets WHERE id = ?', [id], {
            dbName: this.dbName,
            single: true
        })
    }
}