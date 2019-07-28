module.exports = app => {
    return async function enableProgramationsSchedule() {
        var schedule = require('node-schedule')
        var j = schedule.scheduleJob('0 0 * * *', async function() {
            await app.executeProgramationsSchedule()
        })
    }
}