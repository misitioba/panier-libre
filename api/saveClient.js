module.exports = app => {
        var debug = require('debug')(`app:saveClient ${`${Date.now()}`.white}`)
  return async function saveClient (form) {
    if (!form.email) {
      return {
        err: 400
      }
    }

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
            return form[fieldName] || ''
          })
        args.push(form.id)
      }
      return await app.dbExecute(
        `UPDATE clients SET ${setSQL} WHERE id = ?`,
        args,
        {
          dbName
        }
      )
    } else {
      return await app.dbExecute(
        `INSERT INTO clients (email, fullname, phone, creation_date)VALUES(?,?,?,?)`,
        [form.email, form.fullname || '', form.phone || '', form.creation_date],
        {
          dbName
        }
      )
    }
  }
}