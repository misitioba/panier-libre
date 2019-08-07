import stylesMixin from '../mixins/styles'
import createEditableColumn from '../utils/createEditableColumn'
export default {
    mixins: [stylesMixin],
    name: 'dashboard',
    props: [],
    template: `
    <div ref="scope">
        <div class="dashboard" ref="root" tabindex="0" @keyup.esc="$router.push('/')">
            <h2>Commandes</h2>
            <div class="btn_group">
                <button class="btn" @click="refresh">Refresh</button>
            </div>
            
            <table-component @rowClick="rowClick" :filters="tableFilters" :gridColumns="gridColumns" :items="filteredItems" :colsTransforms="colsTransforms" :valueTransforms="valueTransforms" :cols="cols" ></table-component>
        </div>
        </div>
    `,
    data() {
        var self = this
        return {
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
            },
            gridColumns: '1fr 1fr 1fr',
            colsTransforms: {
                orderId: () => 'id'.toUpperCase(),
                email: () => 'CLIENT',
                creation_date: () => 'date de création'.toUpperCase(),
                booking_date: () => 'Date de réservation'.toUpperCase(),
                is_canceled: () => 'annulé'.toUpperCase(),
                basket_id: () => 'Panier'.toUpperCase()
            },
            cols: ['orderId', 'email', 'creation_date'],
            valueTransforms: {
                creation_date: v => moment(v.delivery_date).format('DD/MM/YYYY'),
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
                            return items.map(i => {
                                return {
                                    value: i.id,
                                    text: `${i.title} (${i.description})`,
                                    delivery_date: i.delivery_date
                                }
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
            items: []
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
        rowClick(itemId, item) {
            this.$router.push({
                name: 'order-details',
                params: {
                    id: item.orderId
                }
            })
        },
        async refresh() {
            this.items = await window.api.funql({
                name: 'getOrders',
                transform: function(items) {
                    return items
                }
            })
        }
    },
    mounted() {
        this.refresh()
    }
}