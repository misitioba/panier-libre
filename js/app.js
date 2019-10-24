import ImportCDNJS from 'import-cdn-js'

import './components/basketDetails'
import './components/backComponent'
import './components/baskets'
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

import Home from './containers/home'
import Baskets from './containers/baskets'
import Dashboard from './containers/dashboard'
import Clients from './containers/clientsList'
import Integration from './containers/integrationPage'
import BasketModels from './containers/basketModels'
import Programation from './containers/programation'
import Orders from './containers/orders'
import OrdersDetails from './containers/orderDetails'
import Empty from './containers/empty'
import Login from './containers/login'
ImportCDNJS('/analytics.js')

window.ERROR = {
    API: 'Erreur de serveur ou de connexion'
}
const routes = [
    { path: '/', component: Home, name: 'home' },
    { path: '/dashboard', component: Dashboard, name: 'dashboard' },
    { path: '/baskets', component: Baskets, name: 'baskets' },
    { path: '/orders', component: Orders, name: 'orders' },
    { path: '/orders/:id', component: OrdersDetails, name: 'order-details' },
    { path: '/clients-list', component: Clients, name: 'clients' },
    {
        path: '/form-integration',
        component: Integration,
        name: 'integration'
    }
]
const router = new VueRouter({
    routes
})

window.onLogout = () => {
    router.push({ name: 'home' })
}
window.onLogin = () => {
    router.push({ name: 'dashboard' })
}

new Vue({
    name: 'app',
    el: '.app',
    router,
    data() {
        return {}
    },
    created() {}
})