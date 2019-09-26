module.exports = app => {
        return async function getDashboardData(options) {
                let p = options._paginate

                function getQuery(isCount = false) {
                    let query = `
            SELECT 
                ${
  isCount
    ? `count(*) as count`
    : `b.title as basket_title, b.description as basket_description,
                orderItem.id, b.is_archived, c.fullname, c.email, orderItem.quantity,b.id as basket_id, o.creation_date as booking_date, b.delivery_date
                , orderItem.is_canceled, o.observation as observation, o.id as orderId`
}
            FROM baskets as b
                JOIN order_items as orderItem on orderItem.basket_id = b.id
                JOIN orders as o on o.id = orderItem.order_id
                JOIN clients as c on c.id = o.client_id
            WHERE 
                orderItem.is_canceled = ${options.showCanceled ? '1' : '0'}
                AND
                b.is_archived = ${options.showArchived ? '1' : '0'}
            ORDER BY o.creation_date DESC 
        `
      if (!isCount) {
        query += `${p ? `LIMIT ${p.size} OFFSET ${p.from}` : ''}`
      }
      return query
    }

    console.log('QUERY', getQuery())

    return {
      data: await app.dbExecute(getQuery(), [], {
        dbName: this.dbName
      }),
      count: (await app.dbExecute(getQuery(true), [], {
        dbName: this.dbName,
        single: true
      })).count
    }
  }
}