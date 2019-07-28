export default {
    props: [],
    template: `
        <div class="book_basket" ref="root" @keyup.enter="save" tabindex="0" @keyup.esc="$router.push('/')">
            <h2>Réservation manuelle</h2>
            <div class="form_group">
                <label>Panier</label>
                <select v-model="form.basket_id" class="select">
                    <option v-for="option in baskets" v-bind:value="option.id" v-html="getBasketSelectDescription(option)">
                    </option>
                </select>
                <p></p>
                <p class="quote">Nous répertorions ici tous les paniers non archivés avec une date de livraison égale ou supérieure à celle d'aujourd'hui.</p>
            </div>
            <div class="form_group" v-show="!form.bulkSubscribers">
                <label>Client</label>
                <select v-model="form.client_id" class="select">
                    <option v-for="option in clients" v-bind:value="option.id" v-html="getClientDescription(option)">
                    </option>
                </select>
                <p></p>
                <p class="quote">Nous répertorions ici tous les paniers non archivés avec une date de livraison égale ou supérieure à celle d'aujourd'hui.</p>
            </div>
            <div class="form_group">
                <label>Les abonnés</label>
                <toggle-component ref="toggleSubscribers" @toggle="()=>form.bulkSubscribers=!form.bulkSubscribers"></toggle-component>
                <p></p>
                <p class="quote">Cela ajoutera en masse tous les clients abonnés au lieu d'un seul email.</p>
            </div>
            <div class="btn_group">
                <button class="btn" @click="save">Enregistrer</button>
                <button class="btn" @click="()=>$router.push('/')">Retour</button>
            </div>
        </div>
    `,
    data() {
        return {
            styles: `
            .book_basket .quote{
                font-size:10px;
            }
            .form_group{
                display: grid;
                grid-template-columns: 150px 1fr;
                grid-template-areas: '1 2';
            }
            label{
                margin: 10px 10px 10px 0px;
                padding:5px 0px;
            }
            input{
                margin: 10px 0px;
                padding: 5px 20px;
            }
            .btn_group{
                margin-top:30px;
            }
            @media only screen and (max-width: 639px) {
                
            }
        `,
            form: {
                email: '',
                basket_id: '',
                bulkSubscribers: false
            },
            baskets: [],
            clients: []
        }
    },
    computed: {},
    methods: {
        getClientDescription(item) {
            return item.email
        },
        getBasketSelectDescription(item) {
            return `${moment(item.delivery_date).format('DD/MM/YYYY')} ${
        item.description
      }`
        },
        async fetchClients() {
            this.clients = await window.api.funql({
                name: 'getClients',
                transform: function(items) {
                    return items
                }
            })
        },
        async fetchBaskets() {
            this.baskets = await window.api.funql({
                name: 'getBaskets',
                transform: function(baskets) {
                    return baskets
                        .sort((a, b) => {
                            return a.delivery_date > b.delivery_date ? 1 : -1
                        })
                        .filter(
                            basket =>
                            basket.is_archived === 0 &&
                            moment(basket.delivery_date).isSameOrAfter(moment(), 'day')
                        )
                }
            })
        },
        async save() {
            if (!this.form.basket_id) return alert('Champs obligatoires: Panier')
            if (!this.form.bulkSubscribers && !this.form.client_id) {
                return alert('Champs obligatoires: Client')
            }
            this.form.date = Date.now()
            try {
                await window.api.funql({
                    name: 'saveBasketBooking',
                    args: [this.form]
                })
                this.$router.push('/')
            } catch (err) {
                if (err === 'BOOKING_EXISTS') {
                    return alert('Ce client avait déjà réservé')
                }
                console.warn(err)
                return alert(ERROR.API)
            }
        }
    },
    mounted() {
        let styles = document.createElement('style')
        styles.setAttribute('scoped', '')
        styles.innerHTML = this.styles
        this.$refs.root.appendChild(styles)
        this.fetchBaskets()
        this.fetchClients()
        this.$refs.toggleSubscribers.$emit('set', this.form.bulkSubscribers)
    }
}