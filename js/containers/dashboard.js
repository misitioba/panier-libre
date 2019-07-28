import stylesMixin from '../mixins/styles'
import createEditableColumn from '../utils/createEditableColumn'
export default {
    mixins: [stylesMixin],
    name: 'dashboard',
    props: [],
    template: `
    <div ref="scope">
        <div class="dashboard" ref="root" tabindex="0" @keyup.esc="$router.push('/')">
            <h2>Les réservations</h2>
            <div class="btn_group">
                <button class="btn" @click="refresh">Refresh</button>
            </div>
            
            <table-component :gridColumns="gridColumns" :items="items" :colsTransforms="colsTransforms" :valueTransforms="valueTransforms" :cols="cols" ></table-component>
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
            gridColumns: '1fr 1fr 1fr 1fr 1fr 1fr',
            colsTransforms: {
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
                'is_canceled'
            ],
            valueTransforms: {
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
                                id: item.id
                            }]
                        }
                    }
                }),
                basket_id: createEditableColumn({
                    component: 'select-cmp',
                    field: 'basket_id',
                    prefetch: {
                        name: 'getBaskets',
                        transform: items => {
                            return items.map(i => {
                                return {
                                    value: i.id,
                                    text: i.description,
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
                                id: item.id
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
                        return {
                            name: 'editBasketBooking',
                            args: [{
                                field: 'is_canceled',
                                value: newValue,
                                id: item.id
                            }]
                        }
                    }
                })
            },
            items: []
        }
    },
    computed: {},
    methods: {
        async refresh() {
            this.items = await window.api.funql({
                name: 'getDashboardData',
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