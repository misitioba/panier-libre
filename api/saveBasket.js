var app = null
var dbName = ''
module.exports = _app => {
    app = _app
    return async function saveBasket(form) {
        dbName = this.dbName
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
            let r = await app.dbExecute(
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
            form.id = r.insertId
        }

        if (form.bulkSubscribers) {
            await addSubscribersBulk({
                basket_id: form.id,
                date: require('moment-timezone')()
                    .tz('Europe/Paris')
                    ._d.getTime()
            })
        }
    }
}

async function addSubscribersBulk(form) {
    let clients = await app.dbExecute(
        `SELECT id from clients WHERE is_subscriber = 1`, [], {
            dbName
        }
    )

    return await app.dbExecute(
            `
    INSERT INTO 
        basket_bookings(client_id,basket_id,is_canceled,date)
        VALUES
    ${clients.map(c => {
    return `(${c.id},${form.basket_id},${0},${form.date})`
  }).join(`,
    `)}
    ON DUPLICATE KEY UPDATE
    client_id = VALUES(client_id), 
    basket_id = VALUES(basket_id),
    is_canceled = 0
    `,
    [],
    {
      dbName: dbName
    }
  )
}