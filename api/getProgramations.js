module.exports = app => {
    return async function getProgramations(data) {
        let query = `
        SELECT 
            *
        FROM basket_programations
        `
        return await app.dbExecute(query, [], {
            dbName: this.dbName
        })
    }
}