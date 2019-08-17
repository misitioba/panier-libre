module.exports = app => {
    return async function getDashboardData() {
        /* let query = `
                                                                    SELECT bb.id, c.email, bb.quantity,b.id as basket_id, bb.date as booking_date, b.delivery_date, bb.is_canceled
                                                                    FROM baskets as b
                                                                    JOIN basket_bookings as bb on bb.basket_id = b.id
                                                                    JOIN clients as c on c.id = bb.client_id

                                                                    ` */
        let query = `
        SELECT orderItem.id, b.is_archived, c.email, orderItem.quantity,b.id as basket_id, o.creation_date as booking_date, b.delivery_date, orderItem.is_canceled, o.observation as observation, o.id as orderId
        FROM baskets as b
JOIN order_items as orderItem on orderItem.basket_id = b.id
JOIN orders as o on o.id = orderItem.order_id
        JOIN clients as c on c.id = o.client_id
        #WHERE orderItem.is_canceled = 0
        `
        return await app.dbExecute(query, [], {
            dbName: this.dbName
        })
    }
}