Vue.component('modal-window', {
    props: ['value', 'params'],
    template: `
        <div class="modal_window" ref="root" @click="close">
            <div class="modal_body" @click="stopPropagation">
            <component v-bind:is="value" @close="close" :params="params"></component>
            </div>
        </div>
    `,
    data() {
        return {
            styles: `
            .modal_window{
                position:fixed;
                top:0px;
                left:0px;
                width: calc(100vw);
                height: calc(100vh);
                background-color:rgba(0,0,0,.8);
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

        }
    },
    computed: {

    },
    methods: {
        stopPropagation(e) {
            e.stopPropagation();
        },
        close() {
            if (window.confirm('Close? Will lose any unsaved modification')) {
                this.$emit('close')
            }
        }
    },
    mounted() {
        let styles = document.createElement('style')
        styles.setAttribute('scoped', '')
        styles.innerHTML = this.styles
        this.$refs.root.appendChild(styles)

    }
})