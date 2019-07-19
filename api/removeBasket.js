module.exports = app => {
    return async function removeBasket(id) {
        return await app.dbExecute('DELETE FROM baskets WHERE id = ?', [id], {
            dbName: this.dbName
        })
    }
}