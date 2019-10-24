module.exports = async(app, config) => {
    //This will serve the main javascript file bundled (ES6 -> ES5) using webpack
    app.get(
        config.getRouteName('app.js'),
        app.webpackMiddleware({
            entry: config.getPath('js/app.js'),
        })
    )

    //This will serve the main javascript file for the external booking form
    app.get(
        config.getRouteName('client.js'),
        app.webpackMiddleware({
            entry: config.getPath('js/client.js'),
            transform(html, req) {
                var fullUrl = req.protocol + '://' + req.get('host')

                let isLocalhost = req.get('host').indexOf('localhost') !== -1

                if (!isLocalhost && process.env.NODE_ENV === 'production') {
                    fullUrl = process.env.DOMAIN || fullUrl
                }

                html = html.split('__USER_MODULE__ID__').join(req.query.umid)
                html = html.split('__CALLBACK__').join(req.query.callback)
                html = html.split('__API_ENDPOINT_URL__').join(fullUrl + '/')
                return html
            },
        })
    )

    //This is the external booking form implementation
    //"Ouvrez le formulaire de réservation"

    app.get(config.getRouteName('reserver'), async(req, res) => {
        var fullUrl = req.protocol + '://' + req.get('host')
        const isProd = process.env.NODE_ENV === 'production'
        let isLocalhost = req.get('host').indexOf('localhost') !== -1
        if (!isLocalhost && isProd) {
            fullUrl = process.env.DOMAIN || fullUrl
        }
        res.send(`
                <!-- CLIENT WEBPAGE -->
                <head>
                    <title>Démo Réservation</title>
                    <meta name='viewport', content='width=device-width, initial-scale=1'/>
                </head>
                <body>
                <div class="app_goes_here"></div>
                <script>
                (function(){
                    window._vue_min = ${isProd ? 'true' : 'false'}
                    
                    var URI = '${fullUrl}';
                    let s = document.createElement('script')
                    s.src = URI+'/panier-libre/client.js?callback=initstcbh&umid=${
                      req.query.umid
                    }'
                    document.querySelector('body').append(s)
                    window.initstcbh = function (app){
                        app.mount('.app_goes_here')
                    }
                })();
                </script>
                </body>
                `)
    })

    //Static route for assets
    app.use(
        config.getRouteName('/static'),
        require('express').static(config.getPath('static'))
    )

    let funql = require('funql-api')

    //This will load all the functions from /api
    //the scope of the function is customized with the dbName of baske-hot and moduleId
    await funql.loadFunctionsFromFolder({
        path: config.getPath('api'),
        params: [app],
        scope: ({ req }) => {
            let dbName = config.db_name
            if (req && req.user && req.user.modules && req.user.modules.length > 0) {
                let moduleMatch = req.user.modules.find(um => um.module_id == config.id)
                if (moduleMatch) {
                    dbName = moduleMatch.dbname || dbName
                }
            }
            return {
                moduleId: config.id,
                dbName,
            }
        },
    })

    await funql.loadFunctionsFromFolder({
        namespace: 'admin',
        path: config.getPath('api/admin'),
        params: [app],
        middlewares: [
            async app => {
                //These functions are only accessible internally
                //e.g: app.api.admin.saveDocument
                //if this.req is present, is an api call, and we return 401 (not authorized)
                if (this.req) return { err: 401 }
            },
        ],
    })

    let package = JSON.parse(
        (await require('sander').readFile(config.getPath('package.json'))).toString(
            'utf-8'
        )
    )

    //Route for the main vuejs client-side application
    app.get(
        config.getRouteName('/'),
        app.builder.transformFileRoute({
            cwd: config.getPath(),
            source: 'app.pug',
            mode: 'pug',
            transform: [app.cacheCDNScripts],
            context: {
                env: process.env,
                instances: JSON.stringify(package.instances),
                cwd: config.getRouteName(),
                head: {
                    title: 'Panier Libre',
                },
            },
        })
    )

    //Route for the changelog (converted from markdown on the fly)
    app.get(
        config.getRouteName('/version'),
        app.builder.transformFileRoute({
            cwd: config.getPath(),
            source: 'changelog.md',
            transform: [
                async raw => {
                    let package = JSON.parse(
                        (await require('sander').readFile(
                            config.getPath('package.json')
                        )).toString('utf-8')
                    )
                    console.log(raw, package.version)
                    raw = raw.split('PKG_VERSION').join(package.version)
                    return raw
                },
            ],
        })
    )
}