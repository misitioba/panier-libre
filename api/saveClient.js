module.exports = app => {
    return async function saveClient(form) {
        var dbName = this.dbName

        if (form._dbName) {
            dbName = form._dbName
        }

        if (form.id) {
            let args = [form.email, form.fullname, form.phone, form.id]
            let setSQL = `email = ?, fullname = ?, phone = ?`
            if (form._fields) {
                setSQL = form._fields
                    .map(fieldName => {
                        return `${fieldName} = ?`
                    })
                    .join(', ')
                args = form._fields
                    .filter(fn => fn != 'id')
                    .map(fieldName => {
                        return form[fieldName]
                    })
                args.push(form.id)
            }
            return await app.dbExecute(
                `UPDATE clients SET ${setSQL} WHERE id = ?`,
                args, {
                    dbName
                }
            )
        } else {
            return await app.dbExecute(
                'INSERT INTO clients (email, creation_date)VALUES(?,?)', [form.email, form.creation_date], {
                    dbName
                }
            )
        }
    }
}