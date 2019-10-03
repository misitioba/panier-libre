var moment = require('moment-timezone')
module.exports = app => {
    return async function getClientByEmail(email, options = {}) {
        let dbName = options._dbName || this.dbName

        let client = await app.dbExecute(
            'SELECT * FROM clients WHERE email = ?', [email], {
                dbName,
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
                    dbName
                }
            )
            client = await app.dbExecute(
                'SELECT * FROM clients WHERE email = ?', [email], {
                    dbName,
                    single: true
                }
            )
        }
        return client
    }
}