export default {
    props: [],
    template: `
        <div class="integration_page" ref="root" @keyup.enter="save" tabindex="0" @keyup.esc="$router.push('/')">
            <h2>l'intégration</h2>
            
            <div class="editor" ref="editor">
            
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

            /*
            CONFIGURATION:
            'el' indicates the root element to attach the generated form from.
            'body' will attach the form on the top of the page.
            So, for attaching the form in the bottom, add a custom html tag and indicate his id like:

            form.generate({
                el:'#formWrapper'
            })

            */
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
            .integration_page .editor { 
                position: relative;
                min-height: 400px;
                margin-bottom: 50px;
              }
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

        var editor = ace.edit(this.$refs.editor)
        editor.setTheme('ace/theme/clouds')
        editor.getSession().setMode('ace/mode/javascript')
        editor.setShowFoldWidgets(false)
    }
}