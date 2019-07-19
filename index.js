module.exports = async(app, config) => {

    app.get('/json/clients', async(req, res) => {
        let conn = await app.getMysqlConnection({
            dbName: config.db_name
        });
        let [clients, fields] = await conn.execute(`SELECT * FROM clients`, []);

        res.json({
            clients
        });
    });

    const express = require('express')

    app.use('/basket-hot/static', express.static(config.getPath('static')))

    app.loadApiFunctions({
        path: config.getPath('api'),
        scope: {
            dbName: config.db_name
        }
    })

    await app.builder.transformFile({
        target: '/index.html',
        source: 'app.pug',
        mode: 'pug',
        transform: [app.cacheCDNScripts],
        context: {
            head: {
                title: config.title
            }
        }
    })
}