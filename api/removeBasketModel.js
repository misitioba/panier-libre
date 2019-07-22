module.exports = app => {
    return async function removeBasketModel(id) {
        return await app.dbExecute('DELETE FROM basket_models WHERE id = ?', [id], {
            dbName: this.dbName
        })
    }
}