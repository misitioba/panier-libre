module.exports = app => {
    return async function baskets_execute_programations() {
        return await app.executeProgramationsSchedule.apply(this, [])
    }
}