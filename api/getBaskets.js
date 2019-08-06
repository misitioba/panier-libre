module.exports = app => {
    return async function getBaskets() {
        let query = `
        SELECT 
b.*,
IFNULL(sum(oi.quantity),0) as bookings,
b.quantity-IFNULL(sum(oi.quantity),0) as available
FROM baskets as b 
LEFT JOIN order_items as oi on oi.basket_id = b.id
GROUP BY b.id
        `
        return await app.dbExecute(query, [], {
            dbName: this.dbName
        })
    }
}