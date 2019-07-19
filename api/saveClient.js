module.exports = app => {
    return async function saveClient(form) {
        if (form.id) {
            return await app.dbExecute(
                'UPDATE clients SET email = ? WHERE id = ?', [form.email, form.id], {
                    dbName: this.dbName
                }
            )
        } else {
            return await app.dbExecute(
                'INSERT INTO clients (email, creation_date)VALUES(?,?)', [form.email, form.creation_date], {
                    dbName: this.dbName
                }
            )
        }
    }
}