module.exports = app => {
    return async function editProgramationField(data) {
        let query = `UPDATE basket_programations SET ${data.field} = ? WHERE id = ?`
        return await app.dbExecute(query, [data.value, data.id], {
            dbName: this.dbName
        })
    }
}