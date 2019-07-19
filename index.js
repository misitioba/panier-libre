module.exports = async(app, config) => {
    app.get('/json/clients', async(req, res) => {
        let conn = await app.getMysqlConnection({
            dbName: config.db_name
        })
        let [clients, fields] = await conn.execute(`SELECT * FROM clients`, [])

        res.json({
            clients
        })
    })

    const express = require('express')

    app.get('/basket-hot/client', (req, res) => {
        res.header('Access-Control-Allow-Origin', req.headers.origin)
        res.header(
            'Access-Control-Allow-Headers',
            'Origin, X-Requested-With, Content-Type, Accept'
        )
        res.sendFile(config.getPath('client.js'))
    })

    app.use('/basket-hot/static', express.static(config.getPath('static')))

    app.loadApiFunctions({
        path: config.getPath('api'),
        scope: {
            dbName: config.db_name
        }
    })

    app.loadFunctions({
        path: config.getPath('shared-functions')
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