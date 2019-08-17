import {
    default as stylesMixin,
    template as styleMixinTmpl
} from '../mixins/styles'

Vue.component('basket-details', {
    props: ['params'],
    mixins: [stylesMixin],
    template: styleMixinTmpl(`
        <div class="add_basket" ref="root">
            <h2 v-html="title"></h2>
            <div class="form_group">
                <label>Title</label>
                <input type="text" v-model="form.title" />
            </div>
            <div class="form_group">
                <label>Description <span>(Qu'est-ce qu'il y a à l'intérieur)</span></label>
                <textarea type="text" v-model="form.description">
                </textarea>
            </div>
            <div class="form_group">
                <label>Quantité produite</label>
                <input type="text" v-model="form.quantity" />
            </div>
            <div class="form_group">
                <label>Date de livraison</label>
                <input type="text" id="datepicker" ref="delivery_date" />
            </div>
            <div class="form_group">
                <label>Priority
                <span>Règle de tri lors de la réservation du client</span>
                </label>
                <input type="number" step="1" v-model="form.priority" />
            </div>
            <div class="form_group" v-show="form.id" v-if="false">
                <label>Liste de réservation</label>
                <div>
                    <table-component :items="form.bookings" :colsTransforms="bookingList.colsTransforms" :valueTransforms="bookingList.valueTransforms" :cols="bookingList.cols" @clickRow="p=>$emit('editBasketBookingItem', p)"
                    :gridColumns="bookingList.gridColumns"
                    ></table-component>
                </div>
            </div>
            
            <div class="form_group">
                <label>Prix</label>
                <input type="text" v-model="form.price" />
            </div>
            <div class="form_group" v-show="!form.id">
                <label>Les abonnés</label>
                <toggle-component ref="toggleSubscribers" @toggle="()=>form.bulkSubscribers=!form.bulkSubscribers"></toggle-component>
                <p></p>
                <p class="quote">Cela ajoutera en masse tous les clients abonnés.</p>
            </div>
            <div class="btn_group">
                <button class="btn" @click="save">Enregistrer</button>
                
                <button class="btn btn-black" @click="()=>archive(true)" v-show="form.id&&form.is_archived===0">Archiver</button>
                <button class="btn btn-black" @click="()=>archive(false)" v-show="form.id&&form.is_archived===1">Désarchiver</button>
                <button class="btn btn-danger" @click="()=>remove()" v-show="form.id">Effacer</button>
            </div>
        </div>
    `),
    data() {
        var self = this
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
            label span{
                font-size:9px;
            }
            input{
                margin: 10px 0px;
padding: 5px 20px;
            }
            .btn_group{
                margin-top:30px;
            }
            textarea{
                min-height:100px;
            }
            @media only screen and (max-width: 639px) {
                
            }
            @media only screen and (max-width: 1047px) {
                
            }
            @media only screen and (min-width: 1048px) {
                
            }
        `,
            bookingList: {
                colsTransforms: {
                    is_canceled: () => 'Annulé'.toUpperCase(),
                    is_subscriber: () => `est abonné`.toUpperCase()
                },
                valueTransforms: {
                    date: v => moment(v.date).format('DD/MM/YYYY HH[h]mm'),
                    is_subscriber: v => (v.is_subscriber ? `Oui` : ``),
                    is_canceled: v => ({
                        component: 'toggle-component',
                        params: {},
                        mounted(cmp) {
                            cmp.$emit('set', !!v.is_canceled)
                            cmp.$on('toggle', isToggled => {
                                v.is_canceled = isToggled ? 1 : 0

                                api.funql({
                                    name: 'toggleBasketBookingCanceled',
                                    args: [v.id, v.is_canceled]
                                })

                                self.$forceUpdate()
                            })
                        }
                    })
                },
                cols: ['email', 'date', 'is_canceled', 'is_subscriber'],
                gridColumns: '1fr 1fr 1fr 1fr'
            },
            form: {
                bulkSubscribers: false,
                delivery_date: '',
                bookings: []
            },
            formCopy: {},
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
        async remove() {
            let msg = `Vous êtes sûr de vouloir supprimer ce panier? Les informations du client saisies lors de la réservation seront conservées.`
            if (window.confirm(msg)) {
                await api.funql({
                    name: 'removeBasket',
                    args: [this.form.id]
                })
                this.$emit('onDirty', false)
                this.$emit('close')
            }
        },
        async archive(willArchive) {
            let msg = `Les paniers archivés seront cachés dans la table principale. Vous pourrez éventuellement afficher les éléments archivés.`
            if (willArchive) {
                if (window.confirm(msg)) {
                    this.form.is_archived = 1
                    await this.save()
                }
            } else {
                this.form.is_archived = 0
                await this.save()
            }
        },
        async save(closeAfter = true) {
            var alertMsg = v => alert(`Champs requis: ${v}`)

            if (!this.form.description) return alertMsg(`Description requis`)
            if (!this.form.quantity) return alertMsg('Quantité produite requis')
            if (!this.form.price) return alertMsg('Prix requis')
            if (!this.form.delivery_date) return alertMsg('Date de livraison requis')

            if (!this.form.id) {
                this.form.creation_date = Date.now()
            }

            this.baskets = await window.api.funql({
                name: 'saveBasket',
                args: [this.form]
            })
            this.$emit('onDirty', false)
            this.$emit('close')
        },
        async fetchDetails(id) {
            this.form = await window.api.funql({
                name: 'getBasket',
                args: [id]
            })
            this.formCopy = Object.assign({}, this.form)
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
                self.form.delivery_date = this.getMoment()._d.getTime()
            }
        })

        if (this.params.mode === 'edit') {
            this.fetchDetails(this.params.id)
        } else {
            this.formCopy = Object.assign({}, this.form)
        }

        this.$watch(
            'form',
            () => {
                if (getObjectDiff(this.form, this.formCopy).length !== 0) {
                    this.$emit('onDirty', true)
                } else {
                    this.$emit('onDirty', false)
                }
            }, {
                deep: true
            }
        )

        function getObjectDiff(obj1, obj2) {
            const diff = Object.keys(obj1).reduce((result, key) => {
                if (!obj2.hasOwnProperty(key)) {
                    result.push(key)
                } else if (_.isEqual(obj1[key], obj2[key])) {
                    const resultKeyIndex = result.indexOf(key)
                    result.splice(resultKeyIndex, 1)
                }
                return result
            }, Object.keys(obj2))

            return diff
        }
    }
})