Vue.component('add-basket', {
    props: ['params'],
    template: `
        <div class="add_basket" ref="root">
            <h2 v-html="title"></h2>
            <div class="form_group">
                <label>Ce qu'il y a dedans</label>
                <input type="text" v-model="form.description" />
            </div>
            <div class="form_group">
                <label>Quantité produite</label>
                <input type="text" v-model="form.quantity" />
            </div>
            <div class="form_group">
                <label>Date de livraison</label>
                <input type="text" id="datepicker" ref="delivery_date" />
            </div>
            <div>
                <button class="btn" @click="save">Enregistrer</button>
                <button class="btn" @click="$emit('close')">Annuler et fermer</button>
            </div>
        </div>
    `,
    data() {
        return {
            styles: `
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
                margin: 10px;
padding: 5px 20px;
            }
            @media only screen and (max-width: 639px) {
                
            }
        `,
            form: {
                delivery_date: ''
            },
            defaults: {
                title: 'Ajouter un panier'
            },
            pickers: {
                delivery_date: ''
            }
        }
    },
    computed: {
        title() {
            if (this.params.title) return this.params.title
            return this.defaults.title
        }
    },
    methods: {
        async save() {
            this.baskets = await window.api.funql({
                name: "saveBasket",
                args: [this.form]
            })
        },
        async fetchDetails(id) {
            this.form = await window.api.funql({
                name: "getBasket",
                args: [id]
            })
            this.pickers.delivery_date.setMoment(moment(this.form.delivery_date))
        }
    },
    mounted() {
        let styles = document.createElement('style')
        styles.setAttribute('scoped', '')
        styles.innerHTML = this.styles
        this.$refs.root.appendChild(styles)

        var self = this
        this.pickers.delivery_date = new Pikaday({
            field: this.$refs.delivery_date,
            format: 'DD/MM/YYYY',
            onSelect: function() {
                self.form.delivery_date = this.getMoment().unix()
            }
        })

        if (this.params.mode === 'edit') {
            this.fetchDetails(this.params.id)
        }


    }
})