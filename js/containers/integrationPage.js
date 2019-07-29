export default {
    props: [],
    template: `
        <div class="integration_page" ref="root" @keyup.enter="save" tabindex="0" @keyup.esc="$router.push('/')">
            <h2>l'intégration</h2>
            
            <div class="editor" ref="editor">
            
            
                (function(){
                    var URI = '${window.publicPath}';
                    let s = document.createElement('script')
                    s.src = URI+'/basket-hot/booking_form_client.js?callback=initstcbh'
                    document.querySelector('body').append(s)
                    window.initstcbh = function (app){
                        app.mount('CSS_SELECTOR')
                    }
                })();
            

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