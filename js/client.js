import ImportCDNJS from 'import-cdn-js'

withVue()

function withVue() {
    if (typeof Vue === 'undefined') {
        if (!window._vue_is_loading) {
            window._vue_is_loading = true
            var s = document.createElement('script')
            const name = window._vue_min === false ? `vue.js` : `vue.min.js`
            s.src = `https://cdn.jsdelivr.net/npm/vue@2.6.10/dist/${name}`
            document.body.appendChild(s)
                // console.log('loading vue...')
        }
        return setTimeout(withVue, 50)
    }

    window._um_id = __USER_MODULE__ID__

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
        window._funqlGetMode = true
        await ImportCDNJS('__API_ENDPOINT_URL__api.js')
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