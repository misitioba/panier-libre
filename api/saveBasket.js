module.exports = app => {
    return async function saveBasket(form) {
        if (form.id) {
            return await app.dbExecute(
                'UPDATE baskets SET delivery_date = ?, description = ?, quantity = ?, is_archived = ? WHERE id = ?', [form.delivery_date, form.description, form.quantity, form.is_archived, form.id], {
                    dbName: this.dbName
                }
            )
        } else {
            return await app.dbExecute(
                'INSERT INTO baskets (description, quantity, delivery_date, creation_date)VALUES(?,?,?,?)', [form.description, form.quantity, form.delivery_date, form.creation_date], {
                    dbName: this.dbName
                }
            )
        }
    }
}