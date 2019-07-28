import ImportCDNJS from 'import-cdn-js'

withVue()

function withVue() {
    if (typeof Vue === 'undefined') {
        if (!window._vue_is_loading) {
            window._vue_is_loading = true
            var s = document.createElement('script')
            s.src = 'https://cdn.jsdelivr.net/npm/vue@2.6.10/dist/vue.js'
            document.body.appendChild(s)
            console.log('loading vue')
        }
        return setTimeout(withVue, 1000)
    }
    return __CALLBACK__({
        mount(el) {
            init(el)
        }
    })

    async function init(el) {
        require('./components/externalBookingForm')
        if (typeof axios === 'undefined') {
            window.axios = require('axios')
        }
        await ImportCDNJS('/api.js')
        var endpointURL = '__API_ENDPOINT_URL__'
        new Vue({
            el,
            template: `<div>
                <booking-form></booking-form>
            </div>`,
            data() {
                return {
                    count: 0
                }
            },
            mounted() {},
            created() {
                window.api.funqlEndpointURL = endpointURL
                console.log(endpointURL)
            },
            methods: {}
        })
    }
}