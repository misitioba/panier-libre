var IntegrationPage = {
    props: [],
    template: `
        <div class="integration_page" ref="root" @keyup.enter="save" tabindex="0" @keyup.esc="$router.push('/')">
            <h2>l'intégration</h2>
            <div class="form_group">
                <p>
                <code>
                
                (()=>{
                    var URI = 'https://savoie.misitioba.com';
                    fetch(URI+'/basket-hot/client').then(t=>t.text()).then(script=>{
                        eval(script);
                        form.generate({
                            el: 'body',
                            prepend: true
                        });
                    })
                })();

                </code>
                </p>
            </div>
            
            <div class="btn_group">
            
                <button class="btn" @click="()=>$router.push('/')">Retour</button>
            </div>
        </div>
    `,
    data() {
        return {
            styles: `
            .integration_page{}
            @media only screen and (max-width: 639px) {
                
            }
        `,
            form: {}
        }
    },
    computed: {},
    methods: {},
    mounted() {
        let styles = document.createElement('style')
        styles.setAttribute('scoped', '')
        styles.innerHTML = this.styles
        this.$refs.root.appendChild(styles)
    }
}