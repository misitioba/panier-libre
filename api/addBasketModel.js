module.exports = app => {
    return async function addBasketModel(form) {
        return await app.dbExecute(
            'INSERT INTO basket_models (description, quantity, priority, creation_date)VALUES(?,?,?,?)', ['', 0, 0, form.creation_date], {
                dbName: this.dbName
            }
        )
    }
}