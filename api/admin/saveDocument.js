module.exports = app => {
    return async function saveDocument(form) {
        let args = []
        let setSQL = ``
        let dbExecuteOptions = form._options || {}
        if (!form._fields) {
            throw new Error('_fields required')
        }
        if (!form._table) {
            throw new Error('_table required')
        }
        if (form.id) {
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

            return await app.dbExecute(
                `UPDATE ${form._table} SET ${setSQL} WHERE id = ?`,
                args,
                dbExecuteOptions
            )
        } else {
            args = form._fields
                .filter(fn => fn != 'id')
                .map(fieldName => {
                    return form[fieldName]
                })
            return await app.dbExecute(
                `INSERT INTO ${form._table} (${form._fields
          .map(f => f)
          .join(', ')})VALUES(${form._fields.map(f => '?').join(', ')})`, [form.email, form.creation_date],
                dbExecuteOptions
            )
        }
    }
}