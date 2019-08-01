var app = null
var dbName = ''
module.exports = _app => {
    app = _app
    return async function saveBasket(form) {
        dbName = this.dbName
        if (form.id) {
            return await app.dbExecute(
                'UPDATE baskets SET title = ? , delivery_date = ?, description = ?, quantity = ?, is_archived = ?, price = ? WHERE id = ?', [
                    form.title,
                    form.delivery_date,
                    form.description,
                    form.quantity,
                    form.is_archived,
                    form.price,
                    form.id
                ], {
                    dbName: this.dbName
                }
            )
        } else {
            let r = await app.dbExecute(
                'INSERT INTO baskets (title, description, quantity, price, delivery_date, creation_date)VALUES(?,?,?,?,?,?)', [
                    form.title,
                    form.description,
                    form.quantity,
                    form.price,
                    form.delivery_date,
                    form.creation_date
                ], {
                    dbName: this.dbName
                }
            )
            form.id = r.insertId
        }

        if (form.bulkSubscribers) {
            await addSubscribersBulk(form)
        }
    }
}

async function addSubscribersBulk(form) {
    let clients = await app.dbExecute(
        `SELECT id from clients WHERE is_subscriber = 1`, [], {
            dbName
        }
    )

    // id = basket id

    await Promise.all(
        clients.map(client => {
            return automateClientOrder(client)
        })
    )

    async function automateClientOrder(client) {
        var moment = require('moment')
            // get order from today
        let creation_date_min = moment()
            .tz('Europe/Paris')
            .startOf('day')
            ._d.getTime()
        let creation_date_max = moment()
            .tz('Europe/Paris')
            .endOf('day')
            ._d.getTime()
        let orderItem = await app.dbExecute(
            `
        SELECT orderItem.id FROM orders as orderItem WHERE orderItem.client_id = ? AND orderItem.creation_date > ? AND orderItem.creation_date < ?
        `, [client.id, creation_date_min, creation_date_max], {
                dbName,
                single: true
            }
        )

        // if none, create one
        if (!orderItem) {
            let r = await app.dbExecute(
                `INSERT INTO orders (client_id, creation_date)VALUES(?,?)`, [
                    client.id,
                    moment()
                    .tz('Europe/Paris')
                    ._d.getTime()
                ], {
                    dbName
                }
            )
            orderItem = await app.dbExecute(
                `SELECT * FROM orders WHERE id = ?`, [r.insertId], {
                    dbName
                }
            )
        }

        // add the basket as order item with quantity 1
        return await app.dbExecute(
            `
        INSERT INTO 
            order_items(order_id,basket_id,quantity,price,total,is_canceled)
        VALUES(?,?,?,?,?,?)
        ON DUPLICATE KEY UPDATE
        quantity = VALUES(quantity),
        price = VALUES(price),
        total = VALUES(total),
        is_canceled = 0
    `, [orderItem.id, form.id, 1, form.price, form.price, 0], {
                dbName: dbName
            }
        )
    }
}