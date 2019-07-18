module.exports = app => {
    return async function getBaskets() {
        return await app.dbExecute('SELECT * FROM baskets', [], {
            dbName: this.dbName
        })
    }
}