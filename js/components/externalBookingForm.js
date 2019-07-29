import {
    default as stylesMixin,
    template as styleMixinTmpl
} from '../mixins/styles'
import './bfBasketsView'
import './bfOrderResume'

Vue.component('booking-form', {
    props: [],
    mixins: [stylesMixin],
    template: styleMixinTmpl(`
    <div class="booking_form" ref="root" v-show="true">
    <div v-show="baskets.length===0 && fetched">
        <div class="bf_title">Il n'y a pas de paniers disponibles. Essayer plus tard.</div>
    </div>
    <div v-show="baskets.length===0 && !fetched">
        <div class="bf_title">Chargement...</div>
    </div>
    <div v-show="baskets.length>0">
        <div class="bf_title">Paniers disponibles</div>
        <bf-baskets-view :baskets="baskets" @select="select"></bf-baskets-view >
        <div class="bf_title">Votre commande</div>
        <bf-order-resume v-model="order" @remove="remove" ></bf-order-resume>
        <div class="bf_total">Total <span v-html="getTotal()"></span></div>
        <input class="emailInput" placeholder="votre email" v-model="order.email"/>
        <button class="validateButton" @click="validate">Valider</button>
    </div>
</div>    
    `),
    data() {
        return {
            styles: `
            .booking_form{
                background-color: white;
border-radius: 5px;
border: 3px solid #93c54b;
padding: 20px;
            }
            .bf_title{
                font-size:25px;
                color:#374425;
            }
            .bf_total{
                font-size: 24px;
color: white;
margin-top: 15px;
background-color: #93c54b;
padding: 20px;
            }
            .emailInput{
                margin-top:15px;
                border: 1px solid #93c54b;
padding: 5px;
font-size: 14px;
            }
            .validateButton:hover{
                color: white;
                background-color: #93c54b;
            }
            .validateButton{
                color: #93c54b;
display: block;
margin-top: 15px;
background-color: white;
border: 2px solid #93c54b;
font-size: 18px;
font-weight: bold;
cursor: pointer;
            }
            `,
            order: {
                email: '',
                items: []
            },
            baskets: [],
            selected: [],
            fetched: false
        }
    },
    computed: {},
    methods: {
        getTotal() {
            // array.reduce(function(total, currentValue, currentIndex, arr), initialValue)
            return this.order.items.reduce((t, cv, ci, arr) => {
                return t + cv.total
            }, 0)
        },
        async validate() {
            if (!this.order.email) return alert('Email requis')
            try {
                let r = await api.funql({
                    name: 'saveCustomerOrder',
                    args: [Object.assign({}, this.order, {
                        items: this.order.items.map(item => {
                            return Object.assign({}, item)
                        })
                    })]
                })
                r = r.data ? r.data : r
                if (r.err) throw new Error(r.err)
                alert('Merci, la réservation est confirmée!')
            } catch (err) {
                err = err.message || err
                if (err === 'NOT_AVAILABLE') {
                    return alert(
                        `Le type de panier sélectionné pour la date sélectionnée est déjà réservé en totalité`
                    )
                } else {
                    console.warn(err)
                    alert(
                        `En ce moment n'est pas possible de confirmer la réservation, s'il vous plaît essayez plus tard ou contactez-nous par email`
                    )
                }
            }
        },
        remove(item) {
            this.order.items = this.order.items.filter(i => i.id != item.id)
        },
        select(item) {
            if (!this.order.items.find(i => i.id == item.id)) {
                this.order.items.push({
                    id: item.id,
                    quantity: 1,
                    title: item.title,
                    description: item.description,
                    price: item.price,
                    total: item.price
                })
            }
        },
        async fetchBaskets() {
            let result = (await api.funql({
                name: 'getBaskets',
                transform: function (result) {
                    return result.filter(r => {
                        if (r.is_archived) return false
                        if (!moment(r.delivery_date).isSameOrAfter(moment(), 'day')) {
                            return false
                        }
                        return true
                    })
                }
            }))
            this.baskets = result.data ? result.data : result;
            this.fetched = true
        }
    },
    created() { },
    mounted() {
        this.fetchBaskets()
    }
})