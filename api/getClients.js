module.exports = app => {
    return async function getClients() {
        let query = `
        SELECT 
            c.*
        FROM clients as c 
        `
        return await app.dbExecute(query, [], {
            dbName: this.dbName
        })
    }
}