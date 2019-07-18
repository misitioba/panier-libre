module.exports = app => {
    return async function saveBasket(form) {
        if (form.id) {
            return await app.dbExecute(
                'INSERT INTO baskets (delivery_date)VALUES(?)', [form.delivery_date], {
                    dbName: this.dbName
                }
            )
        } else {
            return await app.dbExecute(
                'INSERT INTO baskets (delivery_date)VALUES(?)', [form.delivery_date], {
                    dbName: this.dbName
                }
            )
        }
    }
}