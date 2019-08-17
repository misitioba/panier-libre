Vue.component('modal-window', {
    props: ['value', 'params'],
    template: `
        <div class="modal_window" ref="root" @click="close" @keyup.enter="submit" @keyup.esc="close" tabindex="0">
            
            <div class="modal_body" @click="stopPropagation">
            <i class="fas fa-times modal_window__close" @click="close"></i>
            <component ref="cmp" @onDirty="v=>isDirty=v" v-bind:is="value" @close="close" :params="params"></component>
            </div>
        </div>
    `,
    data() {
        var self = this
        return {
            isDirty: false,
            styles: `
            .modal_window{
                position:fixed;
                top:0px;
                left:0px;
                width: calc(100vw);
                height: calc(100vh);
                background-color:rgba(0,0,0,.8);
                overflow-y: auto;
            }
            .modal_window .modal_window__close{
                float: right;
font-size: 30px;
cursor:pointer;
            }
            .modal_body{
                background-color: white;
margin: 20px;
border-radius: 5px;
padding: 15px;
            }
            @media only screen and (max-width: 639px) {
                
            }
        `,
            onEscape(e) {
                if (e.which == 27) {
                    self.close()
                }
            }
        }
    },
    computed: {},
    methods: {
        submit() {
            this.$refs.cmp.$emit('submit')
        },
        stopPropagation(e) {
            e.stopPropagation()
        },
        close() {
            let needsConfirmation = this.isDirty
            if (!needsConfirmation ||
                window.confirm('Fermer? Vous risquez de perdre des modifications')
            ) {
                this.$emit('close')
            }
        },
        bindEscape() {
            $(window.document).on('keydown', this.onEscape)
        }
    },
    destroyed() {
        $(window.document).off('keydown', this.onEscape)
    },
    mounted() {
        let styles = document.createElement('style')
        styles.setAttribute('scoped', '')
        styles.innerHTML = this.styles
        this.$refs.root.appendChild(styles)

        this.bindEscape()
    }
})