module.exports = app => {
        return async function saveBasketBooking(form) {
            if (!form.date) {
                return {
                    err: 'DATE_REQUIRED'
                }
            }

            if (!form.basket_id) {
                return {
                    err: 'BASKET_ID_REQUIRED'
                }
            }

            if (!form.email) {
                return {
                    err: 'EMAIL_REQUIRED'
                }
            }

            if (form.isCustomer) {
                let isBasketAvailable = await isBasketAvailableForBooking(
                    form.basket_id,
                    this
                )
                if (!isBasketAvailable) {
                    return {
                        err: 'NOT_AVAILABLE'
                    }
                }
            }

            if (form.bulkSubscribers) {
                return await addSubscribersBulk(form, this)
            }

            let { email, basket_id } = form
            form.creation_date = form.date
            let client = await getClientByEmail(email, this)
            if (!client) {
                client = await createClient(form, this)
            }
            let client_id = client.id

            if (await hasBooking(client_id, basket_id, this)) {
                return {
                    err: 'BOOKING_EXISTS'
                }
            }

            return await app.dbExecute(
                'INSERT INTO basket_bookings (client_id,basket_id,date)VALUES(?,?,?)', [client_id, basket_id, form.date], {
                    dbName: this.dbName
                }
            )
        }

        async function addSubscribersBulk(form, options) {
            let clients = await app.dbExecute(
                `SELECT id from clients WHERE is_subscriber = 1`, [], {
                    dbName: options.dbName
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
        dbName: options.dbName
      }
    )
  }

  async function hasBooking (client_id, basket_id, options = {}) {
    return await app.dbExecute(
      'SELECT 1 FROM basket_bookings WHERE basket_id = ? AND client_id = ?',
      [client_id, basket_id],
      {
        dbName: options.dbName,
        exists: true
      }
    )
  }

  async function createClient ({ email, creation_date }, options = {}) {
    await app.dbExecute(
      `INSERT INTO clients (email,creation_date)VALUES(?,?)`,
      [email, creation_date],
      {
        dbName: options.dbName
      }
    )
    return await getClientByEmail(email, options)
  }
  async function getClientByEmail (email, options) {
    return await app.dbExecute(
      'SELECT * FROM clients WHERE email = ?',
      [email],
      {
        dbName: options.dbName,
        single: true
      }
    )
  }

  async function isBasketAvailableForBooking (basket_id, options) {
    return await app.dbExecute(
      `
    SELECT
      b.id,
      b.quantity,
      sub.booked
    FROM baskets as b
      LEFT JOIN basket_bookings as bb on bb.basket_id = b.id
    
      LEFT JOIN  
        (SELECT sb.id, count(sbb.id) as booked from baskets as sb
        LEFT JOIN  basket_bookings as sbb on sbb.basket_id = sb.id and sbb.is_canceled = 0
        group by sb.id
        ) as sub on sub.id = b.id
    
    WHERE
    (b.quantity - sub.booked > 0 )
    AND b.id = ?
    group by b.id`,
      [basket_id],
      {
        dbName: options.dbName,
        exists: true
      }
    )
  }
}