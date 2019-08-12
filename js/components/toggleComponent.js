Vue.component('toggle-component', {
    props: ['value'],
    template: `
        <div class="toggle_component" ref="root" @click="toggle">
            <div :class="!this.scopeValue?'left active':'left'">
                <span v-show="!scopeValue">N</span>
            </div>
            <div :class="this.scopeValue?'right active':'right'">
                <span v-show="scopeValue">O</span>
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
            scopeValue: this.scopeValue !== undefined ? this.value : false
        }
    },
    computed: {},
    methods: {
        toggle() {
            this.scopeValue = !this.scopeValue
            this.$emit('toggle', this.scopeValue)
            this.$emit('input', this.scopeValue)
        }
    },
    mounted() {
        let styles = document.createElement('style')
        styles.setAttribute('scoped', '')
        styles.innerHTML = this.styles
        this.$refs.root.appendChild(styles)

        this.$on('set', v => {
            this.scopeValue = v
        })

        this.$emit('mounted', this)
    }
})