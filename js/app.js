import ImportCDNJS from 'import-cdn-js'

import './components/basketDetails'
import './components/backComponent'
import './components/basketListComponent'
import './components/buttonCmp'
import './components/modalWindow'
import './components/navComponent'
import './components/tableComponent'
import './components/textareaCmp'
import './components/toggleComponent'
import './components/sidebar'
import './components/selectCmp'
import './components/datePiker'
import './components/inputCmp'
import './components/appFooter'

import Home from './containers/homeComponent'
import Dashboard from './containers/dashboard'
import Baskets from './containers/bookBasket'
import Clients from './containers/clientsList'
import Integration from './containers/integrationPage'
import BasketModels from './containers/basketModels'
import Programation from './containers/programation'
ImportCDNJS('/analytics.js')

window.ERROR = {
    API: 'Erreur de serveur ou de connexion'
}
const routes = [
    { path: '/', component: Dashboard },
    { path: '/paniers', component: Home },
    { path: '/book-basket', component: Baskets },
    { path: '/clients-list', component: Clients },
    {
        path: '/form-integration',
        component: Integration
    },
    {
        path: '/basket-models',
        component: BasketModels
    }, ,
    {
        path: '/programation',
        component: Programation
    }
]
const router = new VueRouter({
    routes
})

new Vue({
    name: 'app',
    el: '.app',
    router,
    data() {
        return {}
    },
    created() {
        console.log('APP created')
    }
})

console.log('APP')