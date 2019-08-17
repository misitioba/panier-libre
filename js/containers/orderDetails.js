import {
    default as stylesMixin,
    template as styleMixinTmpl
} from '../mixins/styles'

export default {
    props: ['params'],
    mixins: [stylesMixin],
    template: styleMixinTmpl(`
        <div class="order_details" ref="root">
            <h2 >Détails de la commande</h2>
            <div class="form_group">
                <label>ID</label>
                <input readonly type="text" v-model="form.id" />
            </div>
            <div class="form_group">
                <label>Email</label>
                <input readonly type="text" v-model="form.email" />
            </div>
            <div class="form_group">
                <label>Est abonné ?</label>
                <input readonly type="text" :value="form.is_subscriber ? 'Oui' : 'No'" />
            </div>
            <div class="form_group">
                <label>Date</label>
                <input readonly readonly type="text" :value="formattedDate" />
            </div>
            <div class="form_group">
                <label>Observation</label>
                <textarea readonly type="text" v-model="form.observation" >
                </textarea>
            </div>
            <div class="btn_group" v-if="false">
                <button class="btn" @click="save">Enregistrer</button>
                <!--
                <button class="btn btn-black" @click="()=>archive(true)" v-show="form.id&&form.is_archived===0">Archiver</button>
                <button class="btn btn-black" @click="()=>archive(false)" v-show="form.id&&form.is_archived===1">Désarchiver</button>
                <button class="btn btn-danger" @click="()=>remove()" v-show="form.id">Effacer</button>
                -->
            </div>
        </div>
    `),
    data() {
        var self = this
        return {
            styles: `
            
            @media only screen and (max-width: 639px) {
                
            }
            @media only screen and (max-width: 1047px) {
                
            }
            @media only screen and (min-width: 1048px) {
                
            }
        `,

            form: {
                id: '',
                email: '',
                is_subscriber: 0,
                creation_date: '',
                bookings: []
            }
        }
    },
    computed: {
        formattedDate() {
            return moment(this.form.creation_date).format('DD/MM/YYYY')
        }
    },
    methods: {
        async save(closeAfter = true) {},
        async fetchDetails() {
            let id = null
            if (this.params && this.params.id) {
                id = this.params.id
            } else {
                id = this.$route.params.id
            }
            this.form = await window.api.funql({
                name: 'getOrder',
                args: [id]
            })
        }
    },
    mounted() {
        var self = this
        this.fetchDetails()
    }
}