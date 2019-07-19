const ERROR = {
    API: 'Erreur de serveur ou de connexion'
}
const routes = [
    { path: '/', component: HomeComponent },
    { path: '/book-basket', component: BookBasketComponent },
    { path: '/clients-list', component: ClientsListComponent }
]
const router = new VueRouter({
    routes
})
Vue.use(VueTables.ClientTable)
new Vue({
    name: 'app',
    el: '.app',
    router,
    data() {
        return {}
    },
    created() {}
})