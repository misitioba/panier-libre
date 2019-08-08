module.exports = async(app, config) => {
    app.get(
        config.getRouteName('app.js'),
        app.webpackMiddleware({
            entry: config.getPath('js/app.js'),
            output: config.getPath('tmp/app.js')
        })
    )

    app.get(
        config.getRouteName('booking_form_client.js'),
        app.webpackMiddleware({
            entry: config.getPath('js/booking-form.js'),
            output: config.getPath('tmp/booking-form.js'),
            transform(html, req) {
                var fullUrl = req.protocol + '://' + req.get('host')
                if (process.env.NODE_ENV === 'production') {
                    fullUrl = process.env.DOMAIN || fullUrl
                }
                html = html.split('__CALLBACK__').join(req.query.callback)
                html = html.split('__API_ENDPOINT_URL__').join(fullUrl + '/')
                return html
            }
        })
    )

    app.get(config.getRouteName('reserver'), async(req, res) => {
        var fullUrl = req.protocol + '://' + req.get('host')
        res.send(`
                <!-- CLIENT WEBPAGE -->
                <head>
                    <title>Démo Réservation</title>
                </head>
                <body>
                <div class="app_goes_here"></div>
                <script>
                (function(){
                    var URI = '${fullUrl}';
                    let s = document.createElement('script')
                    s.src = URI+'/basket-hot/booking_form_client.js?callback=initstcbh'
                    document.querySelector('body').append(s)
                    window.initstcbh = function (app){
                        app.mount('.app_goes_here')
                    }
                })();
                </script>
                </body>
                `)
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

    // console.log('TRACE BASKET', config)

    app.loadApiFunctions({
        path: config.getPath('api'),
        scope: ({ req }) => {
            let dbName = config.db_name
            if (req.user && req.user.modules && req.user.modules.length > 0) {
                let moduleMatch = req.user.modules.find(um => um.module_id == config.id)
                if (moduleMatch) {
                    dbName = moduleMatch.dbname || dbName
                }
            }
            return {
                dbName
            }
        }
    })

    app.loadFunctions({
        path: config.getPath('shared-functions'),
        scope: {
            dbName: config.db_name
        }
    })

    // app.enableProgramationsSchedule()

    app.get(
        config.getRouteName('/'),
        app.builder.transformFileRoute({
            cwd: config.getPath(),
            source: 'app.pug',
            mode: 'pug',
            transform: [app.cacheCDNScripts],
            context: {
                cwd: config.getRouteName(),
                head: {
                    title: config.title
                }
            }
        })
    )
}