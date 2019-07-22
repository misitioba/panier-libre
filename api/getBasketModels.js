module.exports = app => {
    return async function getBaskets() {
        let query = `SELECT 
        bm.*
        FROM basket_models as bm
        ORDER BY bm.priority ASC
        `
        return await app.dbExecute(query, [], {
            dbName: this.dbName
        })
    }
}