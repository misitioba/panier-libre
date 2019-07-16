/*
const Foo = {
    template: `<div>
            <back-component></back-component>
            <div id="people">
                <v-client-table :data="tableData" :columns="columns" :options="options"></v-client-table>
            </div>
        </div>`,
    data() {
        return {
            columns: ['id', 'name', 'age'],
            tableData: [
                { id: 1, name: 'John', age: '20' },
                { id: 2, name: 'Jane', age: '24' },
                { id: 3, name: 'Susan', age: '16' },
                { id: 4, name: 'Chris', age: '55' },
                { id: 5, name: 'Dan', age: '40' }
            ],
            options: {
                // see the options API
                texts: {
                    count: 'Showing {from} to {to} of {count} records|{count} records|One record',
                    first: 'Premier',
                    last: 'Dernier',
                    filter: 'Filtre:',
                    filterPlaceholder: 'Requête de recherche',
                    limit: 'Records:',
                    page: 'Page:',
                    noResults: 'Aucun enregistrement correspondant',
                    filterBy: 'Filtrer par {column}',
                    loading: 'Chargement...',
                    defaultOption: 'Sélectionner {column}',
                    columns: 'Colonnes'
                }
            }
        }
    },
    mounted() {}
}
*/
const routes = [
    { path: '/', component: HomeComponent },
    { path: '/configuration', component: ConfigComponent },
    { path: '/viewer', component: ViewerComponent }
]
const router = new VueRouter({
    routes // short for `routes: routes`
})
Vue.use(VueTables.ClientTable)
new Vue({
    name: 'app',
    el: '.app',
    router,
    data() {
        return {

        }
    },
    created() {


    }
})