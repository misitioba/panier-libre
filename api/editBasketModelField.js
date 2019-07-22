module.exports = app => {
    return async function getBaskets(data) {
        let query = `UPDATE basket_models SET ${data.field} = ? WHERE id = ?`
        return await app.dbExecute(query, [data.value, data.id], {
            dbName: this.dbName
        })
    }
}