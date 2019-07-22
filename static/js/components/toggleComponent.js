Vue.component('toggle-component', {
    template: `
        <div class="toggle_component" ref="root" @click="toggle">
            <div :class="!this.value?'left active':'left'">
                <span v-show="!value">N</span>
            </div>
            <div :class="this.value?'right active':'right'">
                <span v-show="value">O</span>
            </div>
        </div>
    `,
    data() {
        return {
            styles: `
            .toggle_component{
                width:40px;
                display: grid;
                grid-template-columns: 20px 20px;
                background-color:whitesmoke;
                cursor:pointer;
                height: 20px;
                align-self: center;
            }
            .toggle_component .left,.toggle_component .right{
                height:20px;
                width:20px;
                display: flex;

justify-content: center;

align-items: center;
            }
            .toggle_component .left{
                background-color:transparent;
            }
            .toggle_component span{
                font-size: 10px;
            }
            .toggle_component .right span{
                color:white
            }
            .toggle_component .left.active{
                background-color:#ddcde7;
            }
            .toggle_component .right{
                background-color:transparent;
            }
            .toggle_component .right.active{
                background-color:#975d50;
            }
            
            @media only screen and (max-width: 639px) {
                
            }
        `,
            value: false
        }
    },
    computed: {},
    methods: {
        toggle() {
            this.value = !this.value
            this.$emit('toggle', this.value)
        }
    },
    mounted() {
        let styles = document.createElement('style')
        styles.setAttribute('scoped', '')
        styles.innerHTML = this.styles
        this.$refs.root.appendChild(styles)

        this.$on('set', v => {
            this.value = v
        })

        this.$emit('mounted', this)
    }
})