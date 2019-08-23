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
    <div v-show="baskets.length>0" class="form_root">
        
        <div class="section_baskets">
            <div class="bf_title">Paniers</div>
            <bf-baskets-view :baskets="baskets" @select="select"></bf-baskets-view >
        </div>

        <div class="section_baskets_resume">
            <div class="bf_title">Votre commande</div>
            <bf-order-resume v-model="order" @remove="remove" ></bf-order-resume>
            <div class="bf_total">Total <span v-html="getTotal()"></span> €</div>
        </div>
        
        <div class="section_user_details">
            <div class="bf_title">Vos informations</div>
            <input class="formInput" placeholder="votre nom complet" v-model="order.fullname"/>
            <input class="formInput" placeholder="votre email*" v-model="order.email"/>
            <textarea class="formInput" placeholder="observations (facultatif)" v-model="order.observation">
            </textarea>
        </div>
        
        <div class="section_validate">
            <button class="validateButton" @click="validate">Valider</button>
        </div>
    </div>
    <p class="quote_by">Développé par <a target="_blank" href="https://savoie.misitioba.com/">Savoie Tech Coop</a></p>
</div>    
    `),
    data() {
        return {
            styles: `
            .booking_form{
                background-color: white;
                border-radius: 5px;
                border: 2px solid #b5a075;
                padding: 20px;
                margin: 20px;
                box-shadow: 1px 9px 20px #b5a075;
            }
            .bf_title{
                font-size: 25px;

color: #1e7521;

font-weight: bold;
            }
            .bf_total{
                font-size: 24px;
color: white;
margin-top: 15px;
background-color: #0b6a0feb;
padding: 10px 40px;
margin: 10px -20px;
text-align: right;
            }
            .formInput{
                margin-top: 15px;
border: 1px solid #b5a075;
padding: 5px;
font-size: 18px;
display: block;
border-radius: 5px;
            }
            textarea.formInput{
                min-height:150px;
                width: 100%;
    width: -moz-available;          /* WebKit-based browsers will ignore this. */
    width: -webkit-fill-available;  /* Mozilla-based browsers will ignore this. */
    width: fill-available;
            }
            .validateButton:hover{
                color: white;

background-color: #d9aa4c;
            }
            .quote_by{
                font-size: 11px;

margin-top: 50px;

font-style: italic;
            }
            .validateButton{
                color: #b5a075;

                display: block;
                
                margin-top: 15px;
                
                background-color: #1e7521;
                
                border: 0px;
                
                font-size: 15px;
                
                font-weight: bold;
                
                cursor: pointer;
                
                color: white;
                
                padding: 15px;
                
                text-transform: uppercase;
                
                box-shadow: 0px 3px 5px #d9aa4c;
            }

            .form_root{
                display: grid;
                grid-template-columns: 1fr;
                grid-template-areas: 
                'section_baskets'
                'section_baskets_resume'
                'section_user_details'
                'section_validate';
            }
        .section_baskets{
            grid-area: section_baskets;
        }
        .section_baskets_resume{
            grid-area: section_baskets_resume;
        }
        .section_user_details{
            grid-area: section_user_details;
        }
        .section_validate{
            grid-area: section_validate;
        }
        @media only screen and (max-width: 639px) {
                
        }
        @media only screen and (max-width: 1047px) {
            
        }
        @media only screen and (min-width: 1248px) {
            .bf_total{
                margin:10px 0px;
            }
            .form_root{
                display: grid;
                grid-template-columns: 70% 30%;
                grid-template-areas: 
                'section_baskets section_baskets_resume '
                'section_user_details section_validate'
            }
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
            if (!this.order.fullname) return alert('Nom complet requis')
            if (!this.order.email) return alert('Email requis')
            if (this.order.items.length === 0) return alert(`Vous devez d'abord sélectionner un panier`)

            try {
                let r = await api.funql({
                    name: 'saveCustomerOrder',
                    args: [
                        Object.assign({
                                umid: window._um_id
                            },
                            this.order, {
                                items: this.order.items.map(item => {
                                    let newItem = Object.assign({}, item)
                                    delete newItem.description
                                    delete newItem.title
                                    return newItem
                                })
                            }
                        )
                    ]
                })
                r = r.data ? r.data : r
                alert('Merci, la réservation est confirmée!')
                this.order = {
                    email: '',
                    items: []
                }
            } catch (err) {
                if (err.code === 'NOT_AVAILABLE') {
                    return alert(
                        err.message ||
                        `Le type de panier sélectionné pour la date sélectionnée est déjà réservé en totalité`
                    )
                }
                alert(
                    `En ce moment n'est pas possible de confirmer la réservation, s'il vous plaît essayez plus tard ou contactez-nous par email`
                )
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
            let result = await api.funql({
                name: 'getBaskets',
                args: [{
                    umid: window._um_id
                }],
                transform: function(result) {
                    return result
                        .filter(r => {
                            if (r.is_archived) return false
                            if (!moment(r.delivery_date).isSameOrAfter(moment(), 'day')) {
                                return false
                            }
                            return true
                        })
                        .map(a => {
                            if (!a.priority) a.priority = 9999
                            return a
                        })
                        .sort((a, b) => {
                            return a.priority > b.priority ? 1 : -1
                        })
                }
            })
            this.baskets = result.data ? result.data : result
            this.fetched = true
        }
    },
    created() {},
    mounted() {
        this.fetchBaskets()
    }
})