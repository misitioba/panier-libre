var moment = require('moment-timezone')
module.exports = app => {
    return async function getClientByEmail(email) {
        let client = await app.dbExecute(
            'SELECT * FROM clients WHERE email = ?', [email], {
                dbName: this.dbName,
                single: true
            }
        )
        if (!client) {
            await app.dbExecute(
                `INSERT INTO clients (email,creation_date)VALUES(?,?)`, [
                    email,
                    moment()
                    .tz('Europe/Paris')
                    ._d.getTime()
                ], {
                    dbName: this.dbName
                }
            )
            client = await app.dbExecute(
                'SELECT * FROM clients WHERE email = ?', [email], {
                    dbName: this.dbName,
                    single: true
                }
            )
        }
        return client
    }
}