module.exports = app => {
    return async function getBaskets(params = {}) {
        let dbName = this.dbName
        if (params.umid) {
            dbName = await app.app.admin.getDbnameFromUserModuleId(params.umid)
        }

        let query = `
        SELECT 
b.*,
IFNULL(sum(oi.quantity),0) as bookings,
b.quantity-IFNULL(sum(oi.quantity),0) as available
FROM baskets as b 
LEFT JOIN order_items as oi on oi.basket_id = b.id AND oi.is_canceled = 0
GROUP BY b.id
        `
        return await app.dbExecute(query, [], {
            dbName
        })
    }
}