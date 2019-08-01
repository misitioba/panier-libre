var app = null
var dbName = ''
module.exports = _app => {
    app = _app
    return saveCustomerOrder
}

async function saveCustomerOrder(order) {
    dbName = this.dbName
    var client = null
    if (order.email) {
        client = await app.getClientByEmail(order.email)
    }
    order.client_id = client.id

    let available = await Promise.all(
        order.items.map(item => {
            return getAvailable(item.id)
        })
    )
    if (available.find(item => parseInt(item) < 1)) {
        return {
            err: 'NOT_AVAILABLE'
        }
    }

    await saveBookings(order)
    await removeAutomaticBookingItems(order)
    await saveOrder(order)
    return true
}

async function getAvailable(basket_id) {
    return (await app.dbExecute(
        `SELECT 
        b.quantity-IFNULL(sum(oi.quantity),0) as available
  FROM baskets as b 
  LEFT JOIN order_items as oi on oi.basket_id = b.id
  WHERE b.id = ?
  GROUP BY b.id`, [basket_id], {
            dbName: dbName,
            single: true
        }
    )).available
}

async function saveOrder(order) {
    let now = getNow()

    // remove existing orders from today
    let moment = require('moment-timezone')
    var getMoment = () => moment().tz('Europe/Paris')
    let startOfDay = getMoment()
        .startOf('day')
        ._d.getTime()
    let endOfDay = getMoment()
        .endOf('day')
        ._d.getTime()

    await app.dbExecute(
        `DELETE FROM orders WHERE client_id = ? AND creation_date > ? AND creation_date < ?`, [order.client_id, startOfDay, endOfDay], {
            dbName
        }
    )

    let result = await app.dbExecute(
        `INSERT INTO orders (client_id, creation_date)VALUES(?,?)`, [order.client_id, now], {
            dbName: dbName
        }
    )
    console.log('RESULT', result)
    let order_id = result.insertId

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

async function removeAutomaticBookingItems (order) {
  await app.dbExecute(
    `DELETE from basket_bookings WHERE client_id = ? AND basket_id NOT IN (${order.items
      .map(i => i.id)
      .join(', ')})`,
    [order.client_id],
    {
      dbName: dbName
    }
  )
}

async function saveBookings (order) {
  let now = getNow()
  await app.dbExecute(
    `
    INSERT INTO 
    basket_bookings(client_id,basket_id,is_canceled,date)
    VALUES
    ${order.items.map(basket => {
    return `(${order.client_id},${basket.id},${0},${now})`
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