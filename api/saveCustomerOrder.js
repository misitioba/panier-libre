var app = null
var dbName = ''
module.exports = _app => {
    app = _app
    return saveCustomerOrder
}

async function saveCustomerOrder(order) {
    dbName = this.dbName
    if (order.umid) {
        dbName = await app.api.admin.getDbnameFromUserModuleId(order.umid)
    }

    var client = null
    if (order.email) {
        client = await app.api.admin.getClientByEmail(order.email, {
            _dbName: dbName
        })
    }
    if (order.fullname) {
        client.fullname = order.fullname
        await app.api.saveClient(
            Object.assign({}, client, {
                _fields: ['fullname'],
                _dbName: dbName
            })
        )
    }
    order.client_id = client.id

    let itemsWithAvailable = await Promise.all(
        order.items.map(item => {
            return (async() => {
                let i = Object.assign({}, item)
                i.available = await getAvailable(item.id, order.client_id)
                i.basket = await getBasket(item.id)
                if (i.available === null) {
                    i.available = i.basket.quantity
                } else {
                    i.available = parseInt(i.available)
                }
                i.quantity = parseInt(i.quantity)
                return i
            })()
        })
    )

    for (var index in itemsWithAvailable) {
        let item = itemsWithAvailable[index]

        if (item.quantity > item.available) {
            let message = ''

            if (item.available === 0) {
                message = `Le produit ${item.basket.title} du ${
          item.basket.delivery_date
        } n'est pas disponible.`
            } else {
                message = `${item.basket.title} du ${
          item.basket.delivery_date
        }, il ne reste que ${item.available} paniers.`
            }

            return {
                err: {
                    code: 'NOT_AVAILABLE',
                    message
                }
            }
        }
    }
    await saveOrder(order)
    return true
}

async function getBasket(id) {
    let b = await app.dbExecute(
        `SELECT title, delivery_date, quantity FROM baskets WHERE id = ?`, [id], {
            dbName,
            single: true
        }
    )
    b.delivery_date = require('moment')(b.delivery_date).format('DD/MM/YYYY')
    return b
}

async function getAvailable(basket_id, client_id) {
    var r = await app.dbExecute(
        `SELECT 
        b.quantity-IFNULL(sum(oi.quantity),0) as available
  FROM baskets as b 
  LEFT JOIN order_items as oi on oi.basket_id = b.id AND oi.is_canceled = 0
  LEFT JOIN orders as o on o.id = oi.order_id
  WHERE b.id = ? AND o.client_id <> ?
  GROUP BY b.id`, [basket_id, client_id], {
            dbName: dbName,
            single: true
        }
    )
    return (r && r.available) || null
}

async function saveOrder(order) {
    let moment = require('moment-timezone')
    var getMoment = () => moment().tz('Europe/Paris')
    let now = getNow()

    let order_id = null

    // search for an existing order in the last week with some of the selected baskets
    let searchOneOrderQuery = `SELECT o.id FROM
     orders as o
     JOIN order_items as oi on oi.order_id = o.id
     WHERE 
      basket_id in (${order.items.map(b => b.id).join(', ')})
      AND creation_date > ? AND creation_date < ?
      AND is_archived = 0
     group by o.id`
    let existingOrder = null

    if (existingOrder) {
        order_id = existingOrder.id
        if (order.observation) {
            await app.api.admin.saveDocument({
                id: order_id,
                observation: order.observation,
                _table: 'orders',
                _fields: ['observation'],
                _options: {
                    dbName
                }
            })
        }
    } else {
        // remove existing orders from today
        await app.dbExecute(
            `DELETE FROM orders WHERE client_id = ? AND creation_date > ? AND creation_date < ?`, [
                order.client_id,
                getMoment()
                .startOf('day')
                ._d.getTime(),
                getMoment()
                .endOf('day')
                ._d.getTime()
            ], {
                dbName
            }
        )
        let result = await app.dbExecute(
            `INSERT INTO orders (client_id, observation, creation_date)VALUES(?,?,?)`, [order.client_id, order.observation || '', now], {
                dbName: dbName
            }
        )
        order_id = result.insertId
    }

    // ITEMS
    await app.dbExecute(
            `
INSERT INTO 
order_items(order_id,basket_id,quantity,price,total)
VALUES
${order.items.map(basket => {
    return `(${order_id},${basket.id},${basket.quantity},${basket.price},${
      basket.total
    })`
  }).join(`,
`)}
ON DUPLICATE KEY UPDATE
quantity = VALUES(quantity),
price = VALUES(price),
total = VALUES(total)
`,
    [],
    {
      dbName: dbName
    }
  )
}

function getNow () {
  return require('moment-timezone')()
    .tz('Europe/Paris')
    ._d.getTime()
}