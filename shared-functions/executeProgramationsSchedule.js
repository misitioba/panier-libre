module.exports = app => {
    return async function executeProgramationsSchedule() {
        let response = {
            TEST: true
        }
        let result = require('btoa')(JSON.stringify(response, null, 4))
        await app.dbExecute(
            'INSERT INTO schedule_logs (type, result, creation_date)VALUES(?,?,?)', [
                'PROGRAMATION',
                result,
                require('moment-timezone')()
                .tz('Europe/Paris')
                ._d.getTime()
            ], {
                dbName: this.dbName
            }
        )
        return response
    }
}