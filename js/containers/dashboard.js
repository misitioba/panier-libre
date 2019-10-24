import stylesMixin from '../mixins/styles'
import createEditableColumn from '../utils/createEditableColumn'
import orderDetails from './orderDetails'
import authMixin from '../mixins/auth'

Vue.component('orderDetails', orderDetails)

export default {
    mixins: [stylesMixin,authMixin],
    name: 'dashboard',
    props: [],
    template: `
    <div ref="scope">
        <div class="dashboard" ref="root" >
            <h2>Tableau de bord</h2>
            <div class="btn_group">
                <button class="btn" @click="refresh">Refresh</button>
            </div>

            <div class="" style="margin-bottom:10px">
                <label>Voir les paniers archivés</label>
                <toggle-component ref="toggleArchived" @toggle="toggleArchived"></toggle-component>
            </div>

            <div class="" style="margin-bottom:10px">
                <label>Voir les commandes annulés</label>
                <toggle-component ref="toggleCanceled" @toggle="toggleCanceled"></toggle-component>
            </div>
            
            <table-component :paginator="paginator" @paginate="onPagination" ref="dashTable" name="dashTable" @rowClick="rowClick" :exportCSV="exportCSV" :filters="tableFilters" :gridColumns="gridColumns" :items="filteredItems" :colsTransforms="colsTransforms" :valueTransforms="valueTransforms" :cols="cols" ></table-component>

            <modal-window ref="modal" :params="modalParams" v-show="!!modal" v-model="modal" @close="modal=''"></modal-window>
        </div>
        </div>
    `,
    data() {
        var self = this
        return {
            paginator:{
                from:0,
                to:10,
                size:10,
                count:0,
                pages:0,
                page:1
            },
            showArchived: false,
            showCanceled:false,
            modal: '',
            modalParams: {
                id: ''
            },
            styles: `
            .dashboard{
            
            }
            
            @media only screen and (max-width: 639px) {
                
            }
        `,
            tableFilters: {
                email: ['include', 'gt', 'gte', 'lt', 'lte', 'equal'],
                quantity: ['include', 'gt', 'gte', 'lt', 'lte', 'equal'],
                delivery_date: ['gt', 'gte', 'lt', 'lte', 'equal']
                    // is_archived: ['boolean']
            },
            gridColumns: 'minmax(150px,1fr) minmax(150px,1fr) minmax(120px,1fr) minmax(250px,1fr) 1fr 1fr 1fr;',
            colsTransforms: {
                fullname: () => `Nom complet`.toUpperCase(),
                has_obs: () => `Obs ?`.toUpperCase(),
                email: () => 'Email'.toUpperCase(),
                delivery_date: () => 'Date de livraison'.toUpperCase(),
                booking_date: () => 'Date de réservation'.toUpperCase(),
                is_canceled: () => 'annulé'.toUpperCase(),
                basket_id: () => 'Panier'.toUpperCase()
            },
            cols: [
                'fullname',
                'email',
                'quantity',
                'basket_id',
                'booking_date',
                // 'delivery_date',
                'is_canceled',
                'has_obs'
            ],
            valueTransforms: {
                has_obs: v =>
                    (v.observation || '').split(' ').join('').length > 0 ? 'Oui' : '',
                delivery_date: v => moment(v.delivery_date).format('DD/MM/YYYY'),
                booking_date: v => moment(v.booking_date).format('DD/MM/YYYY'),
                quantity: createEditableColumn({
                    component: 'input-cmp',
                    field: 'quantity',
                    created(component, rowItem, prefetchResult) {
                        component.$emit('set', rowItem.quantity)
                    },
                    save: (newValue, item) => {
                        return {
                            name: 'editBasketBooking',
                            args: [{
                                field: 'quantity',
                                value: newValue,
                                id: item.id,
                                params: {
                                    order_id: item.order_id
                                }
                            }]
                        }
                    }
                }),
                basket_id: createEditableColumn({
                    component: 'select-cmp',
                    field: 'basket_id',
                    prefetch: {
                        cache: 5000,
                        name: 'getBaskets',
                        transform: items => {
                            return items
                                .map(i => {
                                    let date = moment(i.delivery_date)
                                        .add(1, 'day')
                                        .format('DD/MM/YY')
                                    return {
                                        value: i.id,
                                        text: `${date} ${i.title}`,
                                        // text: `${i.title} (${i.description})`,
                                        delivery_date: i.delivery_date,
                                        has_obs: !!i.observation
                                    }
                                })
                                .sort((a, b) => {
                                    return a.delivery_date > b.delivery_date ? -1 : 1
                                })
                        }
                    },
                    created(component, rowItem, prefetchResult) {
                        component.$emit('set', {
                            selected: rowItem.basket_id,
                            items: prefetchResult
                                // transform: v => ({ value: v.id, text: v.description })
                        })
                    },
                    save: (selected, item) => {
                        item.delivery_date = selected.delivery_date
                        return {
                            name: 'editBasketBooking',
                            args: [{
                                field: 'basket_id',
                                value: selected.value,
                                id: item.id,
                                params: {
                                    order_id: item.order_id
                                }
                            }]
                        }
                    }
                }),
                is_canceled: createEditableColumn({
                    component: 'toggle-component',
                    field: 'is_canceled',
                    created(component, rowItem, prefetchResult) {
                        component.$emit('set', rowItem.is_canceled)
                    },
                    save: (newValue, item) => {
                        item.is_canceled = newValue ? 1 : 0
                        return {
                            name: 'editBasketBooking',
                            args: [{
                                field: 'is_canceled',
                                value: newValue,
                                id: item.id,
                                params: {
                                    order_id: item.order_id
                                }
                            }]
                        }
                    }
                })
            },
            items: [],
            exportCSV(data, table) {
                let date = require('moment-timezone')()
                    .tz('Europe/Paris')
                    .format('DD-MM-YYYY-[a]-HH-mm')

                data = data.filter(d => !d.is_archived)
                data = data.map(single => {
                    single.observation = single._data.observation
                    delete single.is_canceled
                    delete single.has_obs
                    single.basket_title = single._data.basket_title
                    single.basket_description = single._data.basket_description
                        .replace(/\n|\r/g, ' / ')
                        .trim()
                    return single
                })

                return {
                    data,
                    filename: `basket-hot-commandes-${date}`
                }
            }
        }
    },
    computed: {
        filteredItems() {
            var items = this.items
            items = items.map(item => {
                if (parseInt(item.is_canceled) === 1) {
                    item._rowClass = 'canceled_row'
                } else {
                    item._rowClass = ''
                }
                return item
            })
            return items
        }
    },
    methods: {
        onPagination(p){
            Object.assign(this.paginator,p)
            this.refresh()
        },
        rowClick(id, value) {
            this.modal = 'orderDetails'
            this.modalParams = {
                id: value.orderId
            }
        },
        async refresh() {
            let {data, count} = await window.api.funql({
                name: 'getDashboardData',
                args: [{
                    showArchived: this.showArchived, 
                    showCanceled: this.showCanceled,
                    _paginate: Object.assign({},this.paginator)
                }],
                transform: function(items) {
                    //let {showArchived, showCanceled} = args[0]
                    //items=  items.filter(i => (i.is_archived == showArchived ? 1 : 0))
                    //items=  items.filter(i => (i.is_canceled == showCanceled ? 1 : 0))
                    return items
                }
            })
            this.items = data
            this.paginator.count = count
        },
        toggleArchived() {
            this.showArchived = !this.showArchived
            this.refresh()
        },
        toggleCanceled() {
            this.showCanceled = !this.showCanceled
            this.refresh()
        }
    },
    created(){
        
    },
    mounted() {
        if(!this.isLogged){
            window.toggleToolbar && window.toggleToolbar()
            return this.$router.push({
                name:'home'
            })
        }
        this.refresh()
        
        this.$refs.toggleCanceled.$emit('set', this.showCanceled)
        this.$refs.toggleArchived.$emit('set', this.showArchived)
    }
}