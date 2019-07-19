module.exports = app => {
    return async function toggleSubscriber(client_id, is_subscriber) {
        return await app.dbExecute(
            'UPDATE clients SET is_subscriber = ? WHERE id = ?', [is_subscriber, client_id], {
                dbName: this.dbName
            }
        )
    }
}