import stylesMixin from '../mixins/styles'

Vue.component('app-footer', {
    mixins: [stylesMixin],
    props: [],
    template: `
<div ref="scope">
    <div class="common_footer" ref="root">
        <p>Vous souhaitez utiliser cet outil à l'intérieur de votre organisation? Faites le nous savoir!</p>
        <input v-model="email" placeholder="email@quelquechose.com" />
        <button class="btn send" @click="send">Envoyer!</button>
        <p class="italic">Basket hot est actuellement développé par MisitioBA (IE) dans le cadre du projet Savoie Tech Coop, qui a pour mission de dynamiser les associations et les coopératives locales avec des outils numériques.</p>
    </div>
</div>
    `,
    destroyed() {},
    methods: {
        async send() {
            if (!this.email) return alert('Email est requis')
            try {
                let data = {
                    email: this.email,
                    message: `APP_FOOTER_CTA`,
                    creation_date: Date.now()
                }
                murlytics.track({ name: 'APP_FOOTER_CONTACT_FORM', ...data })
                await api.funql({
                    name: 'contactForm',
                    args: [data]
                })
                this.email = ''
                alert(`Fort et clair, merci !. Nous vous contacterons bientôt.`)
            } catch (err) {
                alert(
                    `Ups... Quelque chose est cassé. Pouvez-vous essayer votre page facebook?`
                )
            }
        }
    },
    computed: {},
    async mounted() {},
    data() {
        return {
            email: '',
            styles: `
                .common_footer{
                    padding:50px;
                    flex-direction: column;
                    min-height:200px;
                    background-color:#b5a0755e;
                    color:#2e5b26;
                    display: flex;
align-content: center;
justify-items: center;
                }
                p{
                    text-align: center;
height: max-content;
display: block;
align-self: center;
                }
                input,button{
                    max-width:200px;
                    margin:0 auto;
                    display:block;
                }
                
                .send{
                    margin-top:15px;
                    text-align:center;
                }
                .italic{
                    font-style:italic;
                    font-size:12px;
                }
`
        }
    }
})