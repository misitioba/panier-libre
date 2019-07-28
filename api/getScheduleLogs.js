module.exports = app => {
    return async function getScheduleLogs(filter) {
        let query = `SELECT 
        *
        FROM schedule_logs
        WHERE type = ?
        `
        return await app.dbExecute(query, [filter.type], {
            dbName: this.dbName
        })
    }
}