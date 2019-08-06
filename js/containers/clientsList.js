export default {
    name: 'clients-list',
    props: [],
    template: `
        <div class="clients_list" ref="root" tabindex="0" @keyup.esc="$router.push('/')">
            <div class="btn_group">
                <button class="btn" @click="refresh">Refresh</button>
                <button class="btn" @click="addClient">Ajouter</button>
                <button class="btn" @click="()=>$router.push('/')">Retour</button>
            </div>
            
            <table-component :gridColumns="gridColumns" :items="items" :colsTransforms="colsTransforms" :valueTransforms="valueTransforms" :cols="cols" @clickRow="editClient"></table-component>
            
            <modal-window ref="modal" v-show="!!modal.cmp" v-model="modal.cmp" :params="modal.params" @close="modal.close"></modal-window>

        </div>
    `,
    data() {
        var self = this
        return {
            styles: `
            .clients_list{
            
            }
            
            @media only screen and (max-width: 639px) {
                
            }
        `,
            gridColumns: '1fr 1fr 1fr',
            colsTransforms: {
                // email: () => 'Date de livraison'.toUpperCase(),
                creation_date: () => `créé à`.toUpperCase(),
                is_subscriber: () => `est abonné`.toUpperCase()
            },
            cols: ['email', 'creation_date', 'is_subscriber'],
            valueTransforms: {
                creation_date: v => moment(v.creation_date).format('DD/MM/YYYY'),
                is_subscriber: v => ({
                    component: 'toggle-component',
                    params: {},
                    mounted(cmp) {
                        cmp.$emit('set', !!v.is_subscriber)
                        cmp.$on('toggle', isToggled => {
                            v.is_subscriber = isToggled ? 1 : 0

                            api.funql({
                                name: 'toggleSubscriber',
                                args: [v.id, v.is_subscriber]
                            })

                            self.$forceUpdate()
                        })
                    }
                })
            },
            items: [],
            modal: {
                cmp: '',
                params: {},
                close: () => {
                    this.modal.cmp = ''
                    this.refresh()
                }
            }
        }
    },
    computed: {},
    methods: {
        editClient(id) {
            this.modal.params.id = id
            this.modal.cmp = 'client-details'
        },
        addClient() {
            this.modal.cmp = 'client-details'
        },
        async refresh() {
            this.items = await window.api.funql({
                name: 'getClients',
                transform: function(items) {
                    return items
                }
            })
        }
    },
    mounted() {
        let styles = document.createElement('style')
        styles.setAttribute('scoped', '')
        styles.innerHTML = this.styles
        this.$refs.root.appendChild(styles)
        this.refresh()
    }
}

Vue.component('client-details', {
    props: ['params'],
    template: `
        <div class="client_details" ref="root">
            <div class="form_group">
                <label>Nom complet</label>
                <input type="text" v-model="form.fullname" />
            </div>
            <div class="form_group">
                <label>Email</label>
                <input type="text" v-model="form.email" />
            </div>
            <div class="form_group">
                <label>Téléphone</label>
                <input type="text" v-model="form.phone" />
            </div>
            <div class="form_bottom_btn_group">
                <button class="btn" @click="save">Enregistrer</button>
            </div>
        </div>
    `,
    data() {
        return {
            styles: `
        .client_details{
            padding-top:50px;
        }
    `,
            form: {
                email: ''
            }
        }
    },
    methods: {
        async fetch() {
            if (this.params.id) {
                this.form = await window.api.funql({
                    name: 'getClient',
                    args: [this.params.id]
                })
            }
        },
        async save() {
            this.form.creation_date = Date.now()
            await window.api.funql({
                name: 'saveClient',
                args: [Object.assign({}, this.form)]
            })
            this.$emit('onDirty', false)
            this.$emit('close')
        }
    },
    mounted() {
        let styles = document.createElement('style')
        styles.setAttribute('scoped', '')
        styles.innerHTML = this.styles
        this.$refs.root.appendChild(styles)
        this.fetch()
        this.$on('submit', this.save)
    }
})