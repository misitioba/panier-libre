import stylesMixin from '../mixins/styles'
import createEditableColumn from '../utils/createEditableColumn'
import orderDetails from './orderDetails'

// import Vue from 'vue'
Vue.component('orderDetails', orderDetails)

export default {
    mixins: [stylesMixin],
    name: 'dashboard',
    props: [],
    template: `
    <div ref="scope">
        <div class="dashboard" ref="root" >
            <h2>Tableau de bord</h2>
            <div class="btn_group">
                <button class="btn" @click="refresh">Refresh</button>
            </div>
            
            <table-component @rowClick="rowClick" :exportCSV="exportCSV" :filters="tableFilters" :gridColumns="gridColumns" :items="filteredItems" :colsTransforms="colsTransforms" :valueTransforms="valueTransforms" :cols="cols" ></table-component>

            <modal-window ref="modal" :params="modalParams" v-show="!!modal" v-model="modal" @close="modal=''"></modal-window>
        </div>
        </div>
    `,
    data() {
        var self = this
        return {
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
            gridColumns: 'minmax(200px,1fr) minmax(60px,100px) minmax(300px,1fr) 1fr 1fr 1fr 1fr',
            colsTransforms: {
                has_obs: () => `OBS ?`,
                email: () => 'CLIENT',
                delivery_date: () => 'Date de livraison'.toUpperCase(),
                booking_date: () => 'Date de réservation'.toUpperCase(),
                is_canceled: () => 'annulé'.toUpperCase(),
                basket_id: () => 'Panier'.toUpperCase()
            },
            cols: [
                'email',
                'quantity',
                'basket_id',
                'booking_date',
                'delivery_date',
                'is_canceled',
                'has_obs'
            ],
            valueTransforms: {
                has_obs: v => (v ? 'Oui' : ''),
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
                                    let date = moment(i.delivery_date).format('DD/MM/YY')
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

                data = data.map(single => {
                    single.observation = single._data.observation
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
        rowClick(id, value) {
            this.modal = 'orderDetails'
            this.modalParams = {
                id: value.orderId
            }
        },
        async refresh() {
            this.items = await window.api.funql({
                name: 'getDashboardData',
                transform: function(items) {
                    return items
                        // return items.filter(i => i.is_archived === 0)
                }
            })
        }
    },
    mounted() {
        this.refresh()
    }
}