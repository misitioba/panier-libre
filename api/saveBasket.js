module.exports = app => {
    return async function saveBasket(form) {
        if (form.id) {
            return await app.dbExecute(
                'UPDATE baskets SET title = ? , delivery_date = ?, description = ?, quantity = ?, is_archived = ? WHERE id = ?', [
                    form.title,
                    form.delivery_date,
                    form.description,
                    form.quantity,
                    form.is_archived,
                    form.id
                ], {
                    dbName: this.dbName
                }
            )
        } else {
            return await app.dbExecute(
                'INSERT INTO baskets (title, description, quantity, delivery_date, creation_date)VALUES(?,?,?,?,?)', [
                    form.title,
                    form.description,
                    form.quantity,
                    form.delivery_date,
                    form.creation_date
                ], {
                    dbName: this.dbName
                }
            )
        }
    }
}